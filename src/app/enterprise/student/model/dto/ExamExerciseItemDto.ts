import { ExamExerciseEntity } from "../entity/ExamExerciseEntity";
import { ExerciseEntity } from "../entity/ExerciseEntity";

export class ExamExerciseItemDto {
  examExercise: ExamExerciseEntity;
  exercise: ExerciseEntity;
  userAnswer: string;

  constructor(examExercise: ExamExerciseEntity, exercise: ExerciseEntity) {
    this.examExercise = examExercise;
    this.exercise = exercise;
    this.userAnswer = "";
  }
}
