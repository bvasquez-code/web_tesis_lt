export class StudentExamHistoryStatusDto {

  public StudentId!: string;
  public HasHistory!: boolean;
  public TotalExams!: number;
  public LastExamId?: number;
  public LastExamDate?: string;
  public IsMaster!: boolean;

} 