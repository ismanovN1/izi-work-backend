import mongoose from "mongoose";
import { respond_schema, favorites_vacancies_schema, favorites_resumes_schema } from "./schema.js";



export const Respond = mongoose.model('Respond', respond_schema);

export const FavoritesVacancies = mongoose.model('Favorites-Vacancies', favorites_vacancies_schema);
export const FavoritesResumes = mongoose.model('Favorites-Resumes', favorites_resumes_schema);
