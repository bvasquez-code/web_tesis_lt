import { ExamExerciseResultDto } from "./ExamExerciseResultDto";

export class GenerateExercisesResponseDto {
    ExamID: string = "";
    StudentID: string = "";
    results: ExamExerciseResultDto[] = [];
  }