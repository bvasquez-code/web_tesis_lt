import { ExerciseResultDto } from "./ExerciseResultDto";

export class ExamSubmissionDto {
    public ExamID: string;
    public StudentID: string;
    public results: ExerciseResultDto[];
  
    constructor(data?: any) {
      this.ExamID    = data?.ExamID    ?? '';
      this.StudentID = data?.StudentID ?? '';
      // Mapeamos cada elemento de results al DTO correspondiente
      this.results   = Array.isArray(data?.results)
        ? data.results.map((r: any) => new ExerciseResultDto(r))
        : [];
    }
  }