import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../db/dbModels.js";

export const SignUpController = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (
      username?.length < 3 ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ||
      password?.length < 10 ||
      !["employee", "master", "category"].includes(role)
    ) {
      return res.status(200).json({ msg: "Invalid Data", code: 400 });
    }
    const checkUserExist = await UserModel.findOne({
      where: { email },
    });
    if (checkUserExist) {
      return res.status(200).json({ msg: "User already exist", code: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      email,
      username,
      role,
      hashedPassword,
    };
    await UserModel.create(userData);
    return res.status(200).json({ code: 200, msg: "created successfully" });
  } catch (error) {
    console.error("E_SIGNUP : ", error.message);
    return res.status(200).json({ code: 500, msg: "server error" });
  }
};

export const SignInController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ||
      password?.length < 10
    ) {
      return res.status(200).json({ msg: "Invalid Data", code: 400 });
    }
    const User = await UserModel.findOne({ where: { email } });

    if (!User) {
      return res.status(200).json({ msg: "Create an account", code: 400 });
    }
    const hashedPassword = bcrypt.compare(password, User.hashedPassword);
    if (!hashedPassword) {
      return res.status(200).json({ msg: "Invalid credentials", code: 400 });
    }
    const token = jwt.sign(
      { username: User.username, id: User.id, role: User.role },
      User.hashedPassword
    );
    return res.status(200).json({ code: 200, token, role: User.role });
  } catch (error) {
    console.error("E_SIGNIN : ", error.message);
    return res.status(200).json({ code: 500, msg: "server error" });
  }
};
