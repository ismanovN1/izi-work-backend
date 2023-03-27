import _ from "lodash";
import {
  validateCompany,
  validateCompanyForUpdate,
  validateRespond,
} from "../helpers/validation.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  Respond,
  Chat,
  Vacancy,
  Resume,
  FavoritesResumes,
  FavoritesVacancies,
} from "../models/index.js";
import config from "config";
import { checkObjValue } from "../helpers/common.js";

const __dirname = path.resolve();

const find_or_create_respond = async ({
  waiter_id,
  vacancy_id,
  resume_id,
  employer_id,
  respond_id,
}) => {
  if (respond_id) {
    let respond = await Respond.findById(respond_id);
    if (respond) return respond;
  }

  let respond = await Respond.findOne({ waiter_id, vacancy_id });

  if (respond) return respond;

  respond = new Respond({
    waiter_id,
    employer_id,
    resume_id,
    vacancy_id,
  });
  await respond.save();
  return respond;
};

export const respond = async (req, res) => {
  const { error } = validateRespond(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    waiter_id,
    vacancy_id,
    resume_id,
    employer_id,
    respond_id,
    is_called,
    is_responded,
    ask,
  } = req.body;

  if (!(vacancy_id || respond_id)) return res.status(400).send("Bad request");

  let respond = await find_or_create_respond({
    waiter_id,
    vacancy_id,
    resume_id,
    employer_id,
    respond_id,
  });

  if (!respond) return res.status(400).send("Bad request");

  if (is_called) respond.is_called = is_called;
  if (ask) respond.ask = ask;
  if (is_responded && !respond.is_responded) {
    respond.is_responded = is_responded;
    respond.responded_at = new Date().toISOString();
    (async () => {
      const vacancy = await Vacancy.findById(respond.vacancy_id);
      if (vacancy) {
        vacancy.responses += 1;
        vacancy.save();
      }
    })();
  }

  await respond.save();

  return res.send(respond);
};

export const get_respond = async (req, res) => {
  const { waiter_id, vacancy_id, resume_id, employer_id, respond_id } =
    req.query;

  if (!((vacancy_id && waiter_id) || respond_id))
    return res.status(400).send("Bad request");

  let respond = await find_or_create_respond({
    waiter_id,
    vacancy_id,
    resume_id,
    employer_id,
    respond_id,
  });

  if (!respond) return res.status(404).send("Respond not found");

  return res.send(respond);
};

export const get_my_responded_vacancies = async (req, res) => {
  let respond = await Respond.find({
    waiter_id: req.user._id,
    $or: [
      { 'is_responded': true },
      { 'is_called': true },
      { 'caht_id': {$exists:true} }
    ]
  }).populate(
    "vacancy_id",
    "picture salary_from salary_to category_name descriptions created_at"
  );

  if (!respond) return res.status(404).send("Respond not found");

  return res.send(respond);
};

export const get_responds_by_vacancy_id = async (req, res) => {
  const { vacancy_id } = req.query;
  if (!vacancy_id) return res.status(400).send("vacancy_id is required");

  let responds = await Respond.find({
    vacancy_id,
  })
    .populate("resume_id")
    .populate("waiter_id");

  if (!responds) return res.status(400).send("Bad request");

  return res.send(responds);
};

export const add_remove_my_favorite_resume = async (req, res) => {
  const { resume_id, is_favorite } = req.body;
  if (!resume_id) return res.status(400).send("resume_id is required");

  let favorites_resumes = await FavoritesResumes.findOneAndUpdate(
    { user_id: req.user._id },
    { [is_favorite ? "$push" : "$pull"]: { favorites: resume_id } },
    { new: true }
  );
  if (!favorites_resumes) {
    favorites_resumes = new FavoritesResumes({
      user_id: req.user._id,
      favorites: is_favorite ? [resume_id] : [],
    });

    await favorites_resumes.save();
  }
  console.log(favorites_resumes);

  return res.send(favorites_resumes.favorites);
};

export const get_my_favorite_resumes_ids = async (req, res) => {
  let favorites_resumes = await FavoritesResumes.findOne({
    user_id: req.user._id,
  });

  if (!favorites_resumes) {
    favorites_resumes = new FavoritesResumes({
      user_id: req.user._id,
      favorites: [],
    });

    await favorites_resumes.save();
  }

  return res.send(favorites_resumes.favorites);
};

export const get_my_favorite_resumes = async (req, res) => {
  let favorites_resumes = await FavoritesResumes.findOne({
    user_id: req.user._id,
  }).populate(
    "favorites",
    "picture salary_from salary_to category_name descriptions created_at"
  );

  if (!favorites_resumes) {
    favorites_resumes = new FavoritesResumes({
      user_id: req.user._id,
      favorites: [],
    });

    await favorites_resumes.save();
    return res.send([]);
  }

  return res.send(favorites_resumes.favorites);
};

export const add_remove_my_favorite_vacancy = async (req, res) => {
  const { vacancy_id, is_favorite } = req.body;
  if (!vacancy_id) return res.status(400).send("vacancy_id is required");

  let favorites_vacancies = await FavoritesVacancies.findOneAndUpdate(
    { user_id: req.user._id },
    { [is_favorite ? "$push" : "$pull"]: { favorites: vacancy_id } },
    { new: true }
  );
  if (!favorites_vacancies) {
    favorites_vacancies = new FavoritesVacancies({
      user_id: req.user._id,
      favorites: is_favorite ? [vacancy_id] : [],
    });

    await favorites_vacancies.save();
  }

  (async () => {
    const vacancy = await Vacancy.findById(vacancy_id);
    if (vacancy) {
      vacancy.favorite += is_favorite ? 1 : -1;
      if (vacancy.favorite < 0) {
        vacancy.favorite = 0;
      }
      vacancy.save();
    }
  })();

  return res.send(favorites_vacancies.favorites);
};

export const get_my_favorite_vacancies_ids = async (req, res) => {
  let favorites_vacancies = await FavoritesVacancies.findOne({
    user_id: req.user._id,
  });

  if (!favorites_vacancies) {
    favorites_vacancies = new FavoritesVacancies({
      user_id: req.user._id,
      favorites: [],
    });

    await favorites_vacancies.save();
  }

  return res.send(favorites_vacancies.favorites);
};

export const get_my_favorite_vacancies = async (req, res) => {
  let favorites_vacancies = await FavoritesVacancies.findOne({
    user_id: req.user._id,
  }).populate(
    "favorites",
    "picture salary_from salary_to category_name descriptions created_at"
  );

  if (!favorites_vacancies) {
    favorites_vacancies = new FavoritesVacancies({
      user_id: req.user._id,
      favorites: [],
    });

    await favorites_vacancies.save();
    return res.send([]);
  }

  return res.send(favorites_vacancies.favorites);
};
