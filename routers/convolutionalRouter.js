import express from 'express';
import { 
    convolutionalEncode,
    convolutionalDecode,
    convolutionalInstruction,
    convolutionalTransmit,
} from '../server/convolutionServer.js';

const router = express.Router();
router.get("/demo-instruction", convolutionalInstruction);
router.get("/transmit", convolutionalTransmit);
router.get("/encode", convolutionalEncode);
router.get("/decode", convolutionalDecode);

const convolutionalRouter = express.Router();
convolutionalRouter.use("/convolutional", router);

export default convolutionalRouter;