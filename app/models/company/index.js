import jwt from "jsonwebtoken";
import config from "config";
import mongoose from "mongoose";
import { company_schema } from "./schema.js";



const Company = mongoose.model('Company', company_schema);

export default Company