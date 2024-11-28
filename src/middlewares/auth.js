import jwt from "jsonwebtoken";
const  JWT_SECRET="NfcfKaLkYrOU"

function auth(req, res, next) {
  const authHeader = req.headers?.authorization;

  let authToken;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    authToken = authHeader.split(" ")[1];
  } else {
    const cookie = req.headers.cookie;

    if (!cookie) return res.status(401).send("Unauthorized.");

    authToken = cookie.split("=")[1];
  }

  if (!authToken) return res.status(401).send("Unauthorized.");

  jwt.verify(authToken, JWT_SECRET, function (error, data) {
    if (error) {
      return res.status(401).send(error);
    }

    req.user = data;

    next();
  });
}

export default auth;