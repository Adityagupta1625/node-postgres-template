import { Router } from "express";
import swaggerUI from 'swagger-ui-express'
import { swaggerSpec } from "../config";

const apiRouter=Router()

apiRouter.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))


export default apiRouter