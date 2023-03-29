import jwt from "jsonwebtoken";
import config from "config";
import mongoose from "mongoose";
import { user_schema } from "./schema.js";

user_schema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, is_employer: this.is_employer }, config.get('jwt_private_key'));
    return token;
  }

const User = mongoose.model('User', user_schema);

export default User