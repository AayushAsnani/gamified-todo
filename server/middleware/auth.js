import admin from "firebase-admin";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.uid = decodedToken.uid;
      next();
    })
    .catch((err) => {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    });
}
