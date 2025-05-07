import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Importaciones propias
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ValidationHelper } from 'src/app/enterprise/shared/helper/ValidationHelper';
import { ExamRegisterDto } from '../../model/dto/ExamRegisterDto';
import { ExamService } from '../../service/ExamService';

@Component({
  selector: 'app-createexam',
  templateUrl: './createexam.component.html'
})
export class CreateexamComponent implements OnInit {

  // Si se envía un ExamID en la URL se asume que es edición; de lo contrario, es un registro nuevo.
  ExamID: string = "";
  // DTO que encapsula la entidad ExamEntity (con auditoría incluida)
  ExamRegister: ExamRegisterDto = new ExamRegisterDto();
  // Bandera para definir si el campo ExamID es de solo lectura (modo edición)
  txtExamIDReadonly: boolean = false;
  // Helper de validaciones
  validation: ValidationHelper = new ValidationHelper();

  // Referencias a los controles del formulario
  @ViewChild('txtExamID') txtExamID!: ElementRef<HTMLInputElement>;
  @ViewChild('txtExamName') txtExamName!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDescription') txtDescription!: ElementRef<HTMLInputElement>;
  @ViewChild('txtSubject') txtSubject!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDurationMinutes') txtDurationMinutes!: ElementRef<HTMLInputElement>;

  constructor(
    private examService: ExamService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    // Se obtiene el ExamID desde la URL (por ejemplo, ?ExamID=EX123)
    const urlTree: any = this.router.parseUrl(this.router.url);
    this.ExamID = urlTree.queryParams['ExamID'] ? urlTree.queryParams['ExamID'] : "";
    if (this.ExamID) {
      // Modo edición: se cargan los datos existentes
      this.loadFormData(this.ExamID);
    }
  }

  ngOnInit(): void { }

  /**
   * Carga los datos del examen a través del servicio.
   * Se espera que el endpoint 'findDataForm' retorne en DataAdditional un objeto
   * con Name "exam" que contenga el ExamRegisterDto.
   */
  async loadFormData(ExamID: string) {
    const rpt: ResponseWsDto = await this.examService.FindDataForm(ExamID,"",0);
    if (!rpt.ErrorStatus) {
      this.ExamRegister = rpt.DataAdditional.find(e => e.Name === "exam")?.Data;
      if (this.ExamRegister && this.ExamRegister.exam.ExamID) {
        this.txtExamIDReadonly = true;
      }
      setTimeout(() => { this.populateForm(this.ExamRegister); }, 100);
    }
  }

  /**
   * Asigna los valores del DTO a los campos del formulario.
   */
  populateForm(ExamRegister: ExamRegisterDto) {
    if (!ExamRegister) { return; }
    this.txtExamID.nativeElement.value = ExamRegister.exam.ExamID;
    this.txtExamName.nativeElement.value = ExamRegister.exam.ExamName;
    this.txtDescription.nativeElement.value = ExamRegister.exam.Description;
    this.txtSubject.nativeElement.value = ExamRegister.exam.Subject;
    this.txtDurationMinutes.nativeElement.value = ExamRegister.exam.DurationMinutes.toString();
  }

  /**
   * Recolecta la información del formulario, la valida y llama al servicio para guardar o actualizar.
   */
  async save() {
    // Asignación de los valores de cada control al DTO
    this.ExamRegister.exam.ExamID = this.txtExamID.nativeElement.value;
    this.ExamRegister.exam.ExamName = this.txtExamName.nativeElement.value;
    this.ExamRegister.exam.Description = this.txtDescription.nativeElement.value;
    this.ExamRegister.exam.Subject = this.txtSubject.nativeElement.value;
    this.ExamRegister.exam.DurationMinutes = Number(this.txtDurationMinutes.nativeElement.value);

    // Validación básica de campos obligatorios y consistencia
    if (!this.validate(this.ExamRegister)) { return; }

    // Llamada al servicio para guardar la información
    const rpt: ResponseWsDto = await this.examService.Save(this.ExamRegister);
    if (!rpt.ErrorStatus) {
      this.toastrService.success("Operación realizada con éxito.");
      this.router.navigate(['/enterprise/student/page/listexam']);
    } else {
      this.toastrService.error(rpt.Message);
    }
  }

  /**
   * Valida los campos obligatorios del formulario.
   */
  validate(ExamRegister: ExamRegisterDto): boolean {
    try {
      this.validation.validateIsNotEmpty(ExamRegister.exam.ExamID, "Debe ingresar el ID del examen");
      this.validation.validateIsNotEmpty(ExamRegister.exam.ExamName, "Debe ingresar el nombre del examen");
      this.validation.validateIsNotEmpty(ExamRegister.exam.Subject, "Debe ingresar la asignatura");
      if (!ExamRegister.exam.DurationMinutes || ExamRegister.exam.DurationMinutes <= 0) {
        throw new Error("Debe ingresar una duración válida para el examen");
      }
      return true;
    } catch (e: any) {
      this.toastrService.error(e.message);
      return false;
    }
  }
}
