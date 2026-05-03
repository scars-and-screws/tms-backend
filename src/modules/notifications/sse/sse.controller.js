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

  // Remove on disconnect
  req.on("close", () => {
    removeClient(userId);
  });
};
