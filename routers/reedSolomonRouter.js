import express from 'express';
import { reedSolomonIntro } from "../server/reedSolomonServer.js";

const router = express.Router();
router.get('/intro', reedSolomonIntro);

const reedSolomonRouter = express.Router();
reedSolomonRouter.use("/reed-solomon", router);

export default reedSolomonRouter;