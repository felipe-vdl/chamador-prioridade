import { appRouter } from "@/server/api/root";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { prisma } from "@/server/db";
import ws from "ws";

const wss = new ws.Server({
  port: process.env.NEXT_PUBLIC_WSS_PORT ? +process.env.NEXT_PUBLIC_WSS_PORT : 3001
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext: () => {
  return { prisma };
}});

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log(`✅ WebSocket Server listening on ws://localhost:${process.env.NEXT_PUBLIC_WSS_PORT ? process.env.NEXT_PUBLIC_WSS_PORT : 3001}`);

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});