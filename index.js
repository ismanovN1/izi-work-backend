import express from "express";
import mongoose from "mongoose";
import config from "config";
import helmet from "helmet";
import router from "./app/routes/index.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import fs from "fs";
import nodemailer from "nodemailer";
import { Server } from "socket.io";
import { createServer } from "https";
import { createServer as createDevServer } from "http";
import { onConnection } from "./app/socket/index.js";

const PORT = process.env.PORT || 5000;

if (!config.get("jwt_private_key")) {
  console.error(
    "FATAL ERROR: environment variable jwt_private_key is not defined."
  );
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(fileUpload({ parseNested: true }));
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.static("public"));
app.use("/api", router);

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ismanov98q@gmail.com",
    pass: "kjmtarvqhieftpgv",
  },
});


// const server =  createServer({
//   key: fs.readFileSync('/etc/letsencrypt/live/api.iziwork.kz/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/api.iziwork.kz/cert.pem'),
// },app);

const server =  createDevServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

io.on("connection", (socket) => {
  onConnection(io, socket);
});

async function startApp() {
  try {
    await mongoose.connect(config.get("db_url"), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    server.listen(PORT, () => {
      console.log("SERVER STARTED ON PORT " + PORT);
    });

  } catch (e) {
    console.log(e);
  }
}

startApp();
