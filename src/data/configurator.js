export const projectTypes = [
  { id: "telegram-bot", label: "Telegram Bot", basePrice: 600, baseDays: 7 },
  { id: "futuristic-website", label: "Futuristic Website", basePrice: 900, baseDays: 10 },
  { id: "fullstack-app", label: "Full-Stack Web App", basePrice: 2200, baseDays: 21 },
  { id: "ai-integration", label: "AI Integration", basePrice: 1200, baseDays: 12 },
];

export const featureOptions = [
  { id: "payment-gateway", label: "Payment Gateway", price: 350, days: 3 },
  { id: "ai-chatbot", label: "AI Chatbot", price: 500, days: 4 },
  { id: "custom-3d", label: "Custom 3D Design", price: 700, days: 5 },
  { id: "admin-dashboard", label: "Admin Dashboard", price: 600, days: 5 },
  { id: "webhooks", label: "Webhooks & Automations", price: 250, days: 2 },
];

export const timelineOptions = [
  { id: "standard", label: "Standard", multiplier: 1, note: "Default delivery speed" },
  { id: "priority", label: "Priority (+30%)", multiplier: 1.3, note: "~30% faster delivery" },
  { id: "rush", label: "Rush (+60%)", multiplier: 1.6, note: "Fastest possible turnaround" },
];
