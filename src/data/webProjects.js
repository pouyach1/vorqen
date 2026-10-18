export const webProjects = [
  {
    id: "cyberverse-landing",
    title: "CyberVerse Landing Page",
    category: "Web3 & NFT Marketplace",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    description: "Immersive landing page for an NFT marketplace with 3D showcase scenes.",
    tags: ["React", "Three.js", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    brief: "A Web3 startup needed a launch page that felt as futuristic as the product itself.",
    challenges: [
      "Rendering NFT 3D previews without hurting first-load performance",
      "Wallet-connect flow that stays intuitive for non-crypto-native visitors",
    ],
    architecture: [
      { layer: "Frontend", detail: "React + Three.js hero scene, Tailwind design system" },
      { layer: "Backend", detail: "Node.js API for collection metadata" },
      { layer: "APIs", detail: "Ethers.js wallet connect, IPFS metadata fetch" },
      { layer: "Animations", detail: "Framer Motion scroll reveals, R3F model rotation" },
    ],
    performance: { performance: 97, accessibility: 99, bestPractices: 100, seo: 95, loadTime: "1.2s" },
  },
  {
    id: "aura-ai-dashboard",
    title: "Aura AI Dashboard",
    category: "SaaS Analytics Platform",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    description: "Analytics dashboard for an AI SaaS product with live usage charts.",
    tags: ["Next.js", "TypeScript", "Recharts"],
    liveUrl: "#",
    githubUrl: "#",
    brief: "Aura needed a dashboard that made complex model usage data easy to scan at a glance.",
    challenges: [
      "Keeping chart re-renders smooth on live-updating datasets",
      "Type-safe API layer shared between dashboard and admin panel",
    ],
    architecture: [
      { layer: "Frontend", detail: "Next.js App Router, TypeScript, Recharts" },
      { layer: "Backend", detail: "tRPC API over a Postgres analytics store" },
      { layer: "APIs", detail: "REST ingestion endpoint, WebSocket for live metrics" },
      { layer: "Animations", detail: "Framer Motion panel transitions" },
    ],
    performance: { performance: 95, accessibility: 100, bestPractices: 100, seo: 98, loadTime: "1.0s" },
  },
  {
    id: "nexus-dex",
    title: "Nexus Decentralized Exchange",
    category: "DeFi Terminal",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop",
    description: "Trading terminal for a decentralized exchange with live order books.",
    tags: ["Ethers.js", "Tailwind", "Framer Motion"],
    liveUrl: "#",
    githubUrl: "#",
    brief: "A DeFi protocol needed a trading terminal that felt as fast as a centralized exchange.",
    challenges: [
      "Streaming order-book updates without UI jank",
      "Gas-efficient transaction batching for swap confirmations",
    ],
    architecture: [
      { layer: "Frontend", detail: "React + Tailwind, Framer Motion for order-book animation" },
      { layer: "Backend", detail: "Indexer service syncing on-chain events" },
      { layer: "APIs", detail: "Ethers.js contract calls, WebSocket price feed" },
      { layer: "Animations", detail: "Spring-based order-book row transitions" },
    ],
    performance: { performance: 93, accessibility: 96, bestPractices: 100, seo: 90, loadTime: "1.4s" },
  },
];
