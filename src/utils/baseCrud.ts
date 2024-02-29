import { AppDataSource } from '../config'
import HttpException from './HttpException'
import {
  EntityTarget,
  InsertResult,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm'

export interface CRUDBaseInterface<T extends ObjectLiteral> {
  add(data: Partial<T>): Promise<InsertResult>
  getAll(query?: any): Promise<T[]>
  get(query: any): Promise<T|null>
  update(id: string, data: Partial<T>): Promise<UpdateResult>
  delete(id: string): Promise<void>
}

export abstract class CRUDBase<T extends ObjectLiteral> implements CRUDBaseInterface<T>
{
  private readonly baseModel: Repository<T>

  constructor(entity: EntityTarget<T>) {
    this.baseModel = AppDataSource.getRepository(entity)
  }

  public async add(data: Partial<T>): Promise<InsertResult> {
    try {
      const resp = await this.baseModel.insert(data)
      return resp
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  public async getAll(query: any): Promise<T[]> {
    try {
      if (Object.keys(query).length===0) {
        const data = await this.baseModel.find()
        return data
      } else {
        const data = await this.baseModel.findBy(query)
        return data
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  public async get(query: any): Promise<T | null> {
    try {
      if (Object.keys(query).length===0) {
        throw new HttpException(400, 'Missing parameter')
      }

      const data = await this.baseModel.findOne(query)
      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  public async update(id: string, data: Partial<T>): Promise<UpdateResult> {
    try {
      if (typeof id !== 'string') {
        throw new HttpException(400, 'Missing parameter')
      }

      const result = await this.baseModel.update(id, data)
      return result
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      if (typeof id !== 'string') {
        throw new HttpException(400, 'Missing parameter')
      }

      await this.baseModel.delete(id)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
