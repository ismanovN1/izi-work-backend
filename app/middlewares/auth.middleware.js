import config from "config";
import jwt from "jsonwebtoken";

export const auth_middleware = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Auth error" });
    }
    const decoded = jwt.verify(token, config.get("jwt_private_key"));
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Auth error" });
  }
};

export const auth_middleware_employer = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Auth error" });
    }
    const decoded = jwt.verify(token, config.get("jwt_private_key"));
    if (!decoded?.is_employer) {
      return res.status(403).json({ message: "К сожалению, у вас нет прав для доступа к данному ресурсу." });
    }
    req.user = decoded;
    next(); 
  } catch (e) {
    return res.status(401).json({ message: "Auth error" });
  }
};
