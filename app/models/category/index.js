import jwt from "jsonwebtoken";
import config from "config";
import mongoose from "mongoose";
import { category_schema } from "./schema.js";



const Category = mongoose.model('Category', category_schema);

export default Category