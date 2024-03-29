import express from 'express';
import { hammingDecode, hammingEncode } from "../server/hammingServer.js";

const router = express.Router();
router.get('/encode', hammingEncode);
router.get('/decode', hammingDecode);

const hammingRouter = express.Router();
hammingRouter.use('/hamming', router);

export default hammingRouter;