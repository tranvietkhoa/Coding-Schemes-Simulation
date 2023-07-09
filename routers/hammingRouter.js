import express from 'express';
import { hammingIntro } from "../server/hammingServer.js";

const router = express.Router();
router.get('/intro', hammingIntro);

const hammingRouter = express.Router();
hammingRouter.use('/hamming', router);

export default hammingRouter;