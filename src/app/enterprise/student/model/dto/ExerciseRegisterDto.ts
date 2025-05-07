import { ExerciseEntity } from '../entity/ExerciseEntity';

export class ExerciseRegisterDto {
  public exercise: ExerciseEntity;
  public base64Image : string = "";

  constructor(exercise?: ExerciseEntity) {
    this.exercise = exercise ? exercise : new ExerciseEntity();
    this.base64Image = "";
  }
}
