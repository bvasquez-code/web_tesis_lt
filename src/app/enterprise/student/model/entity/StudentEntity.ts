
import { AuditTableEntity } from 'src/app/enterprise/shared/model/entity/AuditTableEntity';

export class StudentEntity extends AuditTableEntity {
  public StudentID: string = "";
  public FirstName: string = "";
  public LastName: string = "";
  public BirthDate?: Date;         // Opcional, ya que en la DB puede ser NULL
  public Email?: string;           // Opcional
  public PhoneNumber?: string;     // Opcional
  public Address?: string;         // Opcional
  public EnrollmentDate: Date = new Date();
  public GradeLevel: string = "";
  public RegistrationUrl: string = ""; // URL para el registro del estudiante
  public HasAccount: string = "N"; // "Y" o "N"

  constructor() {
    super();
  }
}