import express from 'express';
import { hammingDecode, hammingEncode, hammingInstruction, hammingIntro } from "../server/hammingServer.js";

const router = express.Router();
router.get('/intro', hammingIntro);
router.get('/encode', hammingEncode);
router.get('/decode', hammingDecode);
router.get('/demo-instruction', hammingInstruction);

const hammingRouter = express.Router();
hammingRouter.use('/hamming', router);

export default hammingRouter;