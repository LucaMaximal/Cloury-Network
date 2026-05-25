import { Router, type IRouter } from "express";
import healthRouter from "./health";
import serverRouter from "./server";
import newsRouter from "./news";
import eventsRouter from "./events";
import leaderboardRouter from "./leaderboard";
import playersRouter from "./players";
import authRouter from "./auth";
import profileRouter from "./profile";
import ticketsRouter from "./tickets";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(serverRouter);
router.use(newsRouter);
router.use(eventsRouter);
router.use(leaderboardRouter);
router.use(playersRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(ticketsRouter);
router.use(dashboardRouter);

export default router;
