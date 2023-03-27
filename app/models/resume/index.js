import mongoose from "mongoose";
import { resume_schema } from "./schema.js";


resume_schema.index({name: 'text', 'about_me': 'text',location: "2dsphere"});

const Resume = mongoose.model('Resume', resume_schema);

export default Resume