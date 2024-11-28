import jwt from "jsonwebtoken"
const  JWT_SECRET="NfcfKaLkYrOU"
function createAuthToken(data)
{
  const authtoken= jwt.sign(data,JWT_SECRET)
  return authtoken;
}
export{createAuthToken}