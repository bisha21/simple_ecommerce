
import { createAuthToken } from "../helper/authhelper.js";
import authService from "../services/authService.js";

const register = async (req, res) => {
  const data = req.body;
  

  if (!data.name || !data.email || !data.password) {
    return res.status(422).send("Required data are missing.");
  }

  if (data.password !== data.confirmPassword) {
    return res.status(400).send("Passwords do not match.");
  }

  if (data.password.length < 6) {
    return res.status(400).send("Password length must be greater than 6.");
  }

  try {
    const user = await authService.register(data);
 const authToken = createAuthToken(user);
 console.log(authToken)
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const login = async (req, res) => {
  const data = req.body;

  try {
    const user = await authService.login(data);
    const authToken = createAuthToken(user);
    res.cookie("authToken",authToken);

    res.json({...user,authToken});
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getAllUser= async(req,res,)=>
{
  try{
    const user=await authService.getAllUser(req.query)
    res.json(user)
  }
  catch(error){
    res.status(500).send(error.message)
  }
}
const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {


    await authService.deleteUser(id);
    res.send(`User with id ${id} deleted successfully`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const logout = (req, res) => {
  res.clearCookie("authToken");
  res.send("Logged out successfully");
};

export { register, login ,getAllUser,deleteUser,logout};