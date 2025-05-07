import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StudentRegisterDto } from '../../model/dto/StudentRegisterDto';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ValidationHelper } from 'src/app/enterprise/shared/helper/ValidationHelper';
import { StudentService } from '../../service/StudentService';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-createstudent',
  templateUrl: './createstudent.component.html'
})
export class CreatestudentComponent implements OnInit {

  // Si se edita un estudiante se enviará su ID; de lo contrario se entiende que es registro nuevo.
  StudentID: string = "";
  // DTO que contiene la entidad StudentEntity (la cual extiende de AuditTableEntity)
  StudentRegister: StudentRegisterDto = new StudentRegisterDto();
  // Bandera para determinar si el campo StudentID es de solo lectura (en modo edición)
  txtStudentIDReadonly: boolean = true;
  // Helper para validaciones
  validation: ValidationHelper = new ValidationHelper();

  // Referencias a los elementos del formulario
  @ViewChild('txtStudentID') txtStudentID!: ElementRef<HTMLInputElement>;
  @ViewChild('txtFirstName') txtFirstName!: ElementRef<HTMLInputElement>;
  @ViewChild('txtLastName') txtLastName!: ElementRef<HTMLInputElement>;
  @ViewChild('txtBirthDate') txtBirthDate!: ElementRef<HTMLInputElement>;
  @ViewChild('txtEmail') txtEmail!: ElementRef<HTMLInputElement>;
  @ViewChild('txtPhoneNumber') txtPhoneNumber!: ElementRef<HTMLInputElement>;
  @ViewChild('txtAddress') txtAddress!: ElementRef<HTMLInputElement>;
  @ViewChild('txtEnrollmentDate') txtEnrollmentDate!: ElementRef<HTMLInputElement>;
  @ViewChild('txtGradeLevel') txtGradeLevel!: ElementRef<HTMLInputElement>;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    // Se obtiene el StudentID desde la URL (si se envía, se entiende que es edición)
    const urlTree: any = this.router.parseUrl(this.router.url);
    this.StudentID = urlTree.queryParams['StudentID'] ? urlTree.queryParams['StudentID'] : "";
    if (this.StudentID) {
      // Modo edición: carga los datos del estudiante
      this.loadFormData(this.StudentID);
    }
  }

  ngOnInit(): void { }

  /**
   * Carga los datos para el formulario mediante el servicio.
   * Se espera que el endpoint 'findDataForm' retorne un objeto en DataAdditional con Name "student"
   * que contenga el StudentRegisterDto.
   */
  async loadFormData(StudentID: string) {
    const rpt: ResponseWsDto = await this.studentService.FindDataForm(StudentID);
    if (!rpt.ErrorStatus) {
      this.StudentRegister = rpt.DataAdditional.find(e => e.Name === "student")?.Data;
      if (this.StudentRegister && this.StudentRegister.student.StudentID) {
        this.txtStudentIDReadonly = true;
      }
      // Se asignan los valores a los controles del formulario.
      setTimeout(() => { this.populateForm(this.StudentRegister); }, 100);
    }
  }

  /**
   * Asigna los valores del DTO a los campos del formulario.
   * Se utiliza formateo para las fechas (asumiendo formato ISO: yyyy-MM-dd).
   */
  populateForm(StudentRegister: StudentRegisterDto) {
    if (!StudentRegister) { return; }
    this.txtStudentID.nativeElement.value = StudentRegister.student.StudentID;
    this.txtFirstName.nativeElement.value = StudentRegister.student.FirstName;
    this.txtLastName.nativeElement.value = StudentRegister.student.LastName;
    this.txtBirthDate.nativeElement.value = StudentRegister.student.BirthDate
      ? this.formatDate(StudentRegister.student.BirthDate)
      : "";
    this.txtEmail.nativeElement.value = StudentRegister.student.Email || "";
    this.txtPhoneNumber.nativeElement.value = StudentRegister.student.PhoneNumber || "";
    this.txtAddress.nativeElement.value = StudentRegister.student.Address || "";
    this.txtEnrollmentDate.nativeElement.value = this.formatDate(StudentRegister.student.EnrollmentDate);
    this.txtGradeLevel.nativeElement.value = StudentRegister.student.GradeLevel;
  }

  /**
   * Formatea una fecha (Date o string) al formato 'yyyy-MM-dd'
   */
  formatDate(date: Date | string): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  /**
   * Recolecta la información del formulario, la valida y la envía al servicio para guardar o actualizar.
   */
  async save() {
    // Asigna los valores de cada campo al DTO
    this.StudentRegister.student.StudentID = this.txtStudentID.nativeElement.value;
    this.StudentRegister.student.FirstName = this.txtFirstName.nativeElement.value;
    this.StudentRegister.student.LastName = this.txtLastName.nativeElement.value;
    this.StudentRegister.student.BirthDate = this.txtBirthDate.nativeElement.value
      ? new Date(this.txtBirthDate.nativeElement.value)
      : undefined;
    this.StudentRegister.student.Email = this.txtEmail.nativeElement.value;
    this.StudentRegister.student.PhoneNumber = this.txtPhoneNumber.nativeElement.value;
    this.StudentRegister.student.Address = this.txtAddress.nativeElement.value;
    this.StudentRegister.student.EnrollmentDate = new Date(this.txtEnrollmentDate.nativeElement.value);
    this.StudentRegister.student.GradeLevel = this.txtGradeLevel.nativeElement.value;

    // Validación básica de campos obligatorios
    if (!this.validate(this.StudentRegister)) { return; }

    // Llamada al servicio para guardar la información
    const rpt: ResponseWsDto = await this.studentService.Save(this.StudentRegister);
    if (!rpt.ErrorStatus) {
      this.toastrService.success("Operación realizada con éxito.");
      this.router.navigate(['/enterprise/student/page/liststudentcomponent']);
    } else {
      this.toastrService.error(rpt.Message);
    }
  }

  /**
   * Valida los campos obligatorios del formulario.
   */
  validate(StudentRegister: StudentRegisterDto): boolean {
    try {
      // this.validation.validateIsNotEmpty(StudentRegister.student.StudentID, "Debe ingresar el ID del estudiante");
      this.validation.validateIsNotEmpty(StudentRegister.student.FirstName, "Debe ingresar el nombre del estudiante");
      this.validation.validateIsNotEmpty(StudentRegister.student.LastName, "Debe ingresar el apellido del estudiante");
      this.validation.validateIsNotEmpty(StudentRegister.student.EnrollmentDate, "Debe ingresar la fecha de inscripción");
      this.validation.validateIsNotEmpty(StudentRegister.student.GradeLevel, "Debe ingresar el nivel de grado");
      return true;
    } catch (e: any) {
      this.toastrService.error(e.message);
      return false;
    }
  }
}
