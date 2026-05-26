import {
  subscribeActivity,
  unsubscribeActivity,
} from "./activity.sse.manager.js";

export const activityStreamController = (req, res) => {
  const { organizationId, projectId, taskId } = req.params;

  const scope =
    organizationId && !projectId
      ? "ORGANIZATION"
      : projectId && !taskId
      ? "PROJECT"
      : "TASK";

  const id = taskId || projectId || organizationId;

  res.setHeader("Content-Type", "text/event-stream");

  res.setHeader("Cache-Control", "no-cache");

  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  subscribeActivity(scope, id, res);

  req.on("close", () => unsubscribeActivity(scope, id, res));
};
