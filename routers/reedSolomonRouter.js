import express from 'express';
import { reedSolomonDecode, reedSolomonEncode, reedSolomonInstruction, reedSolomonIntro } from "../server/reedSolomonServer.js";

const router = express.Router();
router.get('/intro', reedSolomonIntro);
router.get('/demo-instruction', reedSolomonInstruction);
router.get('/encode', reedSolomonEncode);
router.get('/decode', reedSolomonDecode);

const reedSolomonRouter = express.Router();
reedSolomonRouter.use("/reed-solomon", router);

export default reedSolomonRouter;