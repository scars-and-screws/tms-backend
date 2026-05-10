import { addClient, removeClient } from "./sse.manager.js";

export const notificationStreamController = (req, res) => {
  const userId = req.user.id;

  // Important headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders(); // Send headers immediately

  // Add user to clients map
  addClient(userId, res);

  // Heartbeat to keep connection alive
  const interval = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 30000);

  // Remove on disconnect
  req.on("close", () => {
    clearInterval(interval);
    removeClient(userId, res);
  });
};
