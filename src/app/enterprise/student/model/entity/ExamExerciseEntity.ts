import { AuditTableEntity } from 'src/app/enterprise/shared/model/entity/AuditTableEntity';

export class ExamExerciseEntity extends AuditTableEntity {
  public ExamID: string = "";
  public ExerciseID: number = 0;
  public TopicID: number = 0;
  public DifficultyLevel: string = "";
  public Points: number = 0;
}
