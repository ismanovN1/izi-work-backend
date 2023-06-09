import mongoose from "mongoose";

export const message_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  chat_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Chat'
  },
  created_at: { type: Date, default: Date.now },
  message: String,
  unread: {
    type: Boolean,
    default: true
  }
})

export const chat_schema = new mongoose.Schema({
    employer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    created_at: { type: Date, default: Date.now },
    last_message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    unread_count_e: {
      type: Number,
      default: 0,
    },
    unread_count_w: {
      type: Number,
      default: 0,
    },
    waiter_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    vacancy_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vacancy'
    },
    resume_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
  });
