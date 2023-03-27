import _ from "lodash";
import {
  validateVacancy,
  validateVacancyForUpdate,
} from "../helpers/validation.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Vacancy, Company } from "../models/index.js";
import config from "config";
import { checkObjValue } from "../helpers/common.js";

const __dirname = path.resolve();

export const get_my_vacancies = async (req, res) => {
  let vacancies = await Vacancy.find({ owner_id: req.user._id }).select({
    picture: 1,
    salary_from: 1,
    salary_to: 1,
    category_name: 1,
    views: 1,
    status: 1,
    favorite: 1,
    responses: 1,
  });

  if (!vacancies) return res.status(404).send("Vacancy not found");
  res.send(vacancies);
};

export const get_vacancies = async (req, res) => {
  const {
    page = 1,
    size = 20,
    category_id,
    salary_from,
    salary_to,
    salary_period,
    part_time,
    lat,
    lon,
    distance,
  } = req.query;

  const by_distance = lat && lon && distance;

  const query = checkObjValue({
    status: 'ACTIVE',
    salary_from: salary_from ? { $gte: salary_from } : undefined,
    salary_to: salary_to ? { $lte: salary_to } : undefined,
    salary_period,
    category_id,
    shedule: part_time ? "PART_TIME" : undefined,
    location: by_distance
      ? {
          $near: {
            $maxDistance: distance,
            $minDistance: 0,
            $geometry: {
              type: "Point",
              coordinates: [lon, lat],
            },
          },
        }
      : undefined,
  });

  const vacancies = await Vacancy.find(query)
    .limit(size)
    .skip((page - 1) * size)
    .select({
      picture: 1,
      salary_from: 1,
      salary_to: 1,
      category_name: 1,
      descriptions: 1,
      created_at: 1,
      ...checkObjValue({ location: by_distance ? 1 : undefined }),
    });

  const total = by_distance? 0: await Vacancy.countDocuments(query);

  return res.send({
    total,
    page,
    size,
    data: vacancies,
  });
};

export const get_my_vacancy_by_id = async (req, res) => {
  let vacancy = await Vacancy.findById(req.params.id)

  if (!vacancy) return res.status(404).send("Vacancy not found");
  res.send(vacancy);
};

export const get_vacancy_by_id = async (req, res) => {
  let vacancy = await Vacancy.findById(req.params.id).populate('company_id');

  if (!vacancy) return res.status(404).send("Vacancy not found");

  vacancy.views += 1;

  vacancy.save();

  res.send(_.omit(vacancy, ["favorite"]));
};

export const create_vacancy = async (req, res) => {
  try {
    const { error } = validateVacancy(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { image } = req.files || {};

    if (image && !image.mimetype?.includes("image"))
      return res.status(400).send("Incorrect file");

    let file_path;
    if (image) {
      file_path = "/pictures/" + uuidv4() + image.name;
      image.mv(__dirname + "/public" + file_path);
    }

    const company = await Company.findOne({ owner: req.user._id });

    if (!company?._id) {
      return res.status(404).send("Company not found");
    }

    const { lat = 0, lon = 0 } = req.body;

    const location = checkObjValue({
      location:
        lat && lon
          ? {
              type: "Point",
              coordinates: [lon, lat],
            }
          : undefined,
    });

    const vacancy = new Vacancy({
      ...req.body,
      ...location,
      picture: file_path ? config.get("host_name") + file_path : "",
      owner_id: req.user._id,
      company_id: company._id,
    });

    await vacancy.save();

    res.status(201).send(vacancy);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// UPDATE

export const update_vacancy = async (req, res) => {
  const { error } = validateVacancyForUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { image } = req.files;

  if (image && !image.mimetype?.includes("image")) return res.sendStatus(400);

  let file_path;
  if (image) {
    file_path = "/pictures/" + uuidv4() + image.name;
    image.mv(__dirname + "/public" + file_path);
  }

  const { lat = 0, lon = 0 } = req.body;

  const location = checkObjValue({
    location:
      lat && lon
        ? {
            type: "Point",
            coordinates: [lon, lat],
          }
        : undefined,
  });

  const vacancy = await Vacancy.findOneAndUpdate(
    {_id:req.params.id, owner_id: req.user._id},
    checkObjValue({
      ...req.body,
      ...location,
      updated_at: new Date().toISOString(),
      picture: file_path ? config.get("host_name") + file_path : undefined,
    }),
    { new: true }
  );

  if (!vacancy) return res.status(404).send("Vacancy not found");

  res.send("success");
};

// DELETE

export const delete_vacancy_by_id = async (req, res) => {
  const vacancy = await Vacancy.findByIdAndRemove(req.params.id);
  if (!vacancy) return res.status(404).send("Vacancy not found");

  res.send("Vacancy deleted");
};
