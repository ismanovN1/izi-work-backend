import mongoose, { Types } from "mongoose";


export const question_schema = new mongoose.Schema({
  question: String,
  options: [String]
})


export const vacancy_schema = new mongoose.Schema({
  company_id: {
    type: Types.ObjectId,
    ref: "Company",
    require: true,
  },
  owner_id: {
    type: Types.ObjectId,
    ref: "User",
    require: true,
  },
  category_id: {
    type: Types.ObjectId,
    ref: "Category",
    require: true,
  },
  category_name: {
    type: String,
    require: true,
  },
  descriptions: {
    type: String,
    require: true,
  },
  requirements: {
    type: String,
    require: true,
  },
  circumstances: {
    type: String,
    require: true,
  },
  shedule: {
    type: String,
    enum: ['FULL_TIME', 'PART_TIME'],
    default: 'FULL_TIME'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'CLOSED', 'ARCHIVED'],
    default: 'ACTIVE'
  },
  shift_work: String,
  get_started_right_away: Boolean,
  salary_from: Number,
  salary_to: Number,
  salary_period: {
    type:String,
    enum: ['PER_MONTH' , 'PER_HOUR' , 'PER_DAY']
  },
  sub_category_id: {
    type: Types.ObjectId,
  },
  picture: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  address: String,
  lat: Number,
  lon: Number,
  questions: [question_schema],
  favorite: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  responses: {
    type: Number,
    default: 0,
  },
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
