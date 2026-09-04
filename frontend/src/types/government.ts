export type ServiceStatus = "required" | "recommended" | "conditional";
export type EligibilityStatus = "likely" | "possible" | "unlikely";

export interface GovernmentService {
  id: string;
  name: string;
  status: ServiceStatus;
  reason: string;
  documents: string[];
  howToApply: string;
  whereToApply: string;
  officialUrl: string;
  articleId?: string;
}

export interface LifeEventQuestion {
  id: string;
  label: string;
  type: "text" | "select";
  options?: string[];
}

export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: LifeEventQuestion[];
  services: GovernmentService[];
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string[];
  states: string[];
  eligibility: string;
  benefits: string[];
  documents: string[];
  applicationMethod: string;
  officialUrl: string;
  lastVerified: string;
  matches: (answers: SchemeAnswers) => EligibilityStatus;
}

export interface SchemeAnswers {
  ageGroup: string;
  occupation: string;
  state: string;
  incomeRange: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  whoNeedsIt: string;
  eligibility: string;
  documents: string[];
  steps: string[];
  whereToApply: string;
  mode: string;
  fees: string;
  processingTime: string;
  commonMistakes: string[];
  faqs: { question: string; answer: string }[];
  officialSource: string;
  lastVerified: string;
  verified: boolean;
  service?: GovernmentService;
}

export interface NavigatorActions {
  addToRoadmap?: (service: GovernmentService) => void;
  addToChecklist?: (documents: string[], context: string) => void;
  addToTracker?: (service: GovernmentService) => void;
  scheduleNotification?: (service: GovernmentService) => void;
  openOfficialUrl?: (url: string) => void;
  askAssistant?: (prompt: string) => void;
}
