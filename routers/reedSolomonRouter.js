import express from 'express';
import { reedSolomonDecode, reedSolomonEncode } from "../server/reedSolomonServer.js";

const router = express.Router();
router.get('/encode', reedSolomonEncode);
router.get('/decode', reedSolomonDecode);

const reedSolomonRouter = express.Router();
reedSolomonRouter.use("/reed-solomon", router);

export default reedSolomonRouter;