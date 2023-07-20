import express from 'express';
import { 
    convolutionalIntro,
    convolutionalEncode,
} from '../server/convolutionServer.js';

const router = express.Router();
router.get("/intro", convolutionalIntro);
router.get("/encode", convolutionalEncode);

const convolutionalRouter = express.Router();
convolutionalRouter.use("/convolutional", router);

export default convolutionalRouter;