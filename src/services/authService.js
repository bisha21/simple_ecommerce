import { get } from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const register = async (data) => {
    const userExist = await User.findOne({ email: data.email });
    if (userExist) throw new Error("Email already exists");

    // Corrected: bcrypt.hash() should be used to hash the password
    const hashPassword = await bcrypt.hash(data.password, 10);

    const createdUser = await User.create({
        name: data.name,
        email: data.email,
        address: data.address,
        password: hashPassword,
        roles: data.roles
    });

    return {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        roles: createdUser.roles,
    };
}

const login = async (data) => {
    const userExist = await User.findOne({ email: data.email });
    if (!userExist) throw new Error("Email or password doesn't match");

    // Corrected: bcrypt.compare() should be used to compare the password
    const isMatch = await bcrypt.compare(data.password, userExist.password);
    if (!isMatch) throw new Error("Email or password doesn't match");

    return {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        roles: userExist.roles
    };
}
const getAllUser= async(query)=>
{
const limit = query?.limit || 10;
  const sort = query?.sort ? JSON.parse(query.sort) : {};
  const filters = query?.filters ? JSON.parse(query.filters) : {};
  const page = query?.page || 1;
  const offset = (page - 1) * limit;

  const customQuery = Object.entries(filters).reduce((acc, [key, value]) => {
    const result = { ...acc, [key]: new RegExp(value, "i") };

    return result;
  }, {});

  return await User.find(customQuery).limit(limit).sort(sort).skip(offset);
};

const deleteUser= async(id)=>{
    return await User.findByIdAndDelete(id)
}



export default { register, login,getAllUser,deleteUser };
