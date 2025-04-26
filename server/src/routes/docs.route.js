import express from 'express'
import { swaggerSpec, swaggerUi } from '../config/swagger.js';

const router = express.Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router