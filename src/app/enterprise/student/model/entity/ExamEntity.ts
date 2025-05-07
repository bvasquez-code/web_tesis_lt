import { AuditTableEntity } from 'src/app/enterprise/shared/model/entity/AuditTableEntity';

export class ExamEntity extends AuditTableEntity {
  public ExamID: string = "";
  public ExamName: string = "";
  public Description: string = "";
  public Subject: string = "";
  public DurationMinutes: number = 0;

  constructor() {
    super();
  }
}