import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Importa el servicio, el DTO y el helper de validaciones
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ValidationHelper } from 'src/app/enterprise/shared/helper/ValidationHelper';
import { TopicRegisterDto } from '../../model/dto/TopicRegisterDto';
import { TopicService } from '../../service/TopicService';

@Component({
  selector: 'app-createtopic',
  templateUrl: './createtopic.component.html'
})
export class CreatetopicComponent implements OnInit {

  // Si se pasa un TopicID por query param se entiende que es edición; de lo contrario, es registro nuevo
  TopicID: number = 0;
  // DTO que encapsula la entidad TopicEntity (la entidad extiende de AuditTableEntity)
  TopicRegister: TopicRegisterDto = new TopicRegisterDto();
  // Bandera para marcar el campo TopicID como solo lectura (modo edición)
  txtTopicIDReadonly: boolean = false;
  // Helper para validaciones
  validation: ValidationHelper = new ValidationHelper();

  // Referencias a los controles del formulario
  @ViewChild('txtTopicID') txtTopicID!: ElementRef<HTMLInputElement>;
  @ViewChild('txtTopicCod') txtTopicCod!: ElementRef<HTMLInputElement>;
  @ViewChild('txtName') txtName!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCourse') txtCourse!: ElementRef<HTMLInputElement>;

  constructor(
    private topicService: TopicService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    // Se obtiene el TopicID de la URL (por ejemplo, ?TopicID=12)
    const urlTree: any = this.router.parseUrl(this.router.url);
    this.TopicID = urlTree.queryParams['TopicID'] ? +urlTree.queryParams['TopicID'] : 0;
    if (this.TopicID) {
      // Modo edición: carga los datos existentes
      this.loadFormData(this.TopicID);
    }
  }

  ngOnInit(): void { }

  /**
   * Carga los datos del tema mediante el servicio.
   * Se espera que el endpoint 'findDataForm' retorne en DataAdditional un objeto
   * con Name "topic" que contenga el TopicRegisterDto.
   */
  async loadFormData(TopicID: number) {
    const rpt: ResponseWsDto = await this.topicService.FindDataForm(TopicID);
    if (!rpt.ErrorStatus) {
      this.TopicRegister = rpt.DataAdditional.find(e => e.Name === "topic")?.Data;
      if (this.TopicRegister && this.TopicRegister.topic.TopicID) {
        this.txtTopicIDReadonly = true;
      }
      setTimeout(() => {
        this.populateForm(this.TopicRegister);
      }, 100);
    }
  }

  /**
   * Asigna los valores del DTO a los controles del formulario.
   */
  populateForm(TopicRegister: TopicRegisterDto) {
    if (!TopicRegister) { return; }
    this.txtTopicID.nativeElement.value = TopicRegister.topic.TopicID.toString();
    this.txtTopicCod.nativeElement.value = TopicRegister.topic.TopicCod;
    this.txtName.nativeElement.value = TopicRegister.topic.Name;
    this.txtCourse.nativeElement.value = TopicRegister.topic.Course;
  }

  /**
   * Recolecta la información del formulario, la valida y llama al servicio para guardar/actualizar.
   */
  async save() {
    // Se asignan los valores de cada control al DTO
    this.TopicRegister.topic.TopicCod = this.txtTopicCod.nativeElement.value;
    this.TopicRegister.topic.Name = this.txtName.nativeElement.value;
    this.TopicRegister.topic.Course = this.txtCourse.nativeElement.value;

    // Validación básica de campos obligatorios
    if (!this.validate(this.TopicRegister)) { return; }

    // Llamada al servicio para guardar la información
    const rpt: ResponseWsDto = await this.topicService.Save(this.TopicRegister);
    if (!rpt.ErrorStatus) {
      this.toastrService.success("Operación realizada con éxito.");
      this.router.navigate(['/enterprise/student/page/listtopic']);
    } else {
      this.toastrService.error(rpt.Message);
    }
  }

  /**
   * Valida los campos obligatorios del formulario.
   */
  validate(TopicRegister: TopicRegisterDto): boolean {
    try {
      this.validation.validateIsNotEmpty(TopicRegister.topic.TopicCod, "Debe ingresar el código del tema");
      this.validation.validateIsNotEmpty(TopicRegister.topic.Name, "Debe ingresar el nombre del tema");
      this.validation.validateIsNotEmpty(TopicRegister.topic.Course, "Debe ingresar el curso al que pertenece el tema");
      return true;
    } catch (e: any) {
      this.toastrService.error(e.message);
      return false;
    }
  }
}
