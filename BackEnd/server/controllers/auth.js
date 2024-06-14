import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // The purpose is to securely hash the password with a unique salt to protect it from being easily cracked.

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        firstName,
        lastName,
        email,
        password:passwordHash,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile:Math.floor(Math.random()*10000),
        impressions:Math.floor(Math.random()*10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({error:err.message});
  }
}; 
