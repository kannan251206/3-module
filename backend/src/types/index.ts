export type Lang = 'en' | 'ta'
export interface Bilingual {
  en: string
  ta: string
}

export type ServiceCategory =
  | 'identity' | 'certificates' | 'education' | 'employment' | 'transport'
  | 'healthcare' | 'financial' | 'welfare' | 'business' | 'land' | 'tax'

export interface RoadmapStep {
  id: string
  title: Bilingual
  description: Bilingual
}

export interface GovService {
  id: string
  name: Bilingual
  category: ServiceCategory
  department: Bilingual
  description: Bilingual
  eligibility: Bilingual[]
  documents: Bilingual[]
  steps: RoadmapStep[]
  commonMistakes: Bilingual[]
  officialUrl: string | null
  portalName?: string | null
  feeNote: Bilingual | null
  processingTimeNote: Bilingual | null
  keywords: string[]
  isDemoData: boolean
}

export type ApplicationStatus = 'not_started' | 'documents_pending' | 'submitted' | 'in_progress' | 'completed'

export interface Application {
  id: string
  userId: string
  serviceId: string
  applicationRef: string
  status: ApplicationStatus
  currentStepIndex: number
  dateStarted: string
  lastUpdated: string
}
