export class StudentExamHistoryEntity {
    public HistoryID: number = 0;          // Identificador único del intento
    public StudentID: string = "";         // Identificador del alumno
    public ExamID: string = "";            // Identificador del examen
    public AttemptNumber: number = 0;      // Número secuencial del intento para el mismo estudiante
    public IsCompleted: number = 0;        // 0: en curso, 1: culminado
    public StartDate: Date = new Date();   // Fecha y hora de inicio del examen
    public FinishDate?: Date;              // Fecha y hora de finalización (opcional)
    public CreationDate: Date = new Date();// Fecha de creación del registro
    public ModifyDate: Date = new Date();  // Fecha de última modificación
    public JsonDataExam: string = ""; // Datos JSON del examen
  
    constructor() {}
  }