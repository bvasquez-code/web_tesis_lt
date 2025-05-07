import { AuditTableEntity } from 'src/app/enterprise/shared/model/entity/AuditTableEntity';

export class TopicEntity extends AuditTableEntity {
  public TopicID: number = 0;
  public TopicCod: string = "";
  public Name: string = "";
  public Course: string = "";

  constructor() {
    super();
  }
}
