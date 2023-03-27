import { Schema } from "mongoose";

const childSchema = new Schema({ name: String });

export const category_schema = new Schema({
  name: String,
  icon: String,
  children: [childSchema],
});
