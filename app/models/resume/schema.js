import mongoose, { Types } from "mongoose";

export const resume_schema = new mongoose.Schema({
  owner_id: {
    type: Types.ObjectId,
    ref: "User",
    require: true,
  },
  name: String,
  category_id: {
    type: Types.ObjectId,
    ref: "Category",
    require: true,
  },
  category_name: {
    type: String,
    require: true,
  },
  sub_category_id: {
    type: Types.ObjectId,
  },
  about_me: {
    type: String,
    require: true,
  },
  experience: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "CLOSED", "ARCHIVED"],
    default: "ACTIVE",
  },
  salary_from: Number,
  salary_to: Number,
  salary_period: {
    type: String,
    enum: ["PER_MONTH", "PER_HOUR", "PER_DAY"],
  },
  picture: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  address: String,
  location: {
    type: {
      type: String, 
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});
