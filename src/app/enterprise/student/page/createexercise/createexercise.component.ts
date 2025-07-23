import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ValidationHelper } from 'src/app/enterprise/shared/helper/ValidationHelper';
import { ExerciseRegisterDto } from '../../model/dto/ExerciseRegisterDto';
import { ExerciseService } from '../../service/ExerciseService';
import { TopicEntity } from '../../model/entity/TopicEntity';


@Component({
  selector: 'app-createexercise',
  templateUrl: './createexercise.component.html'
})
export class CreateexerciseComponent implements OnInit {

  // Si se pasa un ExerciseID por query param se entiende que es modo edición; de lo contrario, es un registro nuevo.
  ExerciseID: number = 0;
  // DTO que encapsula la entidad ExerciseEntity (con auditoría)
  ExerciseRegister: ExerciseRegisterDto = new ExerciseRegisterDto();
  // Bandera para marcar el campo ExerciseID como solo lectura (en modo edición)
  txtExerciseIDReadonly: boolean = false;
  // Helper para validaciones
  validation: ValidationHelper = new ValidationHelper();

  topicList: TopicEntity[] = [];

  base64Image: string = "";
  uploadedFileName = '';
  imageToDisplay: string = "";

  courses: string[] = [];
  filteredTopics: TopicEntity[] = [];
  selectedCourse: string = '';

  // Referencias a los controles del formulario
  @ViewChild('txtExerciseID') txtExerciseID!: ElementRef<HTMLInputElement>;
  @ViewChild('txtExerciseCod') txtExerciseCod!: ElementRef<HTMLInputElement>;
  @ViewChild('txtTopicID') txtTopicID!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCourse') txtCourse!: ElementRef<HTMLInputElement>;
  @ViewChild('txtLevel') txtLevel!: ElementRef<HTMLInputElement>;
  @ViewChild('txtImagePath') txtImagePath!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCorrectAnswer') txtCorrectAnswer!: ElementRef<HTMLInputElement>;

  constructor(
    private exerciseService: ExerciseService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    // Se obtiene el ExerciseID de la URL (por ejemplo, ?ExerciseID=123)
    const urlTree: any = this.router.parseUrl(this.router.url);
    this.ExerciseID = urlTree.queryParams['ExerciseID'] ? +urlTree.queryParams['ExerciseID'] : 0;
  }

  ngOnInit(): void { 
    this.loadFormData(this.ExerciseID);
  }

  /**
   * Carga los datos adicionales para el formulario mediante el servicio.
   * Se espera que el endpoint 'findDataForm' retorne en DataAdditional un objeto
   * con Name "exercise" que contenga el ExerciseRegisterDto.
   */
  async loadFormData(ExerciseID: number) {
    const rpt: ResponseWsDto = await this.exerciseService.FindDataForm(ExerciseID);
    if (!rpt.ErrorStatus) {
      this.ExerciseRegister = rpt.DataAdditional.find(e => e.Name === "exercise")?.Data;
      if (this.ExerciseRegister && this.ExerciseRegister.exercise.ExerciseID) {
        this.txtExerciseIDReadonly = true;
      }

      this.topicList = rpt.DataAdditional.find(e => e.Name === "topicList")?.Data;
      this.courses = rpt.DataAdditional.find(e => e.Name === "courses")?.Data;
      this.filteredTopics = rpt.DataAdditional.find(e => e.Name === "filteredTopics")?.Data;

      setTimeout(() => {
        this.populateForm(this.ExerciseRegister);
      }, 100);
    }
  }

  onCourseChange(): void {
    this.filteredTopics = this.topicList.filter(t => t.Course === this.txtCourse.nativeElement.value);
  }

  /**
   * Asigna los valores del DTO a los controles del formulario.
   */
  populateForm(ExerciseRegister: ExerciseRegisterDto) {
    if (!ExerciseRegister) { return; }

  
    this.txtExerciseID.nativeElement.value = ExerciseRegister.exercise.ExerciseID.toString();
    this.txtExerciseCod.nativeElement.value = ExerciseRegister.exercise.ExerciseCod;
    this.txtLevel.nativeElement.value = ExerciseRegister.exercise.Level.toString();
    this.txtImagePath.nativeElement.value = ExerciseRegister.exercise.ImagePath;
    this.txtCorrectAnswer.nativeElement.value = ExerciseRegister.exercise.CorrectAnswer;
    this.imageToDisplay = ExerciseRegister.base64Image;

    const currentCourse = this.topicList.find(t => t.TopicID === this.ExerciseRegister.exercise.TopicID);
    let courseStr = "";
    if (this.ExerciseRegister.exercise.TopicID && currentCourse) {
      courseStr = currentCourse.Course;
    } else {
      courseStr = this.courses[0];
    }

    this.txtCourse.nativeElement.value = courseStr;
    this.txtTopicID.nativeElement.value = ExerciseRegister.exercise.TopicID.toString();
  }

  /**
   * Recolecta la información del formulario, la valida y llama al servicio para guardar/actualizar.
   */
  async save() {
    // Asignar los valores de cada control al DTO  
    // (ExerciseID se asigna automáticamente en modo edición; para registro nuevo se omite)
    if(!this.ExerciseRegister){
      this.ExerciseRegister = new ExerciseRegisterDto();
    }
    this.ExerciseRegister.exercise.ExerciseCod = this.txtExerciseCod.nativeElement.value;
    this.ExerciseRegister.exercise.TopicID = Number(this.txtTopicID.nativeElement.value);
    this.ExerciseRegister.exercise.Level = Number(this.txtLevel.nativeElement.value);
    this.ExerciseRegister.exercise.CorrectAnswer = String(this.txtCorrectAnswer.nativeElement.value).toUpperCase();
    this.ExerciseRegister.base64Image = this.base64Image;

    // Validación básica de campos obligatorios
    if (!this.validate(this.ExerciseRegister)) { return; }

    // Llamada al servicio para guardar o actualizar la información
    const rpt: ResponseWsDto = await this.exerciseService.Save(this.ExerciseRegister);
    if (!rpt.ErrorStatus) {
      this.toastrService.success("Operación realizada con éxito.");
      this.router.navigate(['/enterprise/student/page/listexercise']);
    } else {
      this.toastrService.error(rpt.Message);
    }
  }

  /**
   * Valida los campos obligatorios del formulario.
   */
  validate(ExerciseRegister: ExerciseRegisterDto): boolean {
    try {
      this.validation.validateIsNotEmpty(ExerciseRegister.exercise.TopicID.toString(), "Debe ingresar el ID del tema");
      this.validation.validateIsNotEmpty(ExerciseRegister.exercise.Level.toString(), "Debe ingresar el nivel de dificultad");
      this.validation.validateIsNotEmpty(ExerciseRegister.exercise.CorrectAnswer, "Debe ingresar la respuesta correcta");
      return true;
    } catch (e: any) {
      this.toastrService.error(e.message);
      return false;
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.base64Image = reader.result as string;
      this.imageToDisplay = this.base64Image;
    };

    reader.readAsDataURL(file);
  }

}
