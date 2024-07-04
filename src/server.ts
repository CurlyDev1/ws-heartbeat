/**
 * This server starts a websocket server as well as serving a simple html page on port 3000
 * the web page is accessible at http://localhost:3000/public/index.html
 *
 * Implement hearbeat functionality on the websocket server and display whether it is connected in the div with the id "status"
 */

import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const HEARTBEAT_INTERVAL = 3000; // 3 seconds

interface ExtWebSocket extends WebSocket {
  isAlive?: boolean;
}

const heartbeat = function (this: ExtWebSocket, ...args: any[]) {
  this.isAlive = true;
};

wss.on("connection", (ws: ExtWebSocket) => {
  ws.isAlive = true;

  ws.on("pong", heartbeat);

  ws.on("message", (message: string) => {
    console.log("received: %s", message);
  });

  console.log("Client connected");
});

console.log(join(__dirname, "../public"));

app.use("/public", express.static(join(__dirname, "../public")));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
