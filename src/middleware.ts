import { NextFunction } from "express";

const jwt = require("jsonwebtoken");

const middleware = (req: any, res: any, next: NextFunction) => {
  const authHeader: string = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send({ error: "Authorization header missing" });
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).send({ error: "Malformed authorization header" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err: Error, decoded: any) => {
    if (err) {
      return res.status(403).send({ error: err.message });
    }
    req.user = decoded;
    next();
  });
};

export default middleware;
