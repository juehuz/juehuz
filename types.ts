export type AIModelId = 'gemini-3-flash' | 'gpt-4' | 'claude-3-opus';

export interface AIModelConfig {
  id: AIModelId;
  name: string;
  provider: 'Google' | 'OpenAI' | 'Anthropic';
  active: boolean;
}

export type TranslationDomain = 'general' | 'medical' | 'legal' | 'tech' | 'marketing';

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  model: AIModelId;
  domain: TranslationDomain;
  useMultiEngine: boolean;
}

export interface EngineResult {
  provider: string; // 'Google' | 'DeepL' | 'Baidu'
  text: string;
  score: number; // 0-100 Quality Score
}

export interface TranslationResult {
  original: string;
  finalTranslation: string;
  variants?: EngineResult[]; // For multi-engine mode
  bestProvider?: string;
  detectedSource?: string;
  modelUsed: string;
  timestamp: number;
}

export interface LanguageOption {
  code: string;
  name: string;
}

export interface TranslationMemoryItem {
  id: string;
  source: string;
  target: string;
  domain: TranslationDomain;
  matchScore?: number; // Calculated at runtime
}

export enum AppRoute {
  TRANSLATE = 'translate',
  DOC_PROCESSOR = 'doc-processor',
  ADMIN_CONSOLE = 'admin-console',
  IMAGE_AR = 'image-ar', 
}

// --- Image AR Types ---

export interface TextOverlay {
  originalText: string;
  translatedText: string;
  box_2d: [number, number, number, number]; // ymin, xmin, ymax, xmax (0-1000 scale)
  backgroundColor: string; // Hex code estimate
  textColor: string; // Hex code estimate
}

export interface ImageARResult {
  overlays: TextOverlay[];
}

// --- Document Processing Types ---

export type DocFormat = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'latex' | 'md';

export interface DocProcessJob {
  id: string;
  filename: string;
  format: DocFormat;
  status: 'queued' | 'parsing' | 'ocr' | 'translating' | 'reconstructing' | 'completed' | 'failed';
  progress: number;
  resultUrl?: string;
}

export interface RedactionResult {
  original: string;
  redacted: string;
  entities: string[];
}

// --- Enterprise Admin Types ---

export interface Project {
  id: string;
  name: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  progress: number;
  team: string[];
  deadline: string;
  budget: number;
  cost: number;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  quota: number; // requests per month
  usage: number;
  rateLimit: number; // requests per second
  status: 'active' | 'revoked';
}

export interface SystemMetric {
  timestamp: string;
  value: number;
}

export interface RoiData {
  humanCost: number;
  aiCost: number;
  savings: number;
}

// --- Performance & Monitoring Types ---

export interface RegionHealth {
  id: string;
  name: string; // e.g., 'US-East (N. Virginia)'
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  activePods: number;
}

export interface PerformanceSnapshot {
  timestamp: number;
  globalLatency: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  totalRequests: number;
}

// --- Collaboration Types ---

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  status: string;
  role?: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface CRDTChar {
  id: string;
  value: string;
  tombstone: boolean;
  clock: number;
  siteId: string;
}

export interface DeviceSyncStatus {
  deviceId: string;
  deviceName: string;
  type: string;
  lastSync: string;
  status: string;
}

// --- AI Toolkit Types ---

export interface AcademicAnalysis {
  abstract: string;
  keywords: string[];
  translation: string;
  notes: { term: string; explanation: string }[];
}

export interface QualityReview {
  score: number;
  critique: string;
  suggestions: {
    formal: string;
    concise: string;
    creative: string;
  };
}

export interface TerminologyExtraction {
  terms: {
    term: string;
    category: string;
    definition: string;
  }[];
}

// --- User Profile Types ---

export interface HistoryItem {
  id: string;
  date: string;
  sourcePreview: string;
  targetPreview: string;
  langPair: string;
  domain: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  translation: string;
  domain: string;
  lastUpdated: string;
  status: 'synced' | 'pending' | 'conflict';
}

export interface UserStats {
  totalWords: number;
  projectsCompleted: number;
  efficiencyScore: number;
  topDomains: { domain: string; count: number }[];
}

export interface UserPersona {
  title: string;
  styleParams: {
    formality: number;
    creativity: number;
    conciseness: number;
  };
  strengths: string[];
  recommendations: string[];
}

// --- Community Types ---

export interface TrainingCourse {
  id: string;
  title: string;
  level: string;
  progress: number;
  image: string;
}

export interface CrowdTask {
  id: string;
  source: string;
  langPair: string;
  reward: number;
  deadline: string;
  status: 'open' | 'in_review' | 'completed';
}