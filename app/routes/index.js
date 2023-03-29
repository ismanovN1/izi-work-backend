import Router from "express";
import auth_router from "./auth.route.js";
import category_router from "./category.route.js";
import company_router from "./company.route.js";
import vacancy_router from "./vacancy.route.js";
import resume_router from "./resume.route.js";
import respond_router from "./respond.route.js";
import chat_router from "./chat.route.js";

const router = new Router();

router.use("/auth", auth_router);
router.use("/companies", company_router);
router.use("/categories", category_router);
router.use("/vacancies", vacancy_router);
router.use("/resumes", resume_router);
router.use("/action", respond_router);
router.use("/chat", chat_router);

export default router;
