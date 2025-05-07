import { AuditTableEntity } from 'src/app/enterprise/shared/model/entity/AuditTableEntity';

export class ExerciseEntity extends AuditTableEntity {
  public ExerciseID: number = 0;        // Identificador autoincremental
  public ExerciseCod: string = "";      // Código único del ejercicio
  public TopicID: number = 0;           // Referencia al tema al que pertenece el ejercicio
  public Level: number = 0;             // Nivel de dificultad del ejercicio
  public ImagePath: string = "";        // Ruta de la imagen asociada al ejercicio
  public CorrectAnswer: string = "";    // Respuesta correcta para el ejercicio

  constructor() {
    super();
  }
}
