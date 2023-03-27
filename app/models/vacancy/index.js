import mongoose from "mongoose";
import { vacancy_schema } from "./schema.js";


vacancy_schema.index({ location: "2dsphere" })
const Vacancy = mongoose.model('Vacancy', vacancy_schema);

export default Vacancy