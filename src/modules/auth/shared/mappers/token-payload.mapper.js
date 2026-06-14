const buildTokenPayload = user => ({
  id: user.id,
  username: user.username,
});

export default buildTokenPayload;
