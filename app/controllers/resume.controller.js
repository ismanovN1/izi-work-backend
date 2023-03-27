import _ from "lodash";
import {
  validateResume,
  validateResumeForUpdate,
} from "../helpers/validation.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Resume } from "../models/index.js";
import config from "config";
import { checkObjValue } from "../helpers/common.js";

const __dirname = path.resolve();

export const get_my_resume = async (req, res) => {
  let resume = await Resume.findOne({ owner_id: req.user._id });

  if (!resume) return res.status(404).send("Resume not found");

  res.send(resume);
};

export const get_resume_by_id = async (req, res) => {
  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) return res.status(404).send("Resume not found");

    res.send(resume);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const get_resumes = async (req, res) => {
  const {
    page = 1,
    size = 20,
    salary_from,
    salary_to,
    salary_period,
    category_id,
    sub_category_id,
    search,
    address,
    lat,
    lon,
    distance,
  } = req.query;

  const by_distance = lat && lon && distance;

  const query = checkObjValue({
    salary_from: salary_from ? { $gte: salary_from } : undefined,
    salary_to: salary_to ? { $lte: salary_to } : undefined,
    salary_period: salary_period || undefined,
    category_id: category_id || undefined,
    sub_category_id: sub_category_id || undefined,
    $text: search ? { $search: search } : undefined,
    address: address ? new RegExp(address, "i") : undefined,
    location: by_distance
      ? search
        ? {
            $geoWithin: {
              $centerSphere: [[lon, lat], distance],
            },
          }
        : {
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

  const resumes = await Resume.find(query)
    .limit(size)
    .skip((page - 1) * size)
    .select({
      picture: 1,
      name: 1,
      salary_from: 1,
      salary_to: 1,
      address: 1,
      category_name: 1,
      descriptions: 1,
      created_at: 1,
      location: 1,
    });

  const total = by_distance ? 0 : await Resume.countDocuments(query);

  return res.send({
    total,
    page: Number(page),
    size: Number(size),
    data: resumes,
  });
};

export const create_resume = async (req, res) => {
  try {
    const { error } = validateResume(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { image } = req.files || {};

    if (image && !image.mimetype?.includes("image"))
      return res.status(400).send("Incorrect file");

    let file_path;
    if (image) {
      file_path = "/pictures/" + uuidv4() + image.name;
      image.mv(__dirname + "/public" + file_path);
    }

    const { lat = 0, lon = 0, ...restBody } = req.body;

    const location = checkObjValue({
      location:
        lat && lon
          ? {
              type: "Point",
              coordinates: [lon, lat],
            }
          : undined,
    });

    const resume = new Resume({
      ...restBody,
      ...location,
      picture: file_path ? config.get("host_name") + file_path : "",
      owner_id: req.user._id,
    });

    await resume.save();

    res.status(201).send(resume);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const update_resume = async (req, res) => {
  const { error } = validateResumeForUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { image } = req.files;

  if (image && !image.mimetype?.includes("image")) return res.sendStatus(400);

  let file_path;
  if (image) {
    file_path = "/pictures/" + uuidv4() + image.name;
    image.mv(__dirname + "/public" + file_path);
  }

  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, owner_id: req.user._id },
    checkObjValue({
      ...req.body,
      updated_at: new Date().toISOString(),
      picture: file_path ? config.get("host_name") + file_path : undefined,
    }),
    { new: true }
  );

  if (!resume) return res.status(404).send("Resume not found");

  await resume.save();

  res.send("success");
};

export const delete_resume_by_id = async (req, res) => {
  const resume = await Resume.findByIdAndRemove(req.params.id);
  if (!resume) return res.status(404).send("Resume not found");

  res.send("Resume deleted");
};
