// ! ORGANIZATION/PROJECT/TASK SUBCRIPTIONS

const activityClients = new Map();

// subscribe
export const subscribeActivity = (scope, id, res) => {
  const key = `${scope}:${id}`;

  if (!activityClients.has(key)) {
    activityClients.set(
      key,

      new Set()
    );
  }

  activityClients.get(key).add(res);
};

// unsubscribe
export const unsubscribeActivity = (scope, id, res) => {
  const key = `${scope}:${id}`;

  const clients = activityClients.get(key);

  if (!clients) return;

  clients.delete(res);

  if (clients.size === 0) {
    activityClients.delete(key);
  }
};

// publish
export const publishActivity = (scope, id, activity) => {
  const key = `${scope}:${id}`;

  const clients = activityClients.get(key);

  if (!clients) return;

  for (const client of clients) {
    try {
      client.write(`event:activity data:${JSON.stringify(activity)}\n\n`);
    } catch {
      clients.delete(client);
    }
  }
};
