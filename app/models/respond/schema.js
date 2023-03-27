import mongoose from "mongoose";

export const respond_schema = new mongoose.Schema({
  chat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  vacancy_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Vacancy",
  },
  waiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  employer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  resume_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
  },
  is_called: {
    type: Boolean,
    default: false,
  },
  is_responded: {
    type: Boolean,
    default: false,
  },
  responded_at: Date,
  ask: [
    {
      question: String,
      ask: String,
    },
  ],
});

export const favorites_resumes_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },
  ],
});

export const favorites_vacancies_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vacancy",
    },
  ],
});
