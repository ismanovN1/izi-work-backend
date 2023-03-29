import { checkObjValue } from "../helpers/common.js";
import { Chat, Vacancy, User, Message } from "../models/index.js";
import { find_or_create_respond } from "./respond.controller.js";
import _ from "lodash";
import { validateCreatingMessage } from "../helpers/validation.js";
import { online_users } from "../socket/index.js";
import { io, transporter } from "../../index.js";

export const get_chat = async (req, res) => {
  const { chat_id, resume_id, waiter_id, employer_id, vacancy_id } = req.query;

  if (chat_id) {
    const chat = await Chat.findById(chat_id).populate(
      "vacancy_id",
      "_id picture category_name salary_from salary_to"
    );
    if (!chat) return res.status(404).send("Chat not found");
    return res.send(chat);
  }

  const query = checkObjValue({
    resume_id,
    waiter_id,
    employer_id,
    vacancy_id,
  });

  let chat = await Chat.findOne(query).populate(
    "vacancy_id",
    "_id picture category_name salary_from salary_to"
  );

  if (chat) return res.send(chat);

  if (!(resume_id && waiter_id && employer_id && vacancy_id))
    return res.status(400).send("Bad request");

  chat = new Chat(query);
  await chat.save();
  const respond = await find_or_create_respond(query);
  respond.chat_id = chat._id;
  respond.save();
  const vacancy = await Vacancy.findById(vacancy_id).select({
    _id: 1,
    picture: 1,
    category_name: 1,
    salary_from: 1,
    salary_to: 1,
  });
  res.send({ ..._.pick(chat, ["vacancy_id"]), vacancy_id: vacancy });
};

export const get_messages = async (req, res) => {
  const { chat_id } = req.query;
  if (!chat_id) return res.status(400).send("chat_id is required");

  const messages = await Message.find({ chat_id });

  messages.forEach(async (message) => {
    if (message.unread && message.user_id !== req.user._id) {
      Message.findByIdAndUpdate(message._id, { unread: false });
    }
  });

  res.send(messages);
};

export const get_my_chats = async (req, res) => {
  const chats = await Chat.find({
    [req.user.is_employer ? "employer_id" : "waiter_id"]: req.user._id,
  });

  res.send(chats);
};

export const create_message = async (req, res) => {
  const { to_whom, ...body } = req.body;
  const { error } = validateCreatingMessage(body);
  if (error) return res.status(400).send(error.details[0].message);

  const message = new Message({
    ...body,
    user_id: req.user._id,
  });
  message.save();

  console.log(online_users);

  if (to_whom && online_users.includes(to_whom)) {
    io.to(to_whom).emit("message:created", message);
  } else if (to_whom) {
    const user = await User.findById(to_whom);
    if (user) {
      const mailOptions = {
        from: "ismanov98q@gmail.com",
        to: user.email,
        subject: "У вас новое сообщение",
        text: `${body.message}
         https://iziwork.kz/`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        console.log(err);
        console.log(info);
      });
    }
  }

  res.send(message);
};