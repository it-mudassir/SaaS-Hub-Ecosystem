export type ProductStatus = 'Live' | 'Beta' | 'Coming soon';

export type Product = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  longDescription: string;
  url: string;
  category: string;
  tags: string[];
  status: ProductStatus;
  featured: boolean;
  isNew: boolean;
  launchDate: string;
  features: string[];
  screenshots: string[];
  accentColor: string;
  displayOrder: number;
};

export const products: Product[] = [
  {
    id: 'relay',
    name: 'Relay',
    slug: 'relay',
    logo: 'R',
    description: 'A calmer command center for everything your team is shipping.',
    longDescription: 'Relay turns scattered work into a shared operating picture. Bring projects, decisions, and the next important action into one quietly powerful workspace.',
    url: 'https://relay.saas-hub.example',
    category: 'Operations',
    tags: ['Projects', 'Teams', 'Planning'],
    status: 'Live',
    featured: true,
    isNew: false,
    launchDate: '2024-02-18',
    features: ['Weekly operating views', 'Decision log', 'Project health signals'],
    screenshots: ['Command view', 'Decision log', 'Team pulse'],
    accentColor: '#147d7b',
    displayOrder: 1,
  },
  {
    id: 'cove',
    name: 'Cove',
    slug: 'cove',
    logo: 'C',
    description: 'Turn a messy idea into a clear, compelling brief in minutes.',
    longDescription: 'Cove is the thinking canvas for founders and creative teams. Collect fragments, find the through-line, and leave with a brief people can actually use.',
    url: 'https://cove.saas-hub.example',
    category: 'Creative',
    tags: ['Writing', 'Strategy', 'Ideas'],
    status: 'Live',
    featured: true,
    isNew: true,
    launchDate: '2024-10-02',
    features: ['Reference boards', 'Brief builder', 'Shareable workspaces'],
    screenshots: ['Idea canvas', 'Brief builder'],
    accentColor: '#e67d57',
    displayOrder: 2,
  },
  {
    id: 'ledger',
    name: 'Ledger',
    slug: 'ledger',
    logo: 'L',
    description: 'The lightweight finance cockpit for independent teams.',
    longDescription: 'Ledger gives you a living view of cash, commitments, and runway without turning your week into a spreadsheet maintenance job.',
    url: 'https://ledger.saas-hub.example',
    category: 'Finance',
    tags: ['Runway', 'Cash flow', 'Reports'],
    status: 'Beta',
    featured: true,
    isNew: false,
    launchDate: '2024-08-26',
    features: ['Cash snapshots', 'Scenario planning', 'Monthly close checklist'],
    screenshots: ['Runway view', 'Scenario planner'],
    accentColor: '#c39a45',
    displayOrder: 3,
  },
  {
    id: 'signal',
    name: 'Signal',
    slug: 'signal',
    logo: 'S',
    description: 'Know what your customers mean, not just what they clicked.',
    longDescription: 'Signal brings feedback, call notes, and support threads together so product decisions start with the words your customers actually use.',
    url: 'https://signal.saas-hub.example',
    category: 'Insights',
    tags: ['Feedback', 'Research', 'Product'],
    status: 'Live',
    featured: false,
    isNew: true,
    launchDate: '2024-09-14',
    features: ['Feedback inbox', 'Theme clustering', 'Evidence links'],
    screenshots: ['Feedback stream', 'Theme map'],
    accentColor: '#8c62b8',
    displayOrder: 4,
  },
  {
    id: 'loop',
    name: 'Loop',
    slug: 'loop',
    logo: 'L',
    description: 'A small, focused CRM for relationships that matter.',
    longDescription: 'Loop helps you remember the right thing at the right moment. It is a warm, human follow-up system for people who refuse to become pipeline robots.',
    url: 'https://loop.saas-hub.example',
    category: 'Growth',
    tags: ['CRM', 'Relationships', 'Follow-up'],
    status: 'Live',
    featured: false,
    isNew: false,
    launchDate: '2024-05-06',
    features: ['Relationship map', 'Gentle reminders', 'Conversation notes'],
    screenshots: ['People map', 'Follow-up queue'],
    accentColor: '#cb6576',
    displayOrder: 5,
  },
  {
    id: 'atlas',
    name: 'Atlas',
    slug: 'atlas',
    logo: 'A',
    description: 'A visual home for your team’s most useful knowledge.',
    longDescription: 'Atlas makes the things your team knows easy to find, easy to trust, and easy to keep alive. Build a knowledge base that feels like a place, not a filing cabinet.',
    url: 'https://atlas.saas-hub.example',
    category: 'Knowledge',
    tags: ['Docs', 'Wiki', 'Onboarding'],
    status: 'Coming soon',
    featured: false,
    isNew: true,
    launchDate: '2025-01-20',
    features: ['Living collections', 'Smart onboarding paths', 'Source trails'],
    screenshots: ['Knowledge map', 'Collection view'],
    accentColor: '#4777a9',
    displayOrder: 6,
  },
  {
    id: 'tempo',
    name: 'Tempo',
    slug: 'tempo',
    logo: 'T',
    description: 'Make room for deep work, without losing the plot.',
    longDescription: 'Tempo is a planning ritual for ambitious people with too many tabs open. Shape a realistic day, protect focus, and close the loop with yourself.',
    url: 'https://tempo.saas-hub.example',
    category: 'Personal',
    tags: ['Focus', 'Time', 'Habits'],
    status: 'Coming soon',
    featured: false,
    isNew: false,
    launchDate: '2025-02-03',
    features: ['Energy-aware planning', 'Focus sessions', 'Daily rewind'],
    screenshots: ['Day plan', 'Weekly rhythm'],
    accentColor: '#367d68',
    displayOrder: 7,
  },
];

export const categories = ['All', ...Array.from(new Set(products.map((product) => product.category)))];
export const statuses: Array<'All' | ProductStatus> = ['All', 'Live', 'Beta', 'Coming soon'];