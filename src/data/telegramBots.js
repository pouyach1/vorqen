export const botCategories = ["Crypto", "AI", "Utility", "Trading"];

export const telegramBots = [
  {
    id: "dex-trading",
    name: "DEX Trading Bot",
    badge: "AUTOMATED TRADING",
    handle: "t.me/dex_trading_bot",
    status: "online",
    category: "Trading",
    avatarGlow: "cyan",
    tags: ["Python", "Aiogram", "Web3.py", "Redis"],
    features: ["Wallet Connect", "Smart Order Routing", "Auto Rebalancing"],
    description:
      "ربات خرید و فروش خودکار در صرافی‌های غیرمتمرکز با اتصال به والِت و الگوریتم‌های هوشمند.",
    metrics: { activeUsers: "18.4K", avgResponse: "85ms", uptime: "99.9%" },
    commands: [
      { cmd: "/start", reply: "به DEX Trading Bot خوش آمدید ⚡ والت شما متصل است. از /menu استفاده کنید." },
      { cmd: "/menu", reply: "📊 1. پرتفوی\n📈 2. سیگنال‌های زنده\n💸 3. تنظیمات معاملات خودکار" },
      { cmd: "/analytics", reply: "BTC: +2.4% (24h)\nETH: +1.1% (24h)\nارزش پرتفوی: $12,480" },
      { cmd: "/buy", reply: "تایید: خرید 0.05 BTC با قیمت بازار؟ [✅ تایید] [❌ لغو]" },
    ],
    codeSnippet: `@dp.message_handler(commands=["analytics"])
async def analytics(message: types.Message):
    portfolio = await get_portfolio(message.from_user.id)
    await message.answer(format_analytics(portfolio))`,
  },
  {
    id: "neural-assistant",
    name: "Neural Assistant Bot",
    badge: "AI & GPT-4O",
    handle: "t.me/neural_assistant_bot",
    status: "online",
    category: "AI",
    avatarGlow: "purple",
    tags: ["Node.js", "Telegraf", "OpenAI API", "Supabase"],
    features: ["AI Chat Integration", "Image Generation", "Voice Processing"],
    description:
      "دستیار هوش مصنوعی هوشمند متصل به API چت‌جی‌پی‌تی، تولید تصویر و پردازش فایل‌های صوتی.",
    metrics: { activeUsers: "32.1K", avgResponse: "120ms", uptime: "99.8%" },
    commands: [
      { cmd: "/start", reply: "سلام! من دستیار هوشمند شما هستم 🤖 هر سوالی داری بپرس، یا از /menu استفاده کن." },
      { cmd: "/menu", reply: "💬 1. پرسش از هوش مصنوعی\n🖼️ 2. تولید تصویر\n🎙️ 3. حالت پاسخ صوتی" },
      { cmd: "/analytics", reply: "تیکت‌های پاسخ‌داده‌شده امروز: 214\nمیانگین رضایت: 4.8/5" },
    ],
    codeSnippet: `bot.on("text", async (ctx) => {
  const reply = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: ctx.message.text }],
  });
  ctx.reply(reply.choices[0].message.content);
});`,
  },
  {
    id: "vip-membership",
    name: "VIP Channel Manager",
    badge: "PAYMENT GATEWAY",
    handle: "t.me/vip_channel_manager_bot",
    status: "online",
    category: "Utility",
    avatarGlow: "emerald",
    tags: ["Python", "FastAPI", "TRON API", "PostgreSQL"],
    features: ["Crypto Payment Gateway", "Auto Subscription Renewal", "Access Control"],
    description:
      "ربات مدیریت خودکار اشتراک کانال‌های VIP با قابلیت اتصال به درگاه‌های پرداخت ارز دیجیتال و کریپتو.",
    metrics: { activeUsers: "9.2K", avgResponse: "95ms", uptime: "99.9%" },
    commands: [
      { cmd: "/start", reply: "به مدیر کانال VIP خوش آمدید 💳 از /menu برای مشاهده پلن‌ها استفاده کنید." },
      { cmd: "/menu", reply: "🛒 1. مشاهده پلن‌ها\n🧾 2. اشتراک‌های من\n🔁 3. مدیریت تمدید خودکار" },
      { cmd: "/buy", reply: "فاکتور #4821 صادر شد — 29 USDT/ماه. [💳 پرداخت]" },
    ],
    codeSnippet: `@app.post("/webhook/tron")
async def tron_payment_webhook(payload: PaymentPayload):
    if await verify_transaction(payload.tx_hash):
        await grant_channel_access(payload.user_id)`,
  },
];
