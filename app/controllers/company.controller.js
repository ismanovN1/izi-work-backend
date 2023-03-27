import _ from "lodash";
import {
  validateCompany,
  validateCompanyForUpdate,
} from "../helpers/validation.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Company } from "../models/index.js";
import config from "config";
import { checkObjValue } from "../helpers/common.js";

const __dirname = path.resolve();

export const get_my_company = async (req, res) => {
  let company = await Company.findOne({ owner: req.user._id });

  res.send(company);
};

export const get_company_by_id = async (req, res) => {
  let company = await Company.findById(req.params.id);
  
  if(!company) return res.status(404).send('Company not found')
  
  res.send(company);
};

export const create_company = async (req, res) => {
  try {
    const { error } = validateCompany(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { image } = req.files||{};

    if (image && !image.mimetype?.includes("image")) return res.status(400).send('Incorrect file');

    let file_path;
    if (image) {
      file_path = "/images/" + uuidv4() + image.name;
      image.mv(__dirname + "/public" + file_path);
    }

    const company = new Company({
      ..._.pick(req.body, ["name", "description"]),
      logo: file_path? config.get("host_name") + file_path:'',
      owner: req.user._id,
    });

    await company.save();

    res.status(201).send(company);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const update_company = async (req, res) => {
  const { error } = validateCompanyForUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { image } = req.files;

  if (image && !image.mimetype?.includes("image")) return res.sendStatus(400);

  let file_path;
  if (image) {
    file_path = "/images/" + uuidv4() + image.name;
    image.mv(__dirname + "/public" + file_path);
  }

  const company = await Company.findByIdAndUpdate(
    req.params.id,
    checkObjValue({
      name: req.body.name,
      description: req.body.description,
      logo: file_path ? config.get("host_name") + file_path : undefined,
    }),
    { new: true }
  );

  if (!company)
    return res.status(404).send("Company not found");

  res.send(company);
};


export const delete_company_by_id = async (req, res) => {
  const company = await Company.findByIdAndRemove(req.params.id);
  if (!company)
    return res.status(404).send('Company not found');

  res.send('Company deleted');
}