// deno-lint-ignore-file

import { Bot, Context, session, SessionFlavor } from "grammy";
import { DetaAdapter } from "deta";

// Define session structure
interface SessionData {
  count: number;
}
type MyContext = Context & SessionFlavor<SessionData>;

// Create the bot and register the session middleware
const bot = new Bot<MyContext>(""); // <-- Put your Bot token here.

bot.use(session({
  initial: () => ({ count: 0 }),
  storage: new DetaAdapter<SessionData>({
    baseName: "session", // <-- Base name - your choice.
    projectKey: "", // <-- Project Key here.
    projectId: "", // <-- Project ID here.
  }),
}));

// Use persistant session data in update handlers
bot.on("message", async (ctx) => {
  ctx.session.count++;
  await ctx.reply(`Message count: ${ctx.session.count}`);
});

bot.command("stats", async (ctx) => {
  await ctx.reply(`Message count: ${ctx.session.count}`);
});

bot.command("reset", async (ctx) => {
  ctx.session.count = 0;
  await ctx.reply("Message count has been reset!");
});

bot.catch((err) => console.error(err));
bot.start();
