import jwt from "jsonwebtoken"
function createAuthToken(data)
{
  const authtoken= jwt.sign(data,process.env.JWT_SECRET)
  return authtoken;
}
export{createAuthToken}