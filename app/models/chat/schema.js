import mongoose from "mongoose";

const message_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  message: String,
  unread: {
    type: Boolean,
    default: false
  }
})

export const chat_schema = new mongoose.Schema({
    vacancy_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Vacancy'
    },
    resume_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    messages: [message_schema]
  });
