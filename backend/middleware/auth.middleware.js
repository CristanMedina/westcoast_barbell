import jwt from "jsonwebtoken";

const JWT_SECRET = "vIZ32LEQgsz9yz8Dfq1Q9CqkQN9QR8FQziVUBUI1a9P2HfziKuePXpGOOgEMG8YvRAiD7d6dK27nwYBuzlPRHSf3hOMu6b4HifOCb56hLSXSEGrgIVflA7X6gwgr90CZUKqQl9wDJe4v7SBZjiuPt7GQFRdIzJQ9J6Iqmyum7ho47uW2VuubWphcyGTjQcfPID4a4s4ZJg4LvLpy8P2j2qyfhL1w849mW3DjduD41NdwVhz2PvbtDQOxuUBvSFK9";

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
