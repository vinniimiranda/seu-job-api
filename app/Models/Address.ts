import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Candidate from './Candidate'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public candidateId: number

  @column()
  public cep: string;

  @column()
  public street: string;

  @column()
  public number: string;

  @column()
  public neighborhood: string;

  @column()
  public city: string;

  @column()
  public state: string;

  @belongsTo(() => Candidate)
  public candidate: BelongsTo<typeof Candidate>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
