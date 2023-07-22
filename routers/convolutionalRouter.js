import express from 'express';
import { 
    convolutionalIntro,
    convolutionalEncode,
    convolutionalDecode
} from '../server/convolutionServer.js';

const router = express.Router();
router.get("/intro", convolutionalIntro);
router.get("/encode", convolutionalEncode);
router.get("/decode", convolutionalDecode)

const convolutionalRouter = express.Router();
convolutionalRouter.use("/convolutional", router);

export default convolutionalRouter;