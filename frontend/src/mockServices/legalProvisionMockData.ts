/**
 * CrimeLens — Odisha Police Intelligence Network
 * Mock BNS Legal Provision Dataset
 *
 * DEMONSTRATION DATA ONLY.
 * These are AI-assisted demonstration summaries for the SIH V2 prototype.
 * They do NOT constitute official statutory text or authoritative legal reference.
 * All legal determinations require authorized officer/legal review.
 */

export type RelevanceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ProvisionTier = 'PRIMARY' | 'RELATED' | 'SUPPORTING';

export interface LegalProvision {
  section: string;         // e.g. "BNS §305"
  sectionNumber: string;   // e.g. "305"
  title: string;
  category: string;
  shortDescription: string;
  provisionSummary: string;
  relevance: number;       // 0–100
  relevanceLevel: RelevanceLevel;
  tier: ProvisionTier;
  keyElements: string[];
  punishmentSummary: string;
  bnssClassification: string; // e.g. "Cognizable, Non-bailable"
  caseReason: string;
  supportingEvidence: string[];
  source: string;
  sourceType: 'LEGAL_REFERENCE';
  aiConfidence: number;    // 0.0–1.0
}

// ─── Core Provision Library ──────────────────────────────────────────────────

export const BNS_PROVISIONS: Record<string, LegalProvision> = {
  'BNS §303': {
    section: 'BNS §303',
    sectionNumber: '303',
    title: 'Theft',
    category: 'Property Offence',
    shortDescription: 'Dishonest taking of movable property from a person without consent.',
    provisionSummary:
      'Whoever, intending to take dishonestly any movable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft. [Demonstration summary — not verbatim statutory text]',
    relevance: 94,
    relevanceLevel: 'HIGH',
    tier: 'PRIMARY',
    keyElements: [
      'Movable property involved',
      'Taken without consent of owner',
      'Dishonest intention established',
      'Property moved from possession',
    ],
    punishmentSummary: 'Imprisonment up to 3 years, or Fine, or both. Aggravated forms carry higher penalties.',
    bnssClassification: 'Cognizable, Bailable (basic form)',
    caseReason:
      'The case narrative describes goods being taken from the premises without the owner\'s consent, which is consistent with the essential elements of theft under BNS §303.',
    supportingEvidence: [
      'Stolen goods inventory documented',
      'Owner testimony confirms lack of consent',
      'Entry/exit recorded on CCTV',
    ],
    source: 'Bharatiya Nyaya Sanhita, 2023',
    sourceType: 'LEGAL_REFERENCE',
    aiConfidence: 0.94,
  },

  'BNS §305': {
    section: 'BNS §305',
    sectionNumber: '305',
    title: 'Theft in dwelling house',
    category: 'Aggravated Property Offence',
    shortDescription: 'Theft committed in a dwelling house or vessel used as dwelling, or from a person in a vessel.',
    provisionSummary:
      'Whoever commits theft in any building, tent, or vessel used as a human dwelling, or in any building used for the custody of property, shall be liable to enhanced punishment. This aggravated form of theft recognizes the heightened violation of personal security. [Demonstration summary — not verbatim statutory text]',
    relevance: 94,
    relevanceLevel: 'HIGH',
    tier: 'PRIMARY',
    keyElements: [
      'Theft committed inside a dwelling or protected structure',
      'Building used for human habitation or property custody',
      'Higher culpability due to breach of domestic security',
      'Intent to steal established at time of entry',
    ],
    punishmentSummary: 'Rigorous imprisonment up to 7 years + Fine.',
    bnssClassification: 'Cognizable, Non-bailable',
    caseReason:
      'The FIR narrative indicates the offence was committed inside a commercial premise used for custody of property, satisfying the conditions for the aggravated provision under BNS §305.',
    supportingEvidence: [
      'Crime occurred inside a secured building',
      'Forced entry point identified',
      'Property removed from within the premises',
    ],
    source: 'Bharatiya Nyaya Sanhita, 2023',
    sourceType: 'LEGAL_REFERENCE',
    aiConfidence: 0.94,
  },

  'BNS §309': {
    section: 'BNS §309',
    sectionNumber: '309',
    title: 'Robbery',
    category: 'Violent Property Offence',
    shortDescription: 'Theft or extortion combined with voluntary use of force or threat of force.',
    provisionSummary:
      'In all robbery there is either theft or extortion. Theft is robbery if the offender voluntarily causes or attempts to cause death, hurt, or wrongful restraint to any person, or fear of instant hurt or death, in order to commit the theft. [Demonstration summary — not verbatim statutory text]',
    relevance: 91,
    relevanceLevel: 'HIGH',
    tier: 'PRIMARY',
    keyElements: [
      'Theft or extortion as base offence',
      'Voluntary force or threat of force applied',
      'Victim experienced imminent fear of hurt or death',
      'Force applied to execute or conceal theft',
    ],
    punishmentSummary: 'Rigorous imprisonment up to 10 years + Fine.',
    bnssClassification: 'Cognizable, Non-bailable',
    caseReason:
      'The case involves an armed confrontation during which property was forcibly removed, satisfying the dual element of theft plus voluntary force that constitutes robbery under BNS §309.',
    supportingEvidence: [
      'Complainant reported being threatened with weapon',
      'Physical confrontation documented by witnesses',
      'Robbery occurred in presence of complainant',
    ],
    source: 'Bharatiya Nyaya Sanhita, 2023',
    sourceType: 'LEGAL_REFERENCE',
    aiConfidence: 0.91,
  },

  'BNS §331': {
    section: 'BNS §331',
    sectionNumber: '331',
    title: 'House-breaking',
    category: 'Property Offence',
    shortDescription: 'Breaking into or breaking out of a building with intent to commit an offence.',
    provisionSummary:
      'A person is said to commit house-breaking if they effect entry into a house or building using any of the prescribed means — including breaking open any door, window, or passage — with the intent to commit any offence therein. [Demonstration summary — not verbatim statutory text]',
    relevance: 88,
    relevanceLevel: 'HIGH',
    tier: 'RELATED',
    keyElements: [
      'Unlawful forced entry into a building',
      'Entry through a door, window, or wall break',
      'Criminal intent present at time of entry',
      'Building constitutes a protected structure',
    ],
    punishmentSummary: 'Imprisonment up to 2 years + Fine.',
    bnssClassification: 'Cognizable, Bailable',
    caseReason:
      'Evidence of a broken entry point (damaged shutter/door/window) at the crime scene is consistent with house-breaking under BNS §331.',
    supportingEvidence: [
      'Forced entry point found and documented',
      'Door/shutter damage photographed',
      'Entry distinct from lawful ingress',
    ],
    source: 'Bharatiya Nyaya Sanhita, 2023',
    sourceType: 'LEGAL_REFERENCE',
    aiConfidence: 0.88,
  },

  'BNS §324': {
    section: 'BNS §324',
    sectionNumber: '324',
    title: 'Criminal Trespass',
    category: 'Trespass Offence',
    shortDescription: 'Entry onto another\'s property with intent to commit an offence or intimidate.',
    provisionSummary:
      'Whoever enters into or upon property in possession of another with intent to commit an offence, or to intimidate, insult, or annoy any person in possession of such property, is said to commit criminal trespass. [Demonstration summary — not verbatim statutory text]',
    relevance: 75,
    relevanceLevel: 'MEDIUM',
    tier: 'RELATED',
    keyElements: [
      'Entry onto property in lawful possession of another',
      'Intent to commit offence or cause annoyance',
      'Trespass is unlawful and without authorization',
    ],
    punishmentSummary: 'Imprisonment up to 3 months, or Fine up to ₹2,500, or both.',
    bnssClassification: 'Cognizable, Bailable',
    caseReason:
      'The suspects entered the premises unlawfully without owner\'s permission, satisfying the trespass element that typically accompanies the primary burglary/theft offence.',
    supportingEvidence: [
      'No authorization for entry granted by owner',
      'Entry occurred outside business hours',
      'Premises access restricted',
    ],
    source: 'Bharatiya Nyaya Sanhita, 2023',
    sourceType: 'LEGAL_REFERENCE',
    aiConfidence: 0.75,
  },

  'BNS §3(5)': {
    section: 'BNS §3(5)',
    sectionNumber: '3(5)',
    title: 'Common Intention',
    category: 'Constructive Liability',
    shortDescription: 'Joint criminal liability for acts done in furtherance of common intention by multiple persons.',
    provisionSummary:
      'When a criminal act is done by several persons in furtherance of the common intention of all, each of such persons is liable for that act in the same manner as if it were done by him alone. This doctrine holds all co-conspirators equally culpable. [Demonstration summary — not verbatim statutory text]',
    relevance: 72,
    relevanceLevel: 'MEDIUM',
    tier: 'SUPPORTING',
    keyElements: [
      'Multiple persons involved in the criminal act',
      'Common intention shared before or during offence',
      'Each person liable as if acting alone',
      'Applicable where individual roles vary',
    ],
    punishmentSummary: 'Same punishment as the principal offender. Applied in conjunction with the primary section.',
    bnssClassification: 'Applied alongside primary cognizable offence',
    caseReason:
      'Multiple suspects were seen acting in coordination during the offence, suggesting shared common intention that makes each party equally liable.',
    supportingEvidence: [
      'Multiple suspects identified from CCTV',
      'Coordinated roles observed (lookout + executor)',
      'Common getaway vehicle used',
    ],
    source: 'Bharatiya Nyaya Sanhita, 2023',
    sourceType: 'LEGAL_REFERENCE',
    aiConfidence: 0.72,
  },

  'BNS §304': {
    section: 'BNS §304',
    sectionNumber: '304',
    title: 'Snatching',
    category: 'Property Offence',
    shortDescription: 'Sudden grabbing or forcibly taking property from a person, distinct from robbery.',
    provisionSummary:
      'Snatching involves the sudden taking of property by force or show of force from another person, without the sustained application of force that characterizes robbery. The distinction carries a distinct non-bailable procedural framework. [Demonstration summary — not verbatim statutory text]',
    relevance: 82,
    relevanceLevel: 'HIGH',
    tier: 'PRIMARY',
    keyElements: [
      'Property grabbed suddenly from person',
      'Victim present at time of taking',
      'Force used momentarily, not sustained',
      'Distinct from robbery in force application',
    ],
    punishmentSummary: 'Imprisonment up to 3 years + Fine.',
    bnssClassification: 'Cognizable, Non-bailable',
    caseReason:
      'The reported incident involves property being suddenly grabbed from the complainant by suspects on a moving vehicle, consistent with snatching under BNS §304.',
    supportingEvidence: [
      'Complainant describes sudden grab',
      'Suspects on two-wheelers',
      'Gold chain taken from person',
    ],
    source: 'Bharatiya Nyaya Sanhita, 2023',
    sourceType: 'LEGAL_REFERENCE',
    aiConfidence: 0.82,
  },

  'BNS §316': {
    section: 'BNS §316',
    sectionNumber: '316',
    title: 'Criminal Breach of Trust',
    category: 'Financial Offence',
    shortDescription: 'Dishonest misappropriation of property entrusted to someone in a position of trust.',
    provisionSummary:
      'Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts to their own use that property, or dishonestly uses or disposes of that property, commits criminal breach of trust. [Demonstration summary — not verbatim statutory text]',
    relevance: 78,
    relevanceLevel: 'MEDIUM',
    tier: 'RELATED',
    keyElements: [
      'Property entrusted to accused',
      'Dishonest misappropriation or conversion',
      'Breach of legal duty of care',
      'Position of trust or special relationship',
    ],
    punishmentSummary: 'Imprisonment up to 3 years, or Fine, or both.',
    bnssClassification: 'Cognizable, Bailable',
    caseReason:
      'The accused had lawful custody of the property before the alleged misappropriation, creating the trust relationship required under BNS §316.',
    supportingEvidence: [
      'Documented entrustment agreement',
      'Discrepancy in accounts identified',
      'No authorization for disposal found',
    ],
    source: 'Bharatiya Nyaya Sanhita, 2023',
    sourceType: 'LEGAL_REFERENCE',
    aiConfidence: 0.78,
  },
};

// ─── Case-Specific Provision Sets ─────────────────────────────────────────────

/** Provision set for the hero burglary case (OD-BBSR-2026-0001) */
export const HERO_CASE_PROVISIONS: LegalProvision[] = [
  { ...BNS_PROVISIONS['BNS §305'], tier: 'PRIMARY', relevance: 94 },
  { ...BNS_PROVISIONS['BNS §331'], tier: 'RELATED', relevance: 88 },
  { ...BNS_PROVISIONS['BNS §324'], tier: 'RELATED', relevance: 75 },
  { ...BNS_PROVISIONS['BNS §3(5)'], tier: 'SUPPORTING', relevance: 72 },
];

/** Provision set for robbery/heist cases */
export const ROBBERY_CASE_PROVISIONS: LegalProvision[] = [
  { ...BNS_PROVISIONS['BNS §309'], tier: 'PRIMARY', relevance: 91 },
  { ...BNS_PROVISIONS['BNS §305'], tier: 'RELATED', relevance: 84 },
  { ...BNS_PROVISIONS['BNS §3(5)'], tier: 'SUPPORTING', relevance: 72 },
];

/** FIR analysis default provisions */
export const FIR_ANALYSIS_PROVISIONS: LegalProvision[] = [
  { ...BNS_PROVISIONS['BNS §305'], tier: 'PRIMARY', relevance: 94 },
  { ...BNS_PROVISIONS['BNS §331'], tier: 'RELATED', relevance: 86 },
  { ...BNS_PROVISIONS['BNS §3(5)'], tier: 'SUPPORTING', relevance: 72 },
];

/** Helper: look up a provision by section string */
export function getProvision(section: string): LegalProvision | undefined {
  return BNS_PROVISIONS[section];
}

/** Helper: get tier badge label */
export function getTierLabel(tier: ProvisionTier): string {
  return { PRIMARY: 'Primary', RELATED: 'Related', SUPPORTING: 'Supporting' }[tier];
}

/** Helper: get relevance colour class */
export function getRelevanceColor(level: RelevanceLevel): string {
  return {
    HIGH: 'text-success',
    MEDIUM: 'text-warning',
    LOW: 'text-text-dim',
  }[level];
}
