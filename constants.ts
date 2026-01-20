import { AIModelConfig, LanguageOption, TranslationDomain } from './types';

export const SUPPORTED_MODELS: AIModelConfig[] = [
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', provider: 'Google', active: true },
  { id: 'gpt-4', name: 'GPT-4 Turbo', provider: 'OpenAI', active: false }, 
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', active: false },
];

export const DOMAINS: { id: TranslationDomain; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'tech', label: 'Technology & IT' },
  { id: 'legal', label: 'Legal & Contracts' },
  { id: 'medical', label: 'Medical & Pharma' },
  { id: 'marketing', label: 'Marketing & SEO' },
];

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
];

export const DOC_FORMATS = [
  { value: 'pdf', label: 'Adobe PDF (.pdf)' },
  { value: 'docx', label: 'Microsoft Word (.docx)' },
  { value: 'xlsx', label: 'Excel Spreadsheet (.xlsx)' },
  { value: 'pptx', label: 'PowerPoint (.pptx)' },
  { value: 'latex', label: 'LaTeX Document (.tex)' },
];

// Backend Architecture Code Snippets for the Docs Page
export const BACKEND_PACKAGE_JSON = `{
  "name": "polyglot-doc-processor",
  "version": "3.0.0",
  "dependencies": {
    "bullmq": "^4.12.0", 
    "pdf-parse": "^1.1.1",
    "office-parser": "^4.0.0",
    "tesseract.js": "^4.1.1",
    "@google/genai": "^0.0.1"
  }
}`;

export const BACKEND_DOCKERFILE = `# Distributed Document Worker
FROM node:18-slim
RUN apt-get update && apt-get install -y poppler-utils ghostscript
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "dist/doc-worker.js"]`;

export const BACKEND_ROUTE_EXAMPLE = `// Distributed Document Pipeline (BullMQ)
import { Worker, Job } from 'bullmq';
import { pipeline } from './pipeline';

const docWorker = new Worker('doc-processing', async (job: Job) => {
  const { fileUrl, targetFormat, options } = job.data;
  
  await job.updateProgress(10);
  
  // Step 1: Intelligent Parsing & OCR
  const rawContent = await pipeline.parse(fileUrl, { ocr: true });
  await job.updateProgress(40);
  
  // Step 2: AI Privacy Scrubbing (Optional)
  let cleanContent = rawContent;
  if (options.privacyMode) {
     cleanContent = await pipeline.redactSensitiveInfo(rawContent);
  }
  await job.updateProgress(60);

  // Step 3: Layout-Preserving Translation
  const translated = await pipeline.translatePreservingLayout(cleanContent, 'es');
  await job.updateProgress(80);

  // Step 4: Reconstruct Document
  const resultUrl = await pipeline.reconstruct(translated, targetFormat);
  await job.updateProgress(100);

  return { resultUrl };
}, { 
  concurrency: 5, // Process 5 docs in parallel
  connection: redisConfig 
});`;

export const NGINX_GATEWAY_CONFIG = `# API Gateway & Rate Limiting (Nginx)
http {
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    
    server {
        listen 80;
        
        location /api/v1/translate {
            limit_req zone=api_limit burst=20 nodelay;
            
            # Authentication Check (Subrequest)
            auth_request /auth;
            
            proxy_pass http://translation_service:3000;
        }

        location = /auth {
            internal;
            proxy_pass http://auth_service:4000/validate-key;
        }
    }
}`;

export const K8S_HELM_VALUES = `# Helm Values for Private Deployment
global:
  environment: production
  tenantId: "enterprise-customer-01"

aiModel:
  provider: "local-llm" # 'google', 'openai', or 'local-llm'
  image: "ollama/ollama:latest"
  resources:
    limits:
      nvidia.com/gpu: 1

apiGateway:
  replicaCount: 3
  rateLimit:
    enabled: true
    requestsPerSecond: 100

database:
  persistence:
    enabled: true
    size: 500Gi
`;

export const HPA_CONFIG = `# Kubernetes Horizontal Pod Autoscaler (HPA)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: translation-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: translation-service
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Pods
    pods:
      metric:
        name: active_requests
      target:
        type: AverageValue
        averageValue: 100
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
    scaleUp:
      stabilizationWindowSeconds: 0
`;

export const DR_STRATEGY_JSON = `{
  "strategy": "Active-Passive (Hot Standby)",
  "rpo": "5 minutes",
  "rto": "15 minutes",
  "regions": {
    "primary": "us-east-1",
    "failover": "eu-central-1"
  },
  "replication": {
    "database": "Async Streaming Replication",
    "storage": "Cross-Region Bucket Replication"
  },
  "failover_trigger": {
    "condition": "Health check fails for 3 consecutive minutes",
    "action": "DNS Weigh Change (Route53)"
  }
}`;