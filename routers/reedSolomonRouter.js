import express from 'express';
import { reedSolomonDecode, reedSolomonEncode, reedSolomonEncodeMultiply, reedSolomonEncodeRemainder, reedSolomonError, reedSolomonForney, reedSolomonInstruction, reedSolomonIntro, reedSolomonLocation, reedSolomonLocator, reedSolomonQuadratic, reedSolomonSubtract, reedSolomonSyndrome } from "../server/reedSolomonServer.js";

const router = express.Router();
router.get('/intro', reedSolomonIntro);
router.get('/demo-instruction', reedSolomonInstruction);
router.get('/encode', reedSolomonEncode);
router.get('/encode-multiply', reedSolomonEncodeMultiply);
router.get('/encode-remainder', reedSolomonEncodeRemainder);
router.get('/decode', reedSolomonDecode);
router.get('/syndrome', reedSolomonSyndrome);
router.get('/locator', reedSolomonLocator);
router.get('/quadratic', reedSolomonQuadratic);
router.get('/location', reedSolomonLocation);
router.get('/forney', reedSolomonForney);
router.get('/error', reedSolomonError);
router.get('/subtract', reedSolomonSubtract);

const reedSolomonRouter = express.Router();
reedSolomonRouter.use("/reed-solomon", router);

export default reedSolomonRouter;