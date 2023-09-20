import express from 'express';
import { reedSolomonEncode, reedSolomonEncodeMultiply, reedSolomonEncodeRemainder, reedSolomonIntro } from "../server/reedSolomonServer.js";

const router = express.Router();
router.get('/intro', reedSolomonIntro);
router.get('/encode', reedSolomonEncode);
router.get('/encode-multiply', reedSolomonEncodeMultiply);
router.get('/encode-remainder', reedSolomonEncodeRemainder);

const reedSolomonRouter = express.Router();
reedSolomonRouter.use("/reed-solomon", router);

export default reedSolomonRouter;