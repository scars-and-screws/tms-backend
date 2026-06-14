const getRequestMeta = req => {
  return {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"] || "unknown",
    deviceId: req.cookies.deviceId || null,
  };
};

export default getRequestMeta;
