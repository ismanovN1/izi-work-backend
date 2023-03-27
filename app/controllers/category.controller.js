import _ from "lodash";
import {
  validateCategory,
} from "../helpers/validation.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Category } from "../models/index.js";
import config from "config";

const __dirname = path.resolve();

export const get_categories = async (req, res) => {
  let categories = await Category.find();

  if(!categories) return res.status(404).send('Categories not found')
  res.send(categories);
};


export const create_category = async (req, res) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { image } = req.files||{};

    if (!image?.mimetype?.includes("image")) return res.status(400).send('Incorrect icon');

    let file_path = "/icons/" + uuidv4() + image.name;
      image.mv(__dirname + "/public" + file_path);

    const category = new Category({
      ..._.pick(req.body, ["name", "children"]),
      icon: file_path? config.get("host_name") + file_path:'',
    });

    await category.save();

    res.status(201).send(category);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};



export const delete_category = async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);
  if (!category)
    return res.status(404).send('category not found');

  res.send('category deleted');
}