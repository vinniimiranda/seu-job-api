import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Candidate from './Candidate';

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public phone: string;

  @column()
  public mobile: string;

  @column()
  public candidateId: number

  @belongsTo(() => Candidate)
  public candidate: BelongsTo<typeof Candidate>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
