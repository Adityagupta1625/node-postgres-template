import Ajv, { type Schema } from 'ajv'
import { type NextFunction, type Request, type Response } from 'express'
import HttpException from './HttpException'

export class BaseValidator {
  private readonly schemaObj: Schema

  constructor (schemaObj: Schema) {
    this.schemaObj = schemaObj
  }

  public async validateInput (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | any> {
    try {
      const ajv = new Ajv()

      const validate = ajv.compile(this.schemaObj)
      const valid = validate(req.body.data)
      if (valid) next()
      else throw new HttpException(400, validate.errors)
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return res.status(e?.errorCode ?? 500).json({ message: e })
    }
  }
}
