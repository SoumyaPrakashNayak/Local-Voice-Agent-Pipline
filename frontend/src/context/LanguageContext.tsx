import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 'en' | 'hi' | 'or' | 'bn' | 'te' | 'ta' | 'mr';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Brand & Header
    'brand.name': 'CRIMELENS',
    'brand.tagline': 'Odisha Police Intelligence',
    'header.station': 'STATION',
    'header.stateCommand': 'ODISHA POLICE · STATE COMMAND',
    'header.engineRunning': 'Intelligence Engine Running...',
    'header.newIntel': 'NEW INTELLIGENCE DISCOVERED:',
    'header.viewDetails': 'VIEW DETAILS',
    'header.language': 'Language',

    // Sidebar Section Headers
    'nav.section.myDesk': 'MY DESK',
    'nav.section.investigate': 'INVESTIGATE',
    'nav.section.intelligence': 'INTELLIGENCE',
    'nav.section.assistance': 'ASSISTANCE',
    'nav.section.reports': 'REPORTS',
    'nav.section.stateCommand': 'STATE COMMAND',
    'nav.section.policeAdmin': 'POLICE ADMINISTRATION',
    'nav.section.caseIntel': 'CASE INTELLIGENCE',
    'nav.section.networkIntel': 'NETWORK INTELLIGENCE',
    'nav.section.operations': 'OPERATIONS',
    'nav.section.system': 'SYSTEM',

    // Nav Items
    'nav.dashboard': 'Dashboard',
    'nav.commandCenter': 'Command Center',
    'nav.myInvestigations': 'My Investigations',
    'nav.accessRequests': 'Access Requests',
    'nav.registerFir': 'Register FIR',
    'nav.evidenceVault': 'Evidence Vault',
    'nav.caseSearch': 'Case Search',
    'nav.allCases': 'All Cases',
    'nav.networkExplorer': 'Network Explorer',
    'nav.crimeIntelligence': 'Crime Intelligence',
    'nav.legalIntelligence': 'Legal Intelligence',
    'nav.aiAssistant': 'AI Assistant',
    'nav.caseReports': 'Case Reports',
    'nav.policeStations': 'Police Stations',
    'nav.officers': 'Officers',
    'nav.monthlyReports': 'Monthly Crime Reports',
    'nav.notifications': 'Notifications',
    'nav.profile': 'Profile',

    // Common UI & Buttons
    'btn.runAiAnalysis': 'Run AI Analysis',
    'btn.confirmCreateCase': 'Confirm & Create Case Workspace',
    'btn.processEvidence': 'Process Evidence',
    'btn.requestAccess': 'Request Access',
    'btn.compareCase': 'Compare Case',
    'btn.viewGraph': 'View Graph',
    'btn.viewDetails': 'View Details',
    'btn.share': 'Share',
    'btn.markCritical': 'Mark Critical',
    'btn.search': 'Search',
    'btn.reset': 'Reset',
    'btn.generateDraft': 'Generate Draft',
    'btn.downloadPdf': 'Download PDF',
    'btn.done': 'Done',
    'btn.cancel': 'Cancel',
    'btn.close': 'Close',

    // Karen & AI
    'karen.greeting': 'Good day, Inspector. I am KAREN, your voice intelligence companion.',
    'karen.listening': 'LISTENING ACTIVE',
    'karen.analyzing': 'KAREN ANALYZING',
    'karen.tapToSpeak': 'Tap to Speak Command',
    'karen.audioPlaying': 'Speaking Response...',
    'karen.playAudio': 'Play Voice',
    'karen.replayAudio': 'Replay Voice',
    'karen.pauseAudio': 'Pause Voice',
    'karen.stopAudio': 'Stop Voice',

    // Legal Intelligence
    'legal.title': 'Legal Intelligence',
    'legal.applicableProvisions': 'Applicable Provisions',
    'legal.bnsLibrary': 'BNS Provisions Library',
    'legal.disclaimerTitle': 'AI-Assisted Legal Intelligence',
    'legal.disclaimerText': 'Requires authorized officer review. Does not constitute final legal determination.',
    'legal.clickToView': 'Click to view full provision',
    'legal.relevance': 'Relevance',
    'legal.keyElements': 'Key Elements',
  },
  hi: {
    // Brand & Header
    'brand.name': 'क्राइमलेंस',
    'brand.tagline': 'ओडिशा पुलिस इंटेलिजेंस',
    'header.station': 'थाना',
    'header.stateCommand': 'ओडिशा पुलिस · राज्य कमान',
    'header.engineRunning': 'इंटेलिजेंस इंजन सक्रिय...',
    'header.newIntel': 'नई खुफिया जानकारी खोजी गई:',
    'header.viewDetails': 'विवरण देखें',
    'header.language': 'भाषा',

    // Sidebar Section Headers
    'nav.section.myDesk': 'मेरा डेस्क',
    'nav.section.investigate': 'जांच',
    'nav.section.intelligence': 'इंटेलिजेंस',
    'nav.section.assistance': 'सहायता',
    'nav.section.reports': 'रिपोर्ट',
    'nav.section.stateCommand': 'राज्य कमान',
    'nav.section.policeAdmin': 'पुलिस प्रशासन',
    'nav.section.caseIntel': 'केस इंटेलिजेंस',
    'nav.section.networkIntel': 'नेटवर्क इंटेलिजेंस',
    'nav.section.operations': 'संचालन',
    'nav.section.system': 'सिस्टम',

    // Nav Items
    'nav.dashboard': 'डैशबोर्ड',
    'nav.commandCenter': 'कमांड सेंटर',
    'nav.myInvestigations': 'मेरी जांचें',
    'nav.accessRequests': 'एक्सेस अनुरोध',
    'nav.registerFir': 'एफआईआर दर्ज करें',
    'nav.evidenceVault': 'साक्ष्य वॉल्ट',
    'nav.caseSearch': 'केस खोज',
    'nav.allCases': 'सभी मामले',
    'nav.networkExplorer': 'नेटवर्क एक्सप्लोरर',
    'nav.crimeIntelligence': 'अपराध इंटेलिजेंस',
    'nav.legalIntelligence': 'कानूनी इंटेलिजेंस',
    'nav.aiAssistant': 'एआई सहायक',
    'nav.caseReports': 'केस रिपोर्ट',
    'nav.policeStations': 'पुलिस स्टेशन',
    'nav.officers': 'अधिकारी',
    'nav.monthlyReports': 'मासिक अपराध रिपोर्ट',
    'nav.notifications': 'सूचनाएं',
    'nav.profile': 'प्रोफ़ाइल',

    // Common UI & Buttons
    'btn.runAiAnalysis': 'एआई विश्लेषण चलाएं',
    'btn.confirmCreateCase': 'पुष्टि करें और केस बनाएं',
    'btn.processEvidence': 'साक्ष्य संसाधित करें',
    'btn.requestAccess': 'एक्सेस का अनुरोध करें',
    'btn.compareCase': 'केस की तुलना करें',
    'btn.viewGraph': 'ग्राफ देखें',
    'btn.viewDetails': 'विवरण देखें',
    'btn.share': 'साझा करें',
    'btn.markCritical': 'क्रिटिकल चिह्नित करें',
    'btn.search': 'खोजें',
    'btn.reset': 'रीसेट',
    'btn.generateDraft': 'ड्राफ्ट तैयार करें',
    'btn.downloadPdf': 'पीडीएफ डाउनलोड करें',
    'btn.done': 'संपन्न',
    'btn.cancel': 'रद्द करें',
    'btn.close': 'बंद करें',

    // Karen & AI
    'karen.greeting': 'नमस्ते इंस्पेक्टर। मैं करेन (KAREN) हूँ, आपकी वॉयस इंटेलिजेंस साथी।',
    'karen.listening': 'सुनना सक्रिय है',
    'karen.analyzing': 'करेन विश्लेषण कर रही है',
    'karen.tapToSpeak': 'बोलने के लिए टैप करें',
    'karen.audioPlaying': 'प्रतिक्रिया बोल रही है...',
    'karen.playAudio': 'आवाज चलाएं',
    'karen.replayAudio': 'पुनः सुनें',
    'karen.pauseAudio': 'रोकें',
    'karen.stopAudio': 'बंद करें',

    // Legal Intelligence
    'legal.title': 'कानूनी इंटेलिजेंस (BNS)',
    'legal.applicableProvisions': 'लागू प्रावधान',
    'legal.bnsLibrary': 'बीएनएस प्रावधान लाइब्रेरी',
    'legal.disclaimerTitle': 'एआई-सहायक कानूनी विश्लेषण',
    'legal.disclaimerText': 'अधिकृत अधिकारी समीक्षा आवश्यक है। अंतिम कानूनी निर्णय नहीं है।',
    'legal.clickToView': 'पूर्ण प्रावधान देखने के लिए क्लिक करें',
    'legal.relevance': 'प्रासंगिकता',
    'legal.keyElements': 'मुख्य तत्व',
  },
  or: {
    // Brand & Header
    'brand.name': 'କ୍ରାଇମଲେନ୍ସ',
    'brand.tagline': 'ଓଡ଼ିଶା ପୋଲିସ ଗୁପ୍ତଚର ବିଭାଗ',
    'header.station': 'ଥାନା',
    'header.stateCommand': 'ଓଡ଼ିଶା ପୋଲିସ · ରାଜ୍ୟ କମାଣ୍ଡ',
    'header.engineRunning': 'ଇଣ୍ଟେଲିଜେନ୍ସ ଇଞ୍ଜିନ ଚାଲୁଅଛି...',
    'header.newIntel': 'ନୂତନ ଗୁପ୍ତଚର ସୂଚନା ମିଳିଛି:',
    'header.viewDetails': 'ବିବରଣୀ ଦେଖନ୍ତୁ',
    'header.language': 'ଭାଷା',

    // Sidebar Section Headers
    'nav.section.myDesk': 'ମୋର ଡେସ୍କ',
    'nav.section.investigate': 'ତଦନ୍ତ କରନ୍ତୁ',
    'nav.section.intelligence': 'ଇଣ୍ଟେଲିଜେନ୍ସ',
    'nav.section.assistance': 'ସହାୟତା',
    'nav.section.reports': 'ରିପୋର୍ଟ',
    'nav.section.stateCommand': 'ରାଜ୍ୟ କମାଣ୍ଡ',
    'nav.section.policeAdmin': 'ପୋଲିସ ପ୍ରଶାସନ',
    'nav.section.caseIntel': 'ମାମଲା ଇଣ୍ଟେଲିଜେନ୍ସ',
    'nav.section.networkIntel': 'ନେଟୱାର୍କ ଇଣ୍ଟେଲିଜେନ୍ସ',
    'nav.section.operations': 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ',
    'nav.section.system': 'ସିଷ୍ଟମ',

    // Nav Items
    'nav.dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'nav.commandCenter': 'କମାଣ୍ଡ ସେଣ୍ଟର',
    'nav.myInvestigations': 'ମୋର ତଦନ୍ତ ସମୂହ',
    'nav.accessRequests': 'ଅନୁମତି ଅନୁରୋଧ',
    'nav.registerFir': 'ଏତଲା (FIR) ପଞ୍ଜୀକରଣ',
    'nav.evidenceVault': 'ପ୍ରମାଣ ଭଣ୍ଡାର',
    'nav.caseSearch': 'ମାମଲା ଖୋଜନ୍ତୁ',
    'nav.allCases': 'ସମସ୍ତ ମାମଲା',
    'nav.networkExplorer': 'ନେଟୱାର୍କ ଏକ୍ସପ୍ଲୋରର',
    'nav.crimeIntelligence': 'ଅପରାଧ ଇଣ୍ଟେଲିଜେନ୍ସ',
    'nav.legalIntelligence': 'ଆଇନଗତ ଇଣ୍ଟେଲିଜେନ୍ସ',
    'nav.aiAssistant': 'AI ସହାୟକ',
    'nav.caseReports': 'ମାମଲା ରିପୋର୍ଟ',
    'nav.policeStations': 'ପୋଲିସ ଥାନା',
    'nav.officers': 'ଅଧିକାରୀଗଣ',
    'nav.monthlyReports': 'ମାସିକ ଅପରାଧ ରିପୋର୍ଟ',
    'nav.notifications': 'ବିଜ୍ଞପ୍ତି',
    'nav.profile': 'ପ୍ରୋଫାଇଲ',

    // Common UI & Buttons
    'btn.runAiAnalysis': 'AI ବିଶ୍ଳେଷଣ ଚଲାନ୍ତୁ',
    'btn.confirmCreateCase': 'ମାମଲା ସୃଷ୍ଟି କରନ୍ତୁ',
    'btn.processEvidence': 'ପ୍ରମାଣ ବିଶ୍ଳେଷଣ କରନ୍ତୁ',
    'btn.requestAccess': 'ଅନୁମତି ଅନୁରୋଧ କରନ୍ତୁ',
    'btn.compareCase': 'ମାମଲା ତୁଳନା କରନ୍ତୁ',
    'btn.viewGraph': 'ଗ୍ରାଫ ଦେଖନ୍ତୁ',
    'btn.viewDetails': 'ବିବରଣୀ ଦେଖନ୍ତୁ',
    'btn.share': 'ସେୟାର କରନ୍ତୁ',
    'btn.markCritical': 'ଜରୁରୀ ଚିହ୍ନଟ କରନ୍ତୁ',
    'btn.search': 'ସନ୍ଧାନ',
    'btn.reset': 'ରିସେଟ',
    'btn.generateDraft': 'ଡ୍ରାଫ୍ଟ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
    'btn.downloadPdf': 'PDF ଡାଉନଲୋଡ କରନ୍ତୁ',
    'btn.done': 'ସମ୍ପନ୍ନ',
    'btn.cancel': 'ବାତିଲ',
    'btn.close': 'ବନ୍ଦ କରନ୍ତୁ',

    // Karen & AI
    'karen.greeting': 'ନମସ୍କାର ଇନ୍ସପେକ୍ଟର। ମୁଁ KAREN, ଆପଣଙ୍କ ଭଏସ୍ ଇଣ୍ଟେଲିଜେନ୍ସ ସାଥୀ।',
    'karen.listening': 'ଶୁଣିବା ସକ୍ରିୟ ଅଛି',
    'karen.analyzing': 'KAREN ବିଶ୍ଳେଷଣ କରୁଛି',
    'karen.tapToSpeak': 'କହିବା ପାଇଁ ଟ୍ୟାପ୍ କରନ୍ତୁ',
    'karen.audioPlaying': 'ଉତ୍ତର କହୁଛି...',
    'karen.playAudio': 'ସ୍ୱର ଶୁଣନ୍ତୁ',
    'karen.replayAudio': 'ପୁଣି ଶୁଣନ୍ତୁ',
    'karen.pauseAudio': 'ବିରାମ',
    'karen.stopAudio': 'ବନ୍ଦ କରନ୍ତୁ',

    // Legal Intelligence
    'legal.title': 'ଆଇନଗତ ଇଣ୍ଟେଲିଜେନ୍ସ (BNS)',
    'legal.applicableProvisions': 'ପ୍ରଯୁଜ୍ୟ ଧାରା ସମୂହ',
    'legal.bnsLibrary': 'BNS ଧାରା ତାଲିକା',
    'legal.disclaimerTitle': 'AI ଆଇନଗତ ସହାୟତା',
    'legal.disclaimerText': 'ଅଧିକାରୀଙ୍କ ଦ୍ୱାରା ଯାଞ୍ଚ ଆବଶ୍ୟକ। ଏହା ଚୂଡ଼ାନ୍ତ ଆଇନ ନିର୍ଦ୍ଧାରଣ ନୁହେଁ।',
    'legal.clickToView': 'ପୂର୍ଣ୍ଣ ବିବରଣୀ ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ',
    'legal.relevance': 'ପ୍ରାସଙ୍ଗିକତା',
    'legal.keyElements': 'ମୁଖ୍ୟ ଉପାଦାନ',
  },
  bn: {
    // Brand & Header
    'brand.name': 'ক্রাইমলেন্স',
    'brand.tagline': 'ওড়িশা পুলিশ ইন্টেলিজেন্স',
    'header.station': 'থানা',
    'header.stateCommand': 'ওড়িশা পুলিশ · রাজ্য কমান্ড',
    'header.engineRunning': 'ইন্টেলিজেন্স ইঞ্জিন সক্রিয়...',
    'header.newIntel': 'নতুন গোয়েন্দা তথ্য পাওয়া গেছে:',
    'header.viewDetails': 'বিবরণ দেখুন',
    'header.language': 'ভাষা',

    // Sidebar Section Headers
    'nav.section.myDesk': 'আমার ডেস্ক',
    'nav.section.investigate': 'তদন্ত',
    'nav.section.intelligence': 'ইন্টেলিজেন্স',
    'nav.section.assistance': 'সহায়তা',
    'nav.section.reports': 'রিপোর্ট',
    'nav.section.stateCommand': 'রাজ্য কমান্ড',
    'nav.section.policeAdmin': 'পুলিশ প্রশাসন',
    'nav.section.caseIntel': 'মামলা গোয়েন্দা তথ্য',
    'nav.section.networkIntel': 'নেটওয়ার্ক ইন্টেলিজেন্স',
    'nav.section.operations': 'অপারেশনস',
    'nav.section.system': 'সিস্টেম',

    // Nav Items
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.commandCenter': 'কমান্ড সেন্টার',
    'nav.myInvestigations': 'আমার তদন্তসমূহ',
    'nav.accessRequests': 'অ্যাক্সেস অনুরোধ',
    'nav.registerFir': 'এফআইআর নথিবদ্ধ করুন',
    'nav.evidenceVault': 'প্রমাণ ভল্ট',
    'nav.caseSearch': 'মামলা অনুসন্ধান',
    'nav.allCases': 'সকল মামলা',
    'nav.networkExplorer': 'নেটওয়ার্ক এক্সপ্লোরার',
    'nav.crimeIntelligence': 'ক্রাইম ইন্টেলিজেন্স',
    'nav.legalIntelligence': 'আইনি ইন্টেলিজেন্স',
    'nav.aiAssistant': 'এআই সহকারী',
    'nav.caseReports': 'মামলার রিপোর্ট',
    'nav.policeStations': 'পুলিশ স্টেশন',
    'nav.officers': 'কর্মকর্তাবৃন্দ',
    'nav.monthlyReports': 'মাসিক অপরাধ রিপোর্ট',
    'nav.notifications': 'বিজ্ঞপ্তি',
    'nav.profile': 'প্রোফাইল',

    // Common UI & Buttons
    'btn.runAiAnalysis': 'এআই বিশ্লেষণ চালান',
    'btn.confirmCreateCase': 'নিশ্চিত করুন এবং মামলা তৈরি করুন',
    'btn.processEvidence': 'প্রমাণ প্রক্রিয়া করুন',
    'btn.requestAccess': 'অ্যাক্সেসের আবেদন করুন',
    'btn.compareCase': 'মামলা তুলনা করুন',
    'btn.viewGraph': 'গ্রাফ দেখুন',
    'btn.viewDetails': 'বিবরণ দেখুন',
    'btn.share': 'শেয়ার করুন',
    'btn.markCritical': 'জরুরি চিহ্নিত করুন',
    'btn.search': 'অনুসন্ধান',
    'btn.reset': 'রিসেট',
    'btn.generateDraft': 'খসড়া তৈরি করুন',
    'btn.downloadPdf': 'পিডিএফ ডাউনলোড',
    'btn.done': 'সম্পন্ন',
    'btn.cancel': 'বাতিল',
    'btn.close': 'বন্ধ করুন',

    // Karen & AI
    'karen.greeting': 'নমস্কার পরিদর্শক। আমি কারেন (KAREN), আপনার ভয়েস ইন্টেলিজেন্স সহকারী।',
    'karen.listening': 'শ্রবণ সক্রিয় আছে',
    'karen.analyzing': 'কারেন বিশ্লেষণ করছে',
    'karen.tapToSpeak': 'বলতে ট্যাপ করুন',
    'karen.audioPlaying': 'উত্তর বলছে...',
    'karen.playAudio': 'কণ্ঠ শুনুন',
    'karen.replayAudio': 'আবার শুনুন',
    'karen.pauseAudio': 'বিরতি',
    'karen.stopAudio': 'বন্ধ করুন',

    // Legal Intelligence
    'legal.title': 'আইনি ইন্টেলিজেন্স (BNS)',
    'legal.applicableProvisions': 'প্রযোজ্য ধারা সমূহ',
    'legal.bnsLibrary': 'বিএনএস ধারা লাইব্রেরি',
    'legal.disclaimerTitle': 'এআই আইনি সহায়তা',
    'legal.disclaimerText': 'অনুমোদিত কর্মকর্তার পর্যালোচনা প্রয়োজন। এটি চূড়ান্ত আইনি সিদ্ধান্ত নয়।',
    'legal.clickToView': 'সম্পূর্ণ ধারা দেখতে ক্লিক করুন',
    'legal.relevance': 'প্রাসঙ্গিকতা',
    'legal.keyElements': 'মূল উপাদান',
  },
  te: {
    // Brand & Header
    'brand.name': 'క్రైమ్‌లెన్స్',
    'brand.tagline': 'ఒడిశా పోలీస్ ఇంటెలిజెన్స్',
    'header.station': 'స్టేషన్',
    'header.stateCommand': 'ఒడిశా పోలీస్ · రాష్ట్ర కమాండ్',
    'header.engineRunning': 'ఇంటెలిజెన్స్ ఇంజిన్ రన్ అవుతోంది...',
    'header.newIntel': 'కొత్త ఇంటెలిజెన్స్ కనుగొనబడింది:',
    'header.viewDetails': 'వివరాలు చూడండి',
    'header.language': 'భాష',

    // Sidebar Section Headers
    'nav.section.myDesk': 'నా డెస్క్',
    'nav.section.investigate': 'పరిశోధించండి',
    'nav.section.intelligence': 'ఇంటెలిజెన్స్',
    'nav.section.assistance': 'సహాయం',
    'nav.section.reports': 'నివేదికలు',
    'nav.section.stateCommand': 'రాష్ట్ర కమాండ్',
    'nav.section.policeAdmin': 'పోలీస్ పరిపాలన',
    'nav.section.caseIntel': 'కేస్ ఇంటెలిజెన్స్',
    'nav.section.networkIntel': 'నెట్‌వర్క్ ఇంటెలిజెన్స్',
    'nav.section.operations': 'కార్యకలాపాలు',
    'nav.section.system': 'సిస్టమ్',

    // Nav Items
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.commandCenter': 'కమాండ్ సెంటర్',
    'nav.myInvestigations': 'నా దర్యాప్తులు',
    'nav.accessRequests': 'యాక్సెస్ అభ్యర్థనలు',
    'nav.registerFir': 'ఎఫ్ఐఆర్ నమోదు',
    'nav.evidenceVault': 'సాక్ష్యాల వాల్ట్',
    'nav.caseSearch': 'కేస్ శోధన',
    'nav.allCases': 'అన్ని కేసులు',
    'nav.networkExplorer': 'నెట్‌వర్క్ ఎక్స్‌ప్లోరర్',
    'nav.crimeIntelligence': 'క్రైమ్ ఇంటెలిజెన్స్',
    'nav.legalIntelligence': 'లీగల్ ఇంటెలిజెన్స్',
    'nav.aiAssistant': 'AI అసిస్టెంట్',
    'nav.caseReports': 'కేస్ రిపోర్ట్‌లు',
    'nav.policeStations': 'పోలీస్ స్టేషన్లు',
    'nav.officers': 'అధికారులు',
    'nav.monthlyReports': 'నెలవారీ క్రైమ్ రిపోర్ట్‌లు',
    'nav.notifications': 'నోటిఫికేషన్‌లు',
    'nav.profile': 'ప్రొఫైల్',

    // Common UI & Buttons
    'btn.runAiAnalysis': 'AI విశ్లేషణను అమలు చేయండి',
    'btn.confirmCreateCase': 'నిర్ధారించి కేస్ సృష్టించండి',
    'btn.processEvidence': 'సాక్ష్యాన్ని ప్రాసెస్ చేయండి',
    'btn.requestAccess': 'యాక్సెస్ అభ్యర్థించండి',
    'btn.compareCase': 'కేసును పోల్చండి',
    'btn.viewGraph': 'గ్రాఫ్ చూడండి',
    'btn.viewDetails': 'వివరాలు చూడండి',
    'btn.share': 'భాగస్వామ్యం',
    'btn.markCritical': 'క్రిటికల్‌గా గుర్తించండి',
    'btn.search': 'శోధన',
    'btn.reset': 'రీసెట్',
    'btn.generateDraft': 'డ్రాఫ్ట్ రూపొందించండి',
    'btn.downloadPdf': 'PDF డౌన్‌లోడ్',
    'btn.done': 'పూర్తయింది',
    'btn.cancel': 'రద్దు చేయండి',
    'btn.close': 'మూసివేయి',

    // Karen & AI
    'karen.greeting': 'నమస్కారం ఇన్‌స్పెక్టర్. నేను కారెన్ (KAREN), మీ వాయిస్ ఇంటెలిజెన్స్ అసిస్టెంట్.',
    'karen.listening': 'వినడం సక్రియంగా ఉంది',
    'karen.analyzing': 'కారెన్ విశ్లేషిస్తోంది',
    'karen.tapToSpeak': 'మాట్లాడటానికి ట్యాప్ చేయండి',
    'karen.audioPlaying': 'సమాధానం చెబుతోంది...',
    'karen.playAudio': 'వాయిస్ వినండి',
    'karen.replayAudio': 'మళ్ళీ వినండి',
    'karen.pauseAudio': 'పాజ్ చేయండి',
    'karen.stopAudio': 'ఆపండి',

    // Legal Intelligence
    'legal.title': 'లీగల్ ఇంటెలిజెన్స్ (BNS)',
    'legal.applicableProvisions': 'వర్తించే నిబంధనలు',
    'legal.bnsLibrary': 'BNS నిబంధనల లైబ్రరీ',
    'legal.disclaimerTitle': 'AI సహాయక న్యాయ విశ్లేషణ',
    'legal.disclaimerText': 'అధికారిక సమీక్ష అవసరం. ఇది తుది చట్టపరమైన తీర్పు కాదు.',
    'legal.clickToView': 'పూర్తి వివరాల కోసం క్లిక్ చేయండి',
    'legal.relevance': 'ప్రాముఖ్యత',
    'legal.keyElements': 'ముఖ్య అంశాలు',
  },
  ta: {
    // Brand & Header
    'brand.name': 'க்ரைம்லென்ஸ்',
    'brand.tagline': 'ஒடிசா காவல் நுண்ணறிவு பிரிவு',
    'header.station': 'காவல் நிலையம்',
    'header.stateCommand': 'ஒடிசா காவல்துறை · மாநில கட்டளை',
    'header.engineRunning': 'நுண்ணறிவு இயந்திரம் இயங்குகிறது...',
    'header.newIntel': 'புதிய உளவுத் தகவல் கண்டறியப்பட்டது:',
    'header.viewDetails': 'விவரங்களைக் காண்க',
    'header.language': 'மொழி',

    // Sidebar Section Headers
    'nav.section.myDesk': 'என் மேசை',
    'nav.section.investigate': 'விசாரணை',
    'nav.section.intelligence': 'நுண்ணறிவு',
    'nav.section.assistance': 'உதவி',
    'nav.section.reports': 'அறிக்கைகள்',
    'nav.section.stateCommand': 'மாநில கட்டளை',
    'nav.section.policeAdmin': 'காவல் நிர்வாகம்',
    'nav.section.caseIntel': 'வழக்கு நுண்ணறிவு',
    'nav.section.networkIntel': 'நெட்வொர்க் உளவு',
    'nav.section.operations': 'செயல்பாடுகள்',
    'nav.section.system': 'அமைப்பு',

    // Nav Items
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.commandCenter': 'கட்டளை மையம்',
    'nav.myInvestigations': 'என் விசாரணைகள்',
    'nav.accessRequests': 'அணுகல் கோரிக்கைகள்',
    'nav.registerFir': 'முதல் தகவல் அறிக்கை (FIR)',
    'nav.evidenceVault': 'ஆதார பெட்டகம்',
    'nav.caseSearch': 'வழக்கு தேடல்',
    'nav.allCases': 'அனைத்து வழக்குகள்',
    'nav.networkExplorer': 'நெட்வொர்க் எக்ஸ்ப்ளோரர்',
    'nav.crimeIntelligence': 'குற்ற நுண்ணறிவு',
    'nav.legalIntelligence': 'சட்ட நுண்ணறிவு',
    'nav.aiAssistant': 'AI உதவியாளர்',
    'nav.caseReports': 'வழக்கு அறிக்கைகள்',
    'nav.policeStations': 'காவல் நிலையங்கள்',
    'nav.officers': 'அதிகாரிகள்',
    'nav.monthlyReports': 'மாதாந்திர குற்ற அறிக்கை',
    'nav.notifications': 'அறிவிப்புகள்',
    'nav.profile': 'சுயவிவரம்',

    // Common UI & Buttons
    'btn.runAiAnalysis': 'AI பகுப்பாய்வு இயக்கு',
    'btn.confirmCreateCase': 'வழக்கை உருவாக்க உறுதிசெய்',
    'btn.processEvidence': 'ஆதாரத்தை பகுப்பாய்வு செய்',
    'btn.requestAccess': 'அணுகல் கோரிக்கை வை',
    'btn.compareCase': 'வழக்குகளை ஒப்பிடு',
    'btn.viewGraph': 'வரைபடம் பார்',
    'btn.viewDetails': 'விவரங்கள் பார்',
    'btn.share': 'பகிர்',
    'btn.markCritical': 'முக்கியமானது என குறி',
    'btn.search': 'தேடு',
    'btn.reset': 'மீட்டமை',
    'btn.generateDraft': 'வரைவு உருவாக்கு',
    'btn.downloadPdf': 'PDF பதிவிறக்கம்',
    'btn.done': 'முடிந்தது',
    'btn.cancel': 'ரத்து',
    'btn.close': 'மூடு',

    // Karen & AI
    'karen.greeting': 'வணக்கம் இன்ஸ்பெக்டர். நான் கரேன் (KAREN), உங்கள் குரல் நுண்ணறிவு உதவியாளர்.',
    'karen.listening': 'கேட்கிறது...',
    'karen.analyzing': 'கரேன் பகுப்பாய்வு செய்கிறது',
    'karen.tapToSpeak': 'பேச தட்டவும்',
    'karen.audioPlaying': 'பதிலை ஒலிக்கிறது...',
    'karen.playAudio': 'குரல் இயக்கு',
    'karen.replayAudio': 'மீண்டும் கேள்',
    'karen.pauseAudio': 'இடைநிறுத்து',
    'karen.stopAudio': 'நிறுத்து',

    // Legal Intelligence
    'legal.title': 'சட்ட நுண்ணறிவு (BNS)',
    'legal.applicableProvisions': 'பொருந்தக்கூடிய சட்டப்பிரிவுகள்',
    'legal.bnsLibrary': 'BNS சட்டப்பிரிவு நூலகம்',
    'legal.disclaimerTitle': 'AI சட்ட நுண்ணறிவு',
    'legal.disclaimerText': 'அதிகாரியின் ஆய்வு தேவை. இது இறுதி சட்ட முடிவு அல்ல.',
    'legal.clickToView': 'முழு விவரம் பார்க்க கிளிக் செய்',
    'legal.relevance': 'பொருத்தம்',
    'legal.keyElements': 'முக்கிய கூறுகள்',
  },
  mr: {
    // Brand & Header
    'brand.name': 'क्राइमलेन्स',
    'brand.tagline': 'ओडिशा पोलीस इंटेलिजन्स',
    'header.station': 'पोलीस ठाणे',
    'header.stateCommand': 'ओडिशा पोलीस · राज्य कमांड',
    'header.engineRunning': 'इंटेलिजन्स इंजिन चालू आहे...',
    'header.newIntel': 'नवीन गुप्त माहिती सापडली:',
    'header.viewDetails': 'तपशील पहा',
    'header.language': 'भाषा',

    // Sidebar Section Headers
    'nav.section.myDesk': 'माझा डेस्क',
    'nav.section.investigate': 'तपास करा',
    'nav.section.intelligence': 'इंटेलिजन्स',
    'nav.section.assistance': 'सहाय्य',
    'nav.section.reports': 'अहवाल',
    'nav.section.stateCommand': 'राज्य कमांड',
    'nav.section.policeAdmin': 'पोलीस प्रशासन',
    'nav.section.caseIntel': 'केस इंटेलिजन्स',
    'nav.section.networkIntel': 'नेटवर्क इंटेलिजन्स',
    'nav.section.operations': 'ऑपरेशन्स',
    'nav.section.system': 'सिस्टम',

    // Nav Items
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.commandCenter': 'कमांड सेंटर',
    'nav.myInvestigations': 'माझे तपास',
    'nav.accessRequests': 'प्रवेश विनंत्या',
    'nav.registerFir': 'एफआयआर नोंदवा',
    'nav.evidenceVault': 'पुरावा व्हॉल्ट',
    'nav.caseSearch': 'केस शोध',
    'nav.allCases': 'सर्व केसेस',
    'nav.networkExplorer': 'नेटवर्क एक्सप्लोरर',
    'nav.crimeIntelligence': 'गुन्हेगारी इंटेलिजन्स',
    'nav.legalIntelligence': 'कायदेशीर इंटेलिजन्स',
    'nav.aiAssistant': 'एआय सहाय्यक',
    'nav.caseReports': 'केस अहवाल',
    'nav.policeStations': 'पोलीस ठाणी',
    'nav.officers': 'अधिकारी',
    'nav.monthlyReports': 'मासिक गुन्हे अहवाल',
    'nav.notifications': 'सूचना',
    'nav.profile': 'प्रोफाइल',

    // Common UI & Buttons
    'btn.runAiAnalysis': 'एआय विश्लेषण चालवा',
    'btn.confirmCreateCase': 'केस तयार करण्याची पुष्टी करा',
    'btn.processEvidence': 'पुरावा प्रक्रिया करा',
    'btn.requestAccess': 'प्रवेशाची विनंती करा',
    'btn.compareCase': 'केसची तुलना करा',
    'btn.viewGraph': 'आलेख पहा',
    'btn.viewDetails': 'तपशील पहा',
    'btn.share': 'शेअर करा',
    'btn.markCritical': 'गंभीर म्हणून चिन्हांकित करा',
    'btn.search': 'शोधा',
    'btn.reset': 'रीसेट',
    'btn.generateDraft': 'मसुदा तयार करा',
    'btn.downloadPdf': 'पीडीएफ डाउनलोड',
    'btn.done': 'झाले',
    'btn.cancel': 'रद्द करा',
    'btn.close': 'बंद करा',

    // Karen & AI
    'karen.greeting': 'नमस्कार इन्स्पेक्टर. मी करेन (KAREN), तुमची व्हॉइस इंटेलिजन्स साथीदार.',
    'karen.listening': 'ऐकणे सक्रिय आहे',
    'karen.analyzing': 'करेन विश्लेषण करत आहे',
    'karen.tapToSpeak': 'बोलण्यासाठी टॅप करा',
    'karen.audioPlaying': 'उत्तर वाचत आहे...',
    'karen.playAudio': 'आवाज ऐका',
    'karen.replayAudio': 'पुन्हा ऐका',
    'karen.pauseAudio': 'थांबवा',
    'karen.stopAudio': 'बंद करा',

    // Legal Intelligence
    'legal.title': 'कायदेशीर इंटेलिजन्स (BNS)',
    'legal.applicableProvisions': 'लागू कलमे',
    'legal.bnsLibrary': 'BNS कलम ग्रंथालय',
    'legal.disclaimerTitle': 'एआय कायदेशीर सहाय्य',
    'legal.disclaimerText': 'अधिकृत अधिकाऱ्याचे पुनरावलोकन आवश्यक. हा अंतिम कायदेशीर निर्णय नाही.',
    'legal.clickToView': 'पूर्ण कलम पाहण्यासाठी क्लिक करा',
    'legal.relevance': 'सुसंगतता',
    'legal.keyElements': 'मुख्य घटक',
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, defaultText?: string) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLangState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('crimelens-lang') as LanguageCode;
    return saved && TRANSLATIONS[saved] ? saved : 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLangState(lang);
    localStorage.setItem('crimelens-lang', lang);
  };

  const t = (key: string, defaultText?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS['en'];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};
