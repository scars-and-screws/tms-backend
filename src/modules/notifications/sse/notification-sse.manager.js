// Stores connected users
// userId -> Set(res)
const clients = new Map();

// Add new SSE connection
export const addClient = (userId, res) => {
  // Create set if user doesn't exist
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }

  // Add this connection
  clients.get(userId).add(res);
};

// Remove SSE connection
export const removeClient = (userId, res) => {
  const userConnections = clients.get(userId);

  if (!userConnections) return;

  // Remove this specific connection
  userConnections.delete(res);

  // Cleanup empty sets
  if (userConnections.size === 0) {
    clients.delete(userId);
  }
};

// Send notification to all active connections
export const sendToUser = (userId, data) => {
  const userConnections = clients.get(userId);

  if (!userConnections) return;

  for (const client of userConnections) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
};
