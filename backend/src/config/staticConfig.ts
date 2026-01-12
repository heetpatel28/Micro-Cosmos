/**
 * Static configuration for domains, services, stacks, and versions.
 * This defines what templates are available in the system.
 */

export type Domain = string;
export type ServiceType = 'frontend' | 'backend' | 'infra';
export type Stack = string;
export type Version = string;

export interface Service {
  id: string;
  name: string;
  description: string;
  domains: Domain[];
  serviceType: ServiceType;
  allowedStacks: StackConfig[];
}

export interface StackConfig {
  id: string;
  name: string;
  versions: Version[];
}

export interface GenerationRequest {
  domain: Domain;
  service: string;
  serviceType: ServiceType;
  stack: Stack;
  version: Version;
  serviceName?: string;
  port?: number;
  dbUrl?: string;
  jwtSecret?: string;
}

// ==================== DOMAINS ====================
export const DOMAINS: Domain[] = [
  'E-Commerce',
  'Fintech',
  'Healthcare',
  'Logistics',
  'EdTech',
  'Social Media',
  'SaaS',
  'Travel',
  'IoT',
  'Gaming',
  'Real Estate',
  'Automotive',
  'Legal',
  'HR',
  'Manufacturing',
  'Agriculture',
  'Cybersecurity',
  'Media/Streaming'
];

// ==================== STACK DEFINITIONS ====================
// ==================== STACK DEFINITIONS ====================
const STANDARD_BACKEND_STACKS: StackConfig[] = [
  { id: 'node', name: 'Node.js', versions: ['21', '20', '18', '16'] },
  { id: 'springboot', name: 'Spring Boot', versions: ['3.2', '3.1', '3.0', '2.7'] },
  { id: 'python', name: 'Python (FastAPI)', versions: ['3.12', '3.11', '3.10', '3.9'] },
  { id: 'go', name: 'Go (Gin)', versions: ['1.21', '1.20', '1.19'] },
  { id: 'dotnet', name: '.NET', versions: ['8.0', '7.0', '6.0'] },
  { id: 'java', name: 'Java (Micronaut)', versions: ['4.0', '3.8'] },
  { id: 'rust', name: 'Rust (Actix-web)', versions: ['1.75', '1.70'] },
];

const STANDARD_FRONTEND_STACKS: StackConfig[] = [
  { id: 'react', name: 'React', versions: ['18', '17', '16'] },
  { id: 'vue', name: 'Vue.js', versions: ['3.3', '3.0', '2.7'] },
  { id: 'angular', name: 'Angular', versions: ['17', '16', '15'] },
  { id: 'next', name: 'Next.js', versions: ['14', '13', '12'] },
  { id: 'svelte', name: 'SvelteKit', versions: ['2.0', '1.0'] },
];

const INFRA_STACKS: StackConfig[] = [
  { id: 'docker-compose', name: 'Docker Compose', versions: ['v3.9', 'v3.8', 'v3.7', 'backend-db', 'full-stack'] },
  { id: 'nginx', name: 'Nginx', versions: ['1.25', '1.24', '1.22'] },
  { id: 'k8s', name: 'Kubernetes', versions: ['1.29', '1.28', '1.27', '1.26'] },
  { id: 'terraform', name: 'Terraform', versions: ['1.6', '1.5'] },
];


// ==================== SERVICES ====================
const BACKEND_SERVICES_LIST = [
  // E-Commerce
  { id: 'auth', name: 'Authentication Service', desc: 'Secure JWT Auth & User Management', domains: DOMAINS },
  { id: 'user', name: 'User Service', desc: 'User Profile & Preference Management', domains: DOMAINS },
  { id: 'product', name: 'Product Catalog', desc: 'Product Inventory & Catalog Management', domains: ['E-Commerce', 'Manufacturing', 'Automotive'] },
  { id: 'cart', name: 'Shopping Cart', desc: 'Cart & Session Management', domains: ['E-Commerce'] },
  { id: 'order', name: 'Order Service', desc: 'Order Processing & Fulfillment', domains: ['E-Commerce', 'Logistics', 'Manufacturing'] },
  { id: 'payment', name: 'Payment Gateway', desc: 'Payment Processing Integration', domains: ['E-Commerce', 'Fintech', 'SaaS', 'Travel', 'Real Estate'] },
  { id: 'inventory', name: 'Inventory Service', desc: 'Stock & Inventory Tracking', domains: ['E-Commerce', 'Logistics', 'Manufacturing', 'Automotive'] },
  { id: 'notification', name: 'Notification Service', desc: 'Email, SMS & Push Notifications', domains: DOMAINS },
  { id: 'review', name: 'Review & Rating', desc: 'User Reviews & Ratings System', domains: ['E-Commerce', 'Travel', 'EdTech', 'Social Media', 'Real Estate'] },
  { id: 'search', name: 'Search Service', desc: 'Elasticsearch/OpenSearch Integration', domains: ['E-Commerce', 'Social Media', 'Media/Streaming', 'EdTech'] },
  { id: 'recommendation', name: 'Recommendation Engine', desc: 'AI-driven Requirements', domains: ['E-Commerce', 'Media/Streaming', 'Social Media'] },

  // Fintech
  { id: 'wallet', name: 'Digital Wallet', desc: 'Wallet & Balance Management', domains: ['Fintech', 'E-Commerce', 'Gaming'] },
  { id: 'ledger', name: 'Ledger Service', desc: 'Double-entry Ledger System', domains: ['Fintech'] },
  { id: 'kyc', name: 'KYC Service', desc: 'Know Your Customer Verification', domains: ['Fintech', 'Legal'] },
  { id: 'loan', name: 'Loan Service', desc: 'Loan Origination & Management', domains: ['Fintech'] },
  { id: 'fraud-detection', name: 'Fraud Detection', desc: 'AI Fraud Monitoring', domains: ['Fintech', 'E-Commerce'] },
  { id: 'invest', name: 'Investment Service', desc: 'Stock & Portfolio Management', domains: ['Fintech'] },

  // Healthcare
  { id: 'patient', name: 'Patient Record Service', desc: 'Electronic Health Records (EHR)', domains: ['Healthcare'] },
  { id: 'appointment', name: 'Appointment Scheduling', desc: 'Doctor Appointment Booking', domains: ['Healthcare', 'Legal'] },
  { id: 'prescription', name: 'Prescription Service', desc: 'E-Prescription Management', domains: ['Healthcare'] },
  { id: 'telehealth', name: 'Telehealth Bridge', desc: 'Video Consultation Integration', domains: ['Healthcare'] },
  { id: 'lab-result', name: 'Lab Results', desc: 'Lab Test & Result Management', domains: ['Healthcare'] },

  // Logistics
  { id: 'tracking', name: 'Shipment Tracking', desc: 'Real-time Package Tracking', domains: ['Logistics', 'E-Commerce'] },
  { id: 'fleet', name: 'Fleet Management', desc: 'Vehicle & Driver Management', domains: ['Logistics', 'Automotive'] },
  { id: 'warehouse', name: 'Warehouse WMS', desc: 'Warehouse Management System', domains: ['Logistics', 'Manufacturing'] },
  { id: 'route-opt', name: 'Route Optimization', desc: 'Delivery Route Planning', domains: ['Logistics'] },

  // EdTech
  { id: 'course', name: 'Course Service', desc: 'Course Curriculum Management', domains: ['EdTech'] },
  { id: 'quiz', name: 'Quiz & Exam Service', desc: 'Assessment & Grading System', domains: ['EdTech'] },
  { id: 'certificate', name: 'Certificate Service', desc: 'Digital Certification Generation', domains: ['EdTech'] },
  { id: 'lms-core', name: 'LMS Core', desc: 'Learning Management Core', domains: ['EdTech'] },

  // Social Media
  { id: 'post', name: 'Post Service', desc: 'Feeds & Post Management', domains: ['Social Media'] },
  { id: 'comment', name: 'Comment Service', desc: 'Threaded Comments System', domains: ['Social Media', 'EdTech', 'Media/Streaming'] },
  { id: 'friend', name: 'Friend/Graph Service', desc: 'Social Graph & Connections', domains: ['Social Media'] },
  { id: 'chat', name: 'Chat Service', desc: 'Real-time Messaging', domains: ['Social Media', 'SaaS', 'Gaming'] },
  { id: 'media-upload', name: 'Media Upload', desc: 'Image & Video Processing', domains: ['Social Media', 'Media/Streaming', 'Real Estate'] },

  // Travel
  { id: 'flight', name: 'Flight Booking', desc: 'Flight Reservation System', domains: ['Travel'] },
  { id: 'hotel', name: 'Hotel Booking', desc: 'Hotel Room Reservation', domains: ['Travel'] },
  { id: 'itinerary', name: 'Itinerary Planner', desc: 'Trip Planning Service', domains: ['Travel'] },

  // IoT
  { id: 'device-registry', name: 'Device Registry', desc: 'IoT Device Registration', domains: ['IoT', 'Smart Home'] },
  { id: 'telemetry', name: 'Telemetry Service', desc: 'Sensor Data Ingestion', domains: ['IoT', 'Manufacturing'] },
  { id: 'command', name: 'Command & Control', desc: 'Remote Device Control', domains: ['IoT'] },

  // SaaS
  { id: 'subscription', name: 'Subscription Service', desc: 'Plan & Billing Management', domains: ['SaaS', 'Media/Streaming'] },
  { id: 'tenant', name: 'Tenant Manager', desc: 'Multi-tenancy Isolation', domains: ['SaaS'] },
  { id: 'billing', name: 'Billing Service', desc: 'Invoice Generation', domains: ['SaaS', 'Fintech', 'Legal'] },

  // Gaming
  { id: 'leaderboard', name: 'Leaderboard Service', desc: 'Rank & Score Tracking', domains: ['Gaming', 'EdTech'] },
  { id: 'matchmaking', name: 'Matchmaking Service', desc: 'Multiplayer Matchmaker', domains: ['Gaming'] },
  { id: 'game-inventory', name: 'In-Game Inventory', desc: 'Virtual Item Management', domains: ['Gaming'] },

  // Real Estate
  { id: 'property', name: 'Property Service', desc: 'Property Listing & Search', domains: ['Real Estate'] },
  { id: 'viewing', name: 'Viewing Scheduler', desc: 'House Viewing Appointments', domains: ['Real Estate'] },

  // Automotive
  { id: 'vehicle', name: 'Vehicle Service', desc: 'Car Specs & Maintenance', domains: ['Automotive', 'Logistics'] },
  { id: 'service-center', name: 'Service Booking', desc: 'Maintenance Scheduling', domains: ['Automotive'] },

  // HR
  { id: 'employee', name: 'Employee Directory', desc: 'HR Information System', domains: ['HR'] },
  { id: 'payroll', name: 'Payroll Service', desc: 'Salary & Tax Calculation', domains: ['HR', 'Fintech'] },
  { id: 'attendance', name: 'Attendance Service', desc: 'Time & Attendance Tracking', domains: ['HR'] },

  // Media
  { id: 'streaming', name: 'Streaming Service', desc: 'Video Streaming Core', domains: ['Media/Streaming'] },
  { id: 'drm', name: 'DRM Service', desc: 'Digital Rights Management', domains: ['Media/Streaming'] },

  // Generic
  { id: 'audit-log', name: 'Audit Log Service', desc: 'Centralized Auditing', domains: DOMAINS },
  { id: 'analytics', name: 'Analytics Service', desc: 'Data Analytics & KPIs', domains: DOMAINS },
  { id: 'gateway', name: 'API Gateway', desc: 'Central Entry Point', domains: DOMAINS },
  { id: 'config-server', name: 'Config Server', desc: 'Centralized Configuration', domains: DOMAINS },
  { id: 'discovery', name: 'Service Discovery', desc: 'Service Registry (Eureka/Consul)', domains: DOMAINS },
];

export const SERVICES: Service[] = [
  // Map backend services
  ...BACKEND_SERVICES_LIST.map(s => ({
    id: s.id,
    name: s.name,
    description: s.desc,
    domains: s.domains,
    serviceType: 'backend' as ServiceType,
    allowedStacks: STANDARD_BACKEND_STACKS
  })),

  // Frontend Services
  {
    id: 'auth-ui',
    name: 'Auth UI',
    description: 'Authentication UI with login and registration',
    domains: DOMAINS,
    serviceType: 'frontend',
    allowedStacks: STANDARD_FRONTEND_STACKS,
  },
  {
    id: 'dashboard-ui',
    name: 'Dashboard UI',
    description: 'Dashboard UI with sidebar layout',
    domains: DOMAINS,
    serviceType: 'frontend',
    allowedStacks: STANDARD_FRONTEND_STACKS,
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Marketing Landing Page',
    domains: DOMAINS,
    serviceType: 'frontend',
    allowedStacks: STANDARD_FRONTEND_STACKS,
  },
  {
    id: 'admin-panel',
    name: 'Admin Panel',
    description: 'Backoffice Administration UI',
    domains: ['E-Commerce', 'SaaS', 'Fintech'],
    serviceType: 'frontend',
    allowedStacks: STANDARD_FRONTEND_STACKS,
  },

  // Infra Services
  {
    id: 'docker-compose-backend',
    name: 'Docker Compose (Backend + DB)',
    description: 'Docker Compose configuration for backend and database',
    domains: DOMAINS,
    serviceType: 'infra',
    allowedStacks: INFRA_STACKS.filter(s => s.id === 'docker-compose'),
  },
  {
    id: 'docker-compose-fullstack',
    name: 'Docker Compose (Full Stack)',
    description: 'Docker Compose configuration for full-stack application',
    domains: DOMAINS,
    serviceType: 'infra',
    allowedStacks: INFRA_STACKS.filter(s => s.id === 'docker-compose'),
  },
  {
    id: 'nginx-reverse-proxy',
    name: 'Nginx Reverse Proxy',
    description: 'Nginx reverse proxy configuration',
    domains: DOMAINS,
    serviceType: 'infra',
    allowedStacks: INFRA_STACKS.filter(s => s.id === 'nginx'),
  },
  {
    id: 'nginx-load-balancer',
    name: 'Nginx Load Balancer',
    description: 'Nginx load balancer configuration',
    domains: DOMAINS,
    serviceType: 'infra',
    allowedStacks: INFRA_STACKS.filter(s => s.id === 'nginx'),
  },
  {
    id: 'k8s-manifests',
    name: 'Kubernetes Manifests',
    description: 'K8s deployment and service manifests',
    domains: DOMAINS,
    serviceType: 'infra',
    allowedStacks: [{ id: 'k8s', name: 'Kubernetes', versions: ['1.28'] }],
  }
];

// ==================== HELPER FUNCTIONS ====================

export function getServiceById(serviceId: string): Service | undefined {
  return SERVICES.find(s => s.id === serviceId);
}

export function getAllowedStacks(serviceId: string): StackConfig[] {
  const service = getServiceById(serviceId);
  return service?.allowedStacks || [];
}

export function getAllowedVersions(serviceId: string, stackId: string): Version[] {
  const service = getServiceById(serviceId);
  const stack = service?.allowedStacks.find(s => s.id === stackId);
  return stack?.versions || [];
}

export function validateGenerationRequest(request: Partial<GenerationRequest>): {
  valid: boolean;
  error?: string;
} {
  if (!request.domain) {
    return { valid: false, error: 'Domain is required' };
  }

  if (!request.service) {
    return { valid: false, error: 'Service is required' };
  }

  if (!request.serviceType) {
    return { valid: false, error: 'Service type is required' };
  }

  if (!request.stack) {
    return { valid: false, error: 'Stack is required' };
  }

  if (!request.version) {
    return { valid: false, error: 'Version is required' };
  }

  const service = getServiceById(request.service);
  if (!service) {
    return { valid: false, error: 'Invalid service' };
  }

  if (service.serviceType !== request.serviceType) {
    return { valid: false, error: 'Service type mismatch' };
  }

  if (!service.domains.includes(request.domain)) {
    return { valid: false, error: 'Domain not allowed for this service' };
  }

  const allowedStacks = getAllowedStacks(request.service);
  const stackConfig = allowedStacks.find(s => s.id === request.stack);
  if (!stackConfig) {
    return { valid: false, error: 'Stack not allowed for this service' };
  }

  if (!stackConfig.versions.includes(request.version)) {
    return { valid: false, error: 'Version not allowed for this stack' };
  }

  return { valid: true };
}

export function getTemplatePath(
  serviceType: ServiceType,
  stack: Stack,
  version: Version,
  serviceId: string
): string {
  // Template path structure: templates/{serviceType}/{stack}/{version}/{serviceId}
  // Special handling for infra services
  if (serviceType === 'infra') {
    if (serviceId === 'docker-compose-backend') {
      // Docker compose templates: infra/docker-compose/backend-db/
      return `infra/docker-compose/backend-db`;
    }
    if (serviceId === 'docker-compose-fullstack') {
      // Docker compose templates: infra/docker-compose/full-stack/
      return `infra/docker-compose/full-stack`;
    }
    if (serviceId === 'nginx-reverse-proxy' || serviceId === 'nginx-load-balancer') {
      // Nginx templates: infra/nginx/{version}/{serviceType}/
      const nginxType = serviceId.replace('nginx-', '');
      return `infra/nginx/${version}/${nginxType}`;
    }
    if (serviceId === 'k8s-manifests') {
      return `infra/k8s`; // Assumes generic k8s directory for now
    }
  }
  return `${serviceType}/${stack}/${version}/${serviceId}`;
}
