import Joi from "joi";

export const validateUserRegistr = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    email: Joi.string().required().email(),
    phone: Joi.string().length(11),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .required()
      .messages({
        "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
        "string.empty": `Password cannot be empty`,
        "any.required": `Password is required`,
      }),
    is_employer: Joi.boolean(),
  });

  return schema.validate(user);
};

export const validateUserAuth = (user) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    is_employer: Joi.boolean(),
  });

  return schema.validate(user);
};

export const validateChangePassword = (user) => {
  const schema = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .required()
      .messages({
        "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
        "string.empty": `Password cannot be empty`,
        "any.required": `Password is required`,
      }),
  });

  return schema.validate(user);
};

export const validateEditUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50),
    email: Joi.string().email(),
    phone: Joi.string().length(11),
  });

  return schema.validate(user);
};

export const validateCompany = (company) => {
  const schema = Joi.object({
    name: Joi.string().max(125).required(),
    description: Joi.string().max(500),
  });

  return schema.validate(company);
};

export const validateCompanyForUpdate = (company) => {
  const schema = Joi.object({
    name: Joi.string().max(125),
    description: Joi.string().max(500),
  });

  return schema.validate(company);
};

export const validateCategory = (company) => {
  const schema = Joi.object({
    name: Joi.string().max(125).required(),
    children: Joi.array().required(),
  });

  return schema.validate(company);
};

export const validateVacancy = (vacancy) => {
  const schema = Joi.object({
    category_id: Joi.string().required(),
    sub_category_id: Joi.string(),
    get_started_right_away: Joi.boolean(),
    salary_to: Joi.number(),
    salary_from: Joi.number(),
    address: Joi.string(),
    lat: Joi.number(),
    lon: Joi.number(),
    category_name: Joi.string().required(),
    descriptions: Joi.string().min(1).max(500).required(),
    requirements: Joi.string().min(1).max(200).required(),
    circumstances: Joi.string().min(1).max(200).required(),
    shedule: Joi.string().valid("FULL_TIME", "PART_TIME"),
    shift_work: Joi.string(),
    salary_period: Joi.string().valid("PER_MONTH", "PER_HOUR", "PER_DAY"),
    questions: Joi.array(),
    status: Joi.string().valid("ACTIVE", "CLOSED", "ARCHIVED"),
  });

  return schema.validate(vacancy);
};

export const validateVacancyForUpdate = (vacancy) => {
  const schema = Joi.object({
    category_id: Joi.string(),
    category_name: Joi.string(),
    sub_category_id: Joi.string(),
    get_started_right_away: Joi.boolean(),
    salary_to: Joi.number(),
    salary_from: Joi.number(),
    address: Joi.string(),
    lat: Joi.number(),
    lon: Joi.number(),
    descriptions: Joi.string().min(1).max(500),
    requirements: Joi.string().min(1).max(200),
    circumstances: Joi.string().min(1).max(200),
    shedule: Joi.string().valid("FULL_TIME", "PART_TIME"),
    shift_work: Joi.string(),
    salary_period: Joi.string().valid("PER_MONTH", "PER_HOUR", "PER_DAY"),
    questions: Joi.array(),
    status: Joi.string().valid("ACTIVE", "CLOSED", "ARCHIVED"),
  });

  return schema.validate(vacancy);
};

export const validateResume = (resume) => {
  const schema = Joi.object({
    category_id: Joi.string().required(),
    name: Joi.string(),
    sub_category_id: Joi.string(),
    salary_to: Joi.number(),
    salary_from: Joi.number(),
    address: Joi.string(),
    lat: Joi.number(),
    lon: Joi.number(),
    category_name: Joi.string().required(),
    about_me: Joi.string().min(1).max(700).required(),
    experience: Joi.string().min(1).max(700).required(),
    salary_period: Joi.string().valid("PER_MONTH", "PER_HOUR", "PER_DAY"),
    status: Joi.string().valid("ACTIVE", "CLOSED", "ARCHIVED"),
  });

  return schema.validate(resume);
};

export const validateResumeForUpdate = (resume) => {
  const schema = Joi.object({
    category_id: Joi.string(),
    category_name: Joi.string(),
    name: Joi.string(),
    sub_category_id: Joi.string(),
    salary_to: Joi.number(),
    salary_from: Joi.number(),
    address: Joi.string(),
    lat: Joi.number(),
    lon: Joi.number(),
    about_me: Joi.string().min(1).max(700),
    experience: Joi.string().min(1).max(700),
    salary_period: Joi.string().valid("PER_MONTH", "PER_HOUR", "PER_DAY"),
    status: Joi.string().valid("ACTIVE", "CLOSED", "ARCHIVED"),
  });

  return schema.validate(resume);
};

export const validateRespond = (resume) => {
  const schema = Joi.object({
    waiter_id: Joi.string(),
    vacancy_id: Joi.string(),
    resume_id: Joi.string(),
    employer_id: Joi.string(),
    respond_id: Joi.string(),
    is_called: Joi.boolean(),
    is_responded: Joi.boolean(),
    ask: Joi.array(),
  });

  return schema.validate(resume);
};

export const validateCreatingMessage = (message) => {
  const schema = Joi.object({
    chat_id: Joi.string().required(),
    message: Joi.string().required()
  });

  return schema.validate(message);
};
