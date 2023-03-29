import _ from "lodash";
import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import {
  validateChangePassword,
  validateEditUser,
  validateUserAuth,
  validateUserRegistr,
} from "../helpers/validation.js";
import { checkObjValue } from "../helpers/common.js";
import { transporter } from "../../index.js";

export const registration = async (req, res) => {
  const { error } = validateUserRegistr(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with this email already exists");

  user = new User(
    _.pick(req.body, ["name", "email", "password", "phone", "is_employer"])
  );
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  const token = user.generateAuthToken();

  const mailOptions = {
    from: "ismanov98q@gmail.com",
    to: user.email,
    subject: "Bы зарегистрировались на сайте",
    text: `https://iziwork.kz/`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    console.log(err);
    console.log(info);
  });

  return res.send({
    ..._.pick(user, ["_id", "name", "email", "phone"]),
    token,
  });
};

export const authorization = async (req, res) => {
  const { error } = validateUserAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password is incorrect");

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword)
    return res.status(400).send("Email or password is incorrect");

  const token = user.generateAuthToken();
  return res.send({
    ..._.pick(user, ["_id", "name", "email", "phone"]),
    token,
  });
};

export const edit_user_data = async (req, res) => {
  const { error } = validateEditUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findByIdAndUpdate(
    req.user._id,
    checkObjValue(req.body),
    { new: true }
  );

  if (!user) return res.status(404).send("User not found");

  return res.send({
    ..._.pick(user, ["_id", "name", "email", "phone"]),
  });
};

export const change_user_password = async (req, res) => {
  const { error } = validateChangePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("User not found");

  const isValidPassword = await bcrypt.compare(
    req.body.old_password,
    user.password
  );
  if (!isValidPassword) return res.status(400).send("Password is incorrect");

  user.password = req.body.new_password;

  await user.save();

  const token = user.generateAuthToken();
  return res.send({
    token,
  });
};
