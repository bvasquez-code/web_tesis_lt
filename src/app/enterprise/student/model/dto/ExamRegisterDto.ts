import { ExamEntity } from '../entity/ExamEntity';
import { ExamExerciseEntity } from '../entity/ExamExerciseEntity';

export class ExamRegisterDto {
  public exam: ExamEntity;
  public examExercises: ExamExerciseEntity[];

  constructor(exam?: ExamEntity) {
    this.exam = exam ? exam : new ExamEntity();
    this.examExercises = [];
  }
}