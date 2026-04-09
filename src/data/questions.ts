import { Cloud, Server, Database, HardDrive, Monitor, Shield, Globe, Cpu, Code, BarChart, Users, Video, Briefcase, FileText, Lock, Leaf, HelpCircle, Building, Box, CheckSquare } from 'lucide-react';

export const CATEGORIES = {
  'SOV-1': { id: 'SOV-1', name: 'Strategic', weight: 0.15 },
  'SOV-2': { id: 'SOV-2', name: 'Legal & Jurisdictional', weight: 0.10 },
  'SOV-3': { id: 'SOV-3', name: 'Data & AI', weight: 0.10 },
  'SOV-4': { id: 'SOV-4', name: 'Operational', weight: 0.15 },
  'SOV-5': { id: 'SOV-5', name: 'Supply Chain', weight: 0.20 },
  'SOV-6': { id: 'SOV-6', name: 'Technology', weight: 0.15 },
  'SOV-7': { id: 'SOV-7', name: 'Security & Compliance', weight: 0.10 },
  'SOV-8': { id: 'SOV-8', name: 'Environmental', weight: 0.05 },
};

export type CategoryId = keyof typeof CATEGORIES;

export interface Recommendation {
  id: string;
  name: string;
  reason: string;
  pros: string[];
  cons: string[];
  recommendedAnswerId: string;
}

export interface Answer {
  id: string;
  text: string;
  score: number;
  recommendations?: Recommendation[];
  icon?: any;
}

export interface Question {
  id: string;
  title: string;
  categories: CategoryId[];
  answers: Answer[];
  multiSelect?: boolean;
}

const cloudRecommendations: Recommendation[] = [
  {
    id: 'ovh',
    name: 'OVHcloud',
    reason: 'A leading European cloud provider fully subject to EU jurisdiction, protecting against the US CLOUD Act.',
    pros: ['Full GDPR compliance', 'Predictable pricing', 'Strong bare-metal offerings'],
    cons: ['Smaller managed services ecosystem', 'Different API paradigms than AWS/GCP'],
    recommendedAnswerId: 'eu_cloud'
  },
  {
    id: 'scaleway',
    name: 'Scaleway',
    reason: 'French cloud provider with a strong ecological focus and modern developer experience.',
    pros: ['Developer friendly', 'Excellent managed Kubernetes', 'High environmental standards'],
    cons: ['Limited global regions outside EU', 'Fewer enterprise legacy features'],
    recommendedAnswerId: 'eu_cloud'
  },
  {
    id: 'hetzner',
    name: 'Hetzner',
    reason: 'German hosting company known for incredible price-to-performance ratios and strict EU data privacy.',
    pros: ['Extremely cost-effective', 'High performance', 'Strict German privacy laws'],
    cons: ['More DIY approach required', 'Limited high-level managed services'],
    recommendedAnswerId: 'eu_cloud'
  }
];

const dbRecommendations: Recommendation[] = [
  {
    id: 'aiven',
    name: 'Aiven',
    reason: 'EU-based managed data platform that can run on various clouds, offering strong data sovereignty controls.',
    pros: ['Multi-cloud flexibility', 'Fully open-source based', 'EU company'],
    cons: ['Premium pricing', 'Still relies on underlying cloud infra'],
    recommendedAnswerId: 'self_hosted_db'
  },
  {
    id: 'clever_cloud',
    name: 'Clever Cloud',
    reason: 'French PaaS provider offering excellent managed databases with strict EU data residency.',
    pros: ['Automated scaling', 'Strict EU data protection', 'Great developer experience'],
    cons: ['Niche ecosystem', 'Pricing can scale quickly'],
    recommendedAnswerId: 'self_hosted_db'
  },
  {
    id: 'self_hosted_pg',
    name: 'Self-hosted PostgreSQL',
    reason: 'Running your own database on EU infrastructure guarantees absolute control over your data.',
    pros: ['Maximum data sovereignty', 'No vendor lock-in', 'Cost-effective at scale'],
    cons: ['High operational overhead', 'Requires dedicated DBA expertise'],
    recommendedAnswerId: 'self_hosted_db'
  }
];

const officeRecommendations: Recommendation[] = [
  {
    id: 'nextcloud',
    name: 'Nextcloud',
    reason: 'The leading open-source collaboration platform, fully auditable and hostable within the EU.',
    pros: ['Complete data control', 'Extensive plugin ecosystem', 'Open source'],
    cons: ['Requires hosting management', 'UI/UX differs from Google/MS'],
    recommendedAnswerId: 'nextcloud'
  },
  {
    id: 'infomaniak',
    name: 'Infomaniak kSuite',
    reason: 'Swiss-hosted ethical alternative to Google Workspace and Microsoft 365.',
    pros: ['Swiss privacy laws', 'Turnkey SaaS solution', 'Eco-friendly infrastructure'],
    cons: ['Smaller user base', 'Fewer third-party integrations'],
    recommendedAnswerId: 'nextcloud'
  },
  {
    id: 'onlyoffice',
    name: 'OnlyOffice',
    reason: 'Powerful open-source office suite with high compatibility with MS Office formats.',
    pros: ['Excellent MS Office compatibility', 'Can be self-hosted', 'Strong security features'],
    cons: ['Collaboration features can be complex to scale', 'Resource intensive'],
    recommendedAnswerId: 'nextcloud'
  }
];

const aiRecommendations: Recommendation[] = [
  {
    id: 'mistral',
    name: 'Mistral AI',
    reason: 'Leading European AI lab offering state-of-the-art open-weight and commercial models.',
    pros: ['EU jurisdiction', 'Highly performant models', 'Open-weight options available'],
    cons: ['Newer ecosystem', 'Fewer multimodal capabilities than GPT-4'],
    recommendedAnswerId: 'mistral'
  },
  {
    id: 'aleph_alpha',
    name: 'Aleph Alpha',
    reason: 'German AI company focused heavily on enterprise data sovereignty and explainability.',
    pros: ['B2B focus', 'Strong data privacy guarantees', 'Explainable AI features'],
    cons: ['Higher cost for entry', 'Less developer-focused tooling'],
    recommendedAnswerId: 'mistral'
  },
  {
    id: 'local_llama',
    name: 'Self-hosted Open Models',
    reason: 'Running models like Llama 3 or Mixtral on your own EU infrastructure ensures zero data leakage.',
    pros: ['Absolute data privacy', 'No API costs', 'Custom fine-tuning'],
    cons: ['High GPU infrastructure costs', 'Complex operational overhead'],
    recommendedAnswerId: 'eu_os'
  }
];

export const QUESTIONS: Question[] = [
  {
    id: 'q_db',
    title: 'What database do you primarily use?',
    categories: ['SOV-3', 'SOV-6'],
    multiSelect: true,
    answers: [
      { id: 'managed_us', text: 'Managed AWS RDS / Azure SQL', score: 0, recommendations: dbRecommendations, icon: Database },
      { id: 'mongo_atlas', text: 'MongoDB Atlas', score: 1, recommendations: dbRecommendations, icon: Database },
      { id: 'self_hosted_db', text: 'Self-hosted PostgreSQL/MySQL', score: 4, icon: Server },
      { id: 'other', text: 'Other', score: 2, icon: HelpCircle },
    ]
  },
  {
    id: 'q_office',
    title: 'What do you use for productivity/office tools?',
    categories: ['SOV-6', 'SOV-3'],
    multiSelect: true,
    answers: [
      { id: 'ms365', text: 'Microsoft 365', score: 0, recommendations: officeRecommendations, icon: FileText },
      { id: 'gworkspace', text: 'Google Workspace', score: 0, recommendations: officeRecommendations, icon: FileText },
      { id: 'libreoffice', text: 'LibreOffice / Local', score: 4, icon: Monitor },
      { id: 'nextcloud', text: 'Nextcloud / EU Hosted', score: 4, icon: Cloud },
      { id: 'other', text: 'Other', score: 2, icon: HelpCircle },
    ]
  },
  {
    id: 'q_data_loc',
    title: 'Where is your primary data hosted?',
    categories: ['SOV-2', 'SOV-3'],
    multiSelect: false,
    answers: [
      { id: 'us', text: 'US or Non-EU', score: 0, icon: Globe, recommendations: [
        { id: 'eu_dc', name: 'Migrate to EU Data Centers', reason: 'Moving data to the EU ensures it is protected by GDPR and local laws.', pros: ['Legal compliance', 'Lower latency for EU users'], cons: ['Migration effort', 'Potential latency for US users'], recommendedAnswerId: 'eu_eu' }
      ]},
      { id: 'eu_us', text: 'EU, but US-owned company', score: 2, icon: Building, recommendations: [
        { id: 'eu_owned', name: 'Migrate to EU-owned provider', reason: 'US-owned companies are subject to the CLOUD Act, even if data is in the EU.', pros: ['Protection from foreign subpoenas', 'True legal sovereignty'], cons: ['Vendor lock-in migration costs'], recommendedAnswerId: 'eu_eu' }
      ]},
      { id: 'eu_eu', text: 'EU, EU-owned company', score: 4, icon: Shield },
      { id: 'onprem', text: 'On-premise (EU)', score: 4, icon: Server },
    ]
  },
  {
    id: 'q_ai',
    title: 'Do you use AI APIs?',
    categories: ['SOV-3', 'SOV-6'],
    multiSelect: true,
    answers: [
      { id: 'openai', text: 'OpenAI / Anthropic', score: 0, recommendations: aiRecommendations, icon: Cpu },
      { id: 'gemini', text: 'Google Gemini', score: 0, recommendations: aiRecommendations, icon: Cpu },
      { id: 'eu_os', text: 'EU-hosted Open Source Models', score: 4, icon: Code },
      { id: 'mistral', text: 'Mistral AI / Aleph Alpha', score: 4, icon: Cpu },
      { id: 'none', text: 'None', score: 4, icon: Shield },
    ]
  },
  {
    id: 'q_cicd',
    title: 'What do you use for CI/CD and Code Hosting?',
    categories: ['SOV-4', 'SOV-5', 'SOV-6'],
    multiSelect: true,
    answers: [
      { id: 'github', text: 'GitHub / GitLab SaaS (US)', score: 1, icon: Code, recommendations: [
        { id: 'gitlab_sh', name: 'Self-hosted GitLab', reason: 'Keep your intellectual property entirely within your own infrastructure.', pros: ['Total code privacy', 'No per-user SaaS fees'], cons: ['Maintenance overhead'], recommendedAnswerId: 'self_gitlab' },
        { id: 'gitea', name: 'Gitea / Forgejo', reason: 'Lightweight, open-source alternatives that are easy to host in the EU.', pros: ['Very low resource usage', 'Fast and responsive'], cons: ['Smaller CI ecosystem than GitHub Actions'], recommendedAnswerId: 'self_gitlab' }
      ]},
      { id: 'bitbucket', text: 'Bitbucket', score: 1, icon: Code, recommendations: [
        { id: 'gitlab_sh', name: 'Self-hosted GitLab', reason: 'Keep your intellectual property entirely within your own infrastructure.', pros: ['Total code privacy', 'No per-user SaaS fees'], cons: ['Maintenance overhead'], recommendedAnswerId: 'self_gitlab' }
      ]},
      { id: 'self_gitlab', text: 'Self-hosted GitLab / Gitea (EU)', score: 4, icon: Server },
      { id: 'other', text: 'Other', score: 2, icon: HelpCircle },
    ]
  },
  {
    id: 'q_analytics',
    title: 'What do you use for Analytics and Tracking?',
    categories: ['SOV-3', 'SOV-7'],
    multiSelect: true,
    answers: [
      { id: 'ga', text: 'Google Analytics', score: 0, icon: BarChart, recommendations: [
        { id: 'matomo', name: 'Matomo', reason: 'Powerful open-source analytics that can be self-hosted or EU-hosted, ensuring GDPR compliance without consent banners.', pros: ['100% data ownership', 'No cookie banners needed (if configured right)'], cons: ['UI is less modern than GA4'], recommendedAnswerId: 'matomo' },
        { id: 'plausible', name: 'Plausible Analytics', reason: 'Lightweight, privacy-friendly EU-based analytics.', pros: ['Very fast', 'Privacy-first', 'Simple UI'], cons: ['Lacks deep behavioral funnels'], recommendedAnswerId: 'matomo' }
      ]},
      { id: 'mixpanel', text: 'Mixpanel / Amplitude', score: 0, icon: BarChart, recommendations: [
        { id: 'posthog_eu', name: 'PostHog (EU Cloud)', reason: 'Open-source product analytics with an EU-hosted cloud option.', pros: ['Feature parity with Mixpanel', 'Session recording', 'EU data residency'], cons: ['Complex setup for advanced features'], recommendedAnswerId: 'matomo' }
      ]},
      { id: 'matomo', text: 'Matomo / Plausible (EU)', score: 4, icon: Shield },
      { id: 'none', text: 'None', score: 4, icon: CheckSquare },
    ]
  },
  {
    id: 'q_iam',
    title: 'What do you use for Identity and Access Management (IAM)?',
    categories: ['SOV-7', 'SOV-6'],
    multiSelect: false,
    answers: [
      { id: 'okta', text: 'Okta / Auth0 / Entra ID', score: 0, icon: Users, recommendations: [
        { id: 'keycloak', name: 'Keycloak', reason: 'Open-source identity and access management backed by Red Hat, fully hostable in the EU.', pros: ['Highly customizable', 'No vendor lock-in', 'Free open source'], cons: ['Complex configuration', 'Requires Java expertise to extend'], recommendedAnswerId: 'keycloak' },
        { id: 'zitadel', name: 'Zitadel', reason: 'Swiss-built, open-source IAM designed for the cloud-native era.', pros: ['Modern architecture', 'Swiss privacy laws', 'Great developer experience'], cons: ['Newer ecosystem'], recommendedAnswerId: 'keycloak' }
      ]},
      { id: 'keycloak', text: 'Keycloak (Self-hosted/EU)', score: 4, icon: Lock },
      { id: 'custom', text: 'Custom in-house', score: 3, icon: Code },
      { id: 'other', text: 'Other', score: 2, icon: HelpCircle },
    ]
  },
  {
    id: 'q_video',
    title: 'What do you use for Video Conferencing?',
    categories: ['SOV-3', 'SOV-6'],
    multiSelect: true,
    answers: [
      { id: 'zoom', text: 'Zoom / Google Meet / MS Teams', score: 0, icon: Video, recommendations: [
        { id: 'jitsi', name: 'Jitsi Meet', reason: 'Fully open-source, encrypted video conferencing that can be hosted on your own EU servers.', pros: ['No account required', 'End-to-end encryption support', 'Free'], cons: ['Can struggle with very large meetings'], recommendedAnswerId: 'jitsi' },
        { id: 'bbb', name: 'BigBlueButton', reason: 'Open-source web conferencing system heavily used in EU education and public sectors.', pros: ['Great presentation features', 'Deep LMS integration'], cons: ['Heavy server requirements'], recommendedAnswerId: 'jitsi' }
      ]},
      { id: 'webex', text: 'Webex', score: 1, icon: Video, recommendations: [
        { id: 'jitsi', name: 'Jitsi Meet', reason: 'Fully open-source, encrypted video conferencing.', pros: ['No account required', 'End-to-end encryption support'], cons: ['Can struggle with very large meetings'], recommendedAnswerId: 'jitsi' }
      ]},
      { id: 'jitsi', text: 'Jitsi / BigBlueButton (EU hosted)', score: 4, icon: Shield },
      { id: 'other', text: 'Other', score: 2, icon: HelpCircle },
    ]
  },
  {
    id: 'q_crm',
    title: 'What do you use for CRM / ERP?',
    categories: ['SOV-3', 'SOV-5'],
    multiSelect: true,
    answers: [
      { id: 'salesforce', text: 'Salesforce / HubSpot', score: 0, icon: Briefcase, recommendations: [
        { id: 'odoo', name: 'Odoo', reason: 'Belgian open-source suite of business apps covering CRM, eCommerce, accounting, and more.', pros: ['All-in-one platform', 'Open-source core', 'EU company'], cons: ['Customization can be expensive'], recommendedAnswerId: 'odoo' },
        { id: 'brevo', name: 'Brevo (formerly Sendinblue)', reason: 'French CRM and marketing platform with strong GDPR compliance.', pros: ['Great email marketing', 'Strict GDPR adherence', 'Cost-effective'], cons: ['Less enterprise customization than Salesforce'], recommendedAnswerId: 'odoo' }
      ]},
      { id: 'dynamics', text: 'Dynamics 365', score: 0, icon: Briefcase, recommendations: [
        { id: 'odoo', name: 'Odoo', reason: 'Belgian open-source suite of business apps.', pros: ['All-in-one platform', 'Open-source core'], cons: ['Customization can be expensive'], recommendedAnswerId: 'odoo' }
      ]},
      { id: 'odoo', text: 'Odoo (EU)', score: 4, icon: Shield },
      { id: 'custom', text: 'Custom / Local', score: 4, icon: Server },
      { id: 'other', text: 'Other', score: 2, icon: HelpCircle },
    ]
  },
  {
    id: 'q_gdpr',
    title: 'Security & Compliance (GDPR)?',
    categories: ['SOV-2', 'SOV-7'],
    multiSelect: false,
    answers: [
      { id: 'full', text: 'Fully compliant, data stays in EU', score: 4, icon: Shield },
      { id: 'scc', text: 'Compliant, but rely on SCCs for US transfers', score: 2, icon: FileText, recommendations: [
        { id: 'eliminate_transfers', name: 'Eliminate US Data Transfers', reason: 'SCCs (Standard Contractual Clauses) are legally fragile post-Schrems II. Localizing data removes this risk.', pros: ['Bulletproof legal standing', 'Increased customer trust'], cons: ['Requires re-architecting systems'], recommendedAnswerId: 'full' }
      ]},
      { id: 'unsure', text: 'Not fully compliant / Unsure', score: 0, icon: HelpCircle, recommendations: [
        { id: 'gdpr_audit', name: 'Conduct a GDPR Audit', reason: 'Non-compliance risks fines up to 4% of global revenue.', pros: ['Identifies critical risks', 'Establishes a baseline'], cons: ['Requires external legal/consulting fees'], recommendedAnswerId: 'full' }
      ]},
    ]
  },
  {
    id: 'q_hardware',
    title: 'Hardware Supply Chain?',
    categories: ['SOV-5', 'SOV-8'],
    multiSelect: false,
    answers: [
      { id: 'us_asian', text: 'Mostly US/Asian vendors, no sustainability tracking', score: 0, icon: Box, recommendations: [
        { id: 'circular', name: 'Adopt Circular Economy Hardware', reason: 'Reduces e-waste and supply chain dependency on non-EU manufacturing.', pros: ['Lower carbon footprint', 'Often cheaper'], cons: ['Older generation hardware'], recommendedAnswerId: 'eu_vendors' },
        { id: 'fairphone', name: 'Fairphone / EU Vendors', reason: 'Dutch company producing sustainable, repairable smartphones.', pros: ['Highly sustainable', 'Ethical supply chain'], cons: ['Limited product range'], recommendedAnswerId: 'eu_vendors' }
      ]},
      { id: 'mixed', text: 'Mixed, some sustainability tracking', score: 2, icon: HardDrive, recommendations: [
        { id: 'circular', name: 'Adopt Circular Economy Hardware', reason: 'Reduces e-waste and supply chain dependency.', pros: ['Lower carbon footprint'], cons: ['Older generation hardware'], recommendedAnswerId: 'eu_vendors' }
      ]},
      { id: 'eu_vendors', text: 'EU vendors / Refurbished / High sustainability', score: 4, icon: Leaf },
    ]
  },
  {
    id: 'q_oss',
    title: 'Open Source Strategy?',
    categories: ['SOV-1', 'SOV-6'],
    multiSelect: false,
    answers: [
      { id: 'proprietary', text: 'Strictly proprietary software', score: 0, icon: Lock, recommendations: [
        { id: 'oss_policy', name: 'Adopt an Open Source First Policy', reason: 'Open source prevents vendor lock-in and allows code auditing for backdoors.', pros: ['No licensing fees', 'High transparency', 'Community support'], cons: ['Requires internal expertise to manage'], recommendedAnswerId: 'oss_first' }
      ]},
      { id: 'mixed', text: 'Mix of proprietary and open source', score: 2, icon: Code, recommendations: [
        { id: 'oss_policy', name: 'Adopt an Open Source First Policy', reason: 'Open source prevents vendor lock-in and allows code auditing.', pros: ['No licensing fees', 'High transparency'], cons: ['Requires internal expertise'], recommendedAnswerId: 'oss_first' }
      ]},
      { id: 'oss_first', text: 'Open source first policy', score: 4, icon: Globe },
    ]
  },
  {
    id: 'q_lockin',
    title: 'Vendor Lock-in Strategy?',
    categories: ['SOV-1', 'SOV-4'],
    multiSelect: false,
    answers: [
      { id: 'locked', text: 'Highly dependent on single vendor ecosystem', score: 0, icon: Lock, recommendations: [
        { id: 'k8s', name: 'Migrate to Kubernetes & Open Standards', reason: 'Abstracting infrastructure via Kubernetes allows moving workloads between any cloud providers.', pros: ['Ultimate portability', 'Cloud agnostic'], cons: ['High learning curve', 'Operational complexity'], recommendedAnswerId: 'agnostic' }
      ]},
      { id: 'multi', text: 'Multi-cloud but proprietary services', score: 2, icon: Cloud, recommendations: [
        { id: 'k8s', name: 'Migrate to Kubernetes & Open Standards', reason: 'Abstracting infrastructure via Kubernetes allows moving workloads between any cloud providers.', pros: ['Ultimate portability'], cons: ['Operational complexity'], recommendedAnswerId: 'agnostic' }
      ]},
      { id: 'agnostic', text: 'Cloud-agnostic / Kubernetes / Open standards', score: 4, icon: Server },
    ]
  },
  {
    id: 'q_green',
    title: 'Environmental Sustainability (Green IT)?',
    categories: ['SOV-8'],
    multiSelect: false,
    answers: [
      { id: 'none', text: 'No tracking of carbon footprint', score: 0, icon: BarChart, recommendations: [
        { id: 'green_dc', name: 'Move to Green-Certified EU Data Centers', reason: 'EU regulations (like CSRD) increasingly require carbon reporting. Green DCs use 100% renewable energy.', pros: ['Regulatory compliance', 'Brand reputation'], cons: ['Migration effort'], recommendedAnswerId: 'optimize' }
      ]},
      { id: 'track', text: 'Track footprint but no optimization', score: 2, icon: Monitor, recommendations: [
        { id: 'green_dc', name: 'Move to Green-Certified EU Data Centers', reason: 'EU regulations increasingly require carbon reporting.', pros: ['Regulatory compliance'], cons: ['Migration effort'], recommendedAnswerId: 'optimize' }
      ]},
      { id: 'optimize', text: 'Actively optimize and use green-certified providers', score: 4, icon: Leaf },
    ]
  },
  {
    id: 'q_cloud',
    title: 'Which primary cloud provider do you use?',
    categories: ['SOV-2', 'SOV-3', 'SOV-4', 'SOV-5'],
    multiSelect: true,
    answers: [
      { id: 'aws', text: 'AWS', score: 0, recommendations: cloudRecommendations, icon: Cloud },
      { id: 'azure', text: 'Azure', score: 0, recommendations: cloudRecommendations, icon: Cloud },
      { id: 'gcp', text: 'Google Cloud', score: 0, recommendations: cloudRecommendations, icon: Cloud },
      { id: 'eu_cloud', text: 'EU Provider (e.g., OVH, Scaleway)', score: 4, icon: Server },
      { id: 'self_hosted', text: 'Self-hosted (EU)', score: 4, icon: HardDrive },
      { id: 'other', text: 'Other', score: 2, icon: HelpCircle },
    ]
  }
];
