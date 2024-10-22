import { Request, Response } from "express";
import { User } from "../models/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, role, location } = req.body;
    const user = new User({ fullName, email, role, location });
    await user.save();
    res.status(201).json(user);
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};
