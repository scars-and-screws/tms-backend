// Stores connected users
const clients = new Map(); // userId → response

// Add connection
export const addClient = (userId, res) => {
  clients.set(userId, res);
};

// Remove connection
export const removeClient = userId => {
  clients.delete(userId);
};

// Send notification to a specific user
export const sendToUser = (userId, data) => {
  const client = clients.get(userId);

  if (client) {
    client.write(`data: ${JSON.stringify(data)}\n\n`); // Send data as SSE format
  }
};
