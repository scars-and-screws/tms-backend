const buildAuthResponse = (user, accessToken) => ({
  user: {
    id: user.id,
    email: user.email,
    username: user.username,
  },
  accessToken,
});

export default buildAuthResponse;
