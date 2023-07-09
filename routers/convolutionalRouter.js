import express from 'express';
import { convolutionalIntro } from '../server/convolutionServer.js';

const router = express.Router();
router.get("/intro", convolutionalIntro);

const convolutionalRouter = express.Router();
convolutionalRouter.use("/convolutional", router);

export default convolutionalRouter;