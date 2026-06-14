import {
  subscribeActivity,
  unsubscribeActivity,
} from "./activity-sse.manager.js";

export const activityStreamController = (req, res) => {
  const { organizationId, projectId, taskId } = req.params;

  let scope;

  if (taskId) {
    scope = "TASK";
  } else if (projectId) {
    scope = "PROJECT";
  } else {
    scope = "ORGANIZATION";
  }

  const id = taskId || projectId || organizationId;

  res.setHeader("Content-Type", "text/event-stream");

  res.setHeader("Cache-Control", "no-cache");

  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  // keep connection alive
  const heartbeat = setInterval(() => {
    res.write(":heartbeat\n\n");
  }, 30000);

  subscribeActivity(scope, id, res);

  res.write(
    `event:connected
data:${JSON.stringify({
      status: "connected",
    })}\n\n`
  );

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribeActivity(scope, id, res);
    res.end();
  });
};
