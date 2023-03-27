import mongoose from "mongoose";

export const company_schema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 125
    },
    description: {
      type: String,
      minlength: 1,
      maxlength: 500,
    },
    logo: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  });