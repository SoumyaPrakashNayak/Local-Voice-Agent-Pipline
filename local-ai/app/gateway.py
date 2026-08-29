"""
AIRA Local AI Gateway & Intent Router — Phase 5
Deterministic sub-millisecond operational command routing with conversational LLM fallback.
"""

import re
import time
from dataclasses import dataclass, field
from typing import Dict, Any, Optional, Tuple, List


@dataclass
class IntentResult:
    """Structured routing outcome from the Local AI Gateway."""
    mode: str                      # "ACTION" or "LLM"
    intent: str                    # e.g., "OPEN_EVIDENCE_VAULT", "OPEN_FIR", "CONVERSATIONAL"
    confidence: float              # 0.0 to 1.0
    parameters: Dict[str, Any] = field(default_factory=dict)
    raw_query: str = ""
    normalized_query: str = ""
    latency_ms: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "mode": self.mode,
            "intent": self.intent,
            "confidence": self.confidence,
            "parameters": self.parameters,
        }

    def __str__(self) -> str:
        if self.mode == "ACTION":
            param_str = f", params={self.parameters}" if self.parameters else ""
            return f"IntentResult(ACTION: {self.intent}, conf={self.confidence:.2f}{param_str}, {self.latency_ms:.2f}ms)"
        return f"IntentResult(LLM: {self.intent}, conf={self.confidence:.2f}, {self.latency_ms:.2f}ms)"


class LocalGateway:
    """
    Local AI Gateway & Intent Router for AIRA.
    
    Design Principles:
    - Zero cloud APIs (100% local, offline, deterministic).
    - Sub-millisecond execution for recognized application operational commands.
    - Explicit guard against false positives: questions and conversational queries
      (e.g., 'What is...', 'Explain...', 'Tell me about...') cleanly fall through to Llama 3.2.
    - Intent detection is separate from authorization.
    """

    def __init__(self, action_threshold: float = 0.85):
        self.action_threshold = action_threshold

        # Compile regex patterns for deterministic action matching
        self._init_patterns()

    def _init_patterns(self):
        """Compile regex patterns for high-speed deterministic intent matching."""
        prefix = r"(?:(?:could|can|would)\s+you\s+(?:please\s+)?)?(?:please\s+)?"
        suffix = r"(?:\s+for\s+me|\s+please)?$"

        # 1. OPEN_FIR (e.g., "Open FIR 212", "Show FIR 212", "Could you open FIR 212 for me?")
        self.pat_open_fir = re.compile(
            rf"^{prefix}(?:open|view|show|display|go\s+to|navigate\s+to)\s+(?:the\s+)?(?:fir|case)(?:\s+(?:number|no|#))?\s*([a-zA-Z0-9-]+){suffix}",
            re.IGNORECASE,
        )
        self.pat_direct_fir = re.compile(
            r"^(?:fir|case)(?:\s+(?:number|no|#))?\s*([a-zA-Z0-9-]+)$",
            re.IGNORECASE,
        )

        # 2. OPEN_EVIDENCE_VAULT (e.g., "Open Evidence Vault", "Open the evidence vault", "Show evidence vault")
        self.pat_evidence_vault = re.compile(
            rf"^{prefix}(?:open|view|show|display|go\s+to|navigate\s+to)\s+(?:the\s+)?(?:evidence\s+vault|evidence|vault){suffix}",
            re.IGNORECASE,
        )

        # 3. OPEN_NETWORK_OPS (e.g., "Show network operations", "Open network explorer", "Open network ops")
        self.pat_network_ops = re.compile(
            rf"^{prefix}(?:open|view|show|display|go\s+to|navigate\s+to)\s+(?:the\s+)?(?:network\s+operations|network\s+explorer|network\s+ops|crime\s+network|suspect\s+network|network){suffix}",
            re.IGNORECASE,
        )

        # 4. SHOW_HOTSPOTS (e.g., "Show hotspots", "Show crime hotspots", "View hotspots")
        self.pat_hotspots = re.compile(
            rf"^{prefix}(?:open|view|show|display|go\s+to)\s+(?:the\s+)?(?:crime\s+hotspots|hotspots|district\s+hotspots|analytics\s+hotspots){suffix}",
            re.IGNORECASE,
        )

        # 5. REGISTER_FIR (e.g., "Register FIR", "Register new FIR", "File an FIR", "Lodge FIR")
        self.pat_register_fir = re.compile(
            rf"^{prefix}(?:register|file|lodge|create)\s+(?:a\s+|an\s+)?(?:new\s+)?fir{suffix}",
            re.IGNORECASE,
        )

        # 6. REQUEST_ACCESS (e.g., "Request access", "Request dossier access", "Submit access request")
        self.pat_request_access = re.compile(
            rf"^{prefix}(?:request|submit|petition)\s+(?:for\s+)?(?:dossier\s+)?access(?:\s+request)?{suffix}",
            re.IGNORECASE,
        )

        # 7. OPEN_KNOWLEDGE_GRAPH (e.g., "Open knowledge graph", "Show knowledge graph", "Open graph for FIR 212")
        self.pat_knowledge_graph = re.compile(
            rf"^{prefix}(?:open|view|show|display)\s+(?:the\s+)?(?:knowledge\s+graph|investigation\s+graph|crime\s+graph|relationships\s+graph)(?:\s+(?:for|of)\s+(?:fir|case)?\s*([a-zA-Z0-9-]+))?{suffix}",
            re.IGNORECASE,
        )

        # Conversational Question / Explanatory Guards
        # Any query starting with these is strictly conversational and must fall through to LLM
        self.pat_conversational_guard = re.compile(
            r"^(?:what\s+is|what\s+are|what\s+does|what\s+was|why\s+is|why\s+are|why\s+did|why\s+do|"
            r"tell\s+me\s+about|explain|give\s+me\s+a\s+summary|summarize|describe|who\s+is|who\s+are|"
            r"how\s+does|how\s+do|how\s+is|can\s+you\s+tell\s+me\s+about|could\s+you\s+tell\s+me\s+about|"
            r"meaning\s+of|definition\s+of)\b",
            re.IGNORECASE,
        )

    @staticmethod
    def normalize(text: str) -> str:
        """Normalize raw query text for matching."""
        if not text:
            return ""
        # Strip punctuation from edges, normalize multiple spaces, lowercase
        cleaned = text.strip()
        cleaned = re.sub(r"^[,\.\?!;:]+|[,\.\?!;:]+$", "", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned)
        return cleaned.strip()

    def route(self, query: str) -> IntentResult:
        """
        Route an incoming user transcript to either a deterministic ACTION or LLM conversation.
        
        Args:
            query: Raw user transcript from STT or text prompt.
            
        Returns:
            IntentResult with mode ('ACTION' or 'LLM'), intent name, confidence, and extracted parameters.
        """
        t0 = time.perf_counter()
        normalized = self.normalize(query)
        lower_norm = normalized.lower()

        # ---------------------------------------------------------------------
        # 1. Conversational Guard: Check for explanatory / question patterns
        # ---------------------------------------------------------------------
        # If the query asks "What is...", "Why is...", "Tell me about...", "Explain..."
        # it is definitively conversational and should not trigger action routing.
        if self.pat_conversational_guard.search(lower_norm):
            t1 = time.perf_counter()
            return IntentResult(
                mode="LLM",
                intent="CONVERSATIONAL",
                confidence=0.0,
                parameters={},
                raw_query=query,
                normalized_query=normalized,
                latency_ms=round((t1 - t0) * 1000.0, 3),
            )

        # ---------------------------------------------------------------------
        # 2. Deterministic Action Matching
        # ---------------------------------------------------------------------

        # A. OPEN_FIR
        m_fir = self.pat_open_fir.match(lower_norm) or self.pat_direct_fir.match(lower_norm)
        if m_fir:
            fir_num = m_fir.group(1).upper()
            t1 = time.perf_counter()
            conf = 0.98 if not lower_norm.startswith(("could", "can", "would")) else 0.94
            if conf >= self.action_threshold:
                return IntentResult(
                    mode="ACTION",
                    intent="OPEN_FIR",
                    confidence=conf,
                    parameters={"fir_number": fir_num},
                    raw_query=query,
                    normalized_query=normalized,
                    latency_ms=round((t1 - t0) * 1000.0, 3),
                )

        # B. OPEN_KNOWLEDGE_GRAPH
        m_kg = self.pat_knowledge_graph.match(lower_norm)
        if m_kg:
            fir_num = m_kg.group(1).upper() if m_kg.group(1) else None
            params = {"fir_number": fir_num} if fir_num else {}
            t1 = time.perf_counter()
            if 0.98 >= self.action_threshold:
                return IntentResult(
                    mode="ACTION",
                    intent="OPEN_KNOWLEDGE_GRAPH",
                    confidence=0.98,
                    parameters=params,
                    raw_query=query,
                    normalized_query=normalized,
                    latency_ms=round((t1 - t0) * 1000.0, 3),
                )

        # C. OPEN_EVIDENCE_VAULT
        if self.pat_evidence_vault.match(lower_norm):
            t1 = time.perf_counter()
            if 0.98 >= self.action_threshold:
                return IntentResult(
                    mode="ACTION",
                    intent="OPEN_EVIDENCE_VAULT",
                    confidence=0.98,
                    parameters={},
                    raw_query=query,
                    normalized_query=normalized,
                    latency_ms=round((t1 - t0) * 1000.0, 3),
                )

        # D. OPEN_NETWORK_OPS
        if self.pat_network_ops.match(lower_norm):
            t1 = time.perf_counter()
            if 0.98 >= self.action_threshold:
                return IntentResult(
                    mode="ACTION",
                    intent="OPEN_NETWORK_OPS",
                    confidence=0.98,
                    parameters={},
                    raw_query=query,
                    normalized_query=normalized,
                    latency_ms=round((t1 - t0) * 1000.0, 3),
                )

        # E. SHOW_HOTSPOTS
        if self.pat_hotspots.match(lower_norm):
            t1 = time.perf_counter()
            if 0.98 >= self.action_threshold:
                return IntentResult(
                    mode="ACTION",
                    intent="SHOW_HOTSPOTS",
                    confidence=0.98,
                    parameters={},
                    raw_query=query,
                    normalized_query=normalized,
                    latency_ms=round((t1 - t0) * 1000.0, 3),
                )

        # F. REGISTER_FIR
        if self.pat_register_fir.match(lower_norm):
            t1 = time.perf_counter()
            if 0.98 >= self.action_threshold:
                return IntentResult(
                    mode="ACTION",
                    intent="REGISTER_FIR",
                    confidence=0.98,
                    parameters={},
                    raw_query=query,
                    normalized_query=normalized,
                    latency_ms=round((t1 - t0) * 1000.0, 3),
                )

        # G. REQUEST_ACCESS
        if self.pat_request_access.match(lower_norm):
            t1 = time.perf_counter()
            if 0.98 >= self.action_threshold:
                return IntentResult(
                    mode="ACTION",
                    intent="REQUEST_ACCESS",
                    confidence=0.98,
                    parameters={},
                    raw_query=query,
                    normalized_query=normalized,
                    latency_ms=round((t1 - t0) * 1000.0, 3),
                )

        # ---------------------------------------------------------------------
        # 3. Conversational Fallback
        # ---------------------------------------------------------------------
        t1 = time.perf_counter()
        return IntentResult(
            mode="LLM",
            intent="CONVERSATIONAL",
            confidence=0.0,
            parameters={},
            raw_query=query,
            normalized_query=normalized,
            latency_ms=round((t1 - t0) * 1000.0, 3),
        )
