import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionTableService } from 'src/app/enterprise/shared/interface/ActionTableService';
import { DataTablaGeneticDto } from 'src/app/enterprise/shared/model/dto/DataTablaGeneticDto';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { ExerciseEntity } from '../../model/entity/ExerciseEntity';
import { ExerciseRegisterDto } from '../../model/dto/ExerciseRegisterDto';
import { RowActionEvent } from 'src/app/enterprise/shared/model/dto/RowActionEvent'; // Se asume que este tipo ya existe
import { AlertService } from 'src/app/enterprise/compartido/service/AlertService';
import { ExerciseService } from '../../service/ExerciseService';


@Component({
  selector: 'app-listexercise',
  templateUrl: './listexercise.component.html'
})
export class ListexerciseComponent implements OnInit, ActionTableService<ExerciseEntity> {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;

  responsePageSearch: ResponsePageSearch<ExerciseEntity> = new ResponsePageSearch();
  dataTablaGenetic: DataTablaGeneticDto<ExerciseEntity> = new DataTablaGeneticDto();

  constructor(
    private exerciseService: ExerciseService,
    private alertService: AlertService
  ) {}

  // Configura la tabla con columnas, opciones y funciones condicionales
  loadingTable(responsePageSearch: ResponsePageSearch<ExerciseEntity>): void {
    const data: DataTablaGeneticDto<ExerciseEntity> = new DataTablaGeneticDto();

    // Funciones para determinar la visibilidad de los botones según el estado del ejercicio
    const viewButtonDelete = (item: ExerciseEntity) => {
      return item.Status === "Active";
    };

    const viewButtonActive = (item: ExerciseEntity) => {
      return item.Status === "Inactive";
    };

    const existImage = (item: ExerciseEntity) => {
      return (item.ImagePath !== null && item.ImagePath !== "") ? "SI" : "NO";
    };

    data.init(
      [
      { Name: "Código", key: "ExerciseCod" },
      { Name: "ID del Tema", key: "TopicID" },
      { Name: "Nivel", key: "Level" },
      { Name: "Respuesta Correcta", key: "CorrectAnswer" },
      { Name: "Fecha de Modificación", key: "ModifyDate", IsDate: true },
      { Name: "Imagen", key: "Image" ,FunctionKey: existImage },
      { 
        Name: "Estado", 
        key: "Status", 
        IsStatus: true,
        Html: {
        Active: 'badge badge-sm bgc-info-d1 text-white pb-1 px-25',
        Inactive: 'badge badge-sm bgc-red-d1 text-white pb-1 px-25'
        }
      },
      { 
        Name: "Opciones", 
        ColumnAction: true, 
        Id: ["ExerciseID"],
        Options: [
        { Type: "Url", Name: "fa fa-pencil-alt", Url: "/enterprise/student/page/createexercise?ExerciseID={ExerciseID}" },
        { Type: "Action", Name: "fa fa-trash-alt", Url: "#", ID: "delete", Function: viewButtonDelete },
        { Type: "Action", Name: "fa fa-check", Url: "#", ID: "active", Function: viewButtonActive }
        ]
      }
      ],
      { data: responsePageSearch },
      "Lista de Ejercicios"
    );
    this.dataTablaGenetic = data;
  }

  // Método para filtrar la tabla según el texto de búsqueda
  filter(Page: number): void {
    const Query = this.txtSearch?.nativeElement?.value || "";
    this.findAll(Page, Query);
  }

  // Llama al servicio para obtener los ejercicios y actualiza la tabla
  async findAll(Page: number, Query: string): Promise<void> {
    const rpt = await this.exerciseService.FindAll(Query, Page);
    if (!rpt.ErrorStatus) {
      this.responsePageSearch = rpt.Data;
      if (this.responsePageSearch.resultSearch && this.responsePageSearch.resultSearch.length > 0) {
        for (let element of this.responsePageSearch.resultSearch) {
          // Transforma el estado: "A" se convierte en "Active", otros se consideran "Inactive"
          element.Status = (element.Status === "A") ? "Active" : "Inactive";
        }
      }
      this.loadingTable(this.responsePageSearch);
    }
  }

  // Método que se invoca al hacer clic en una fila (además de emitir el evento, se puede registrar en consola)
  getDataRow(item: any): void {
    console.log(item);
  }

  // Maneja el evento rowAction emitido por el componente <app-table>
  actionRowEvent(event: RowActionEvent<ExerciseEntity>): void {
    if (event.optionId === "delete") {
      this.deleteExercise(event.item);
    } else if (event.optionId === "active") {
      this.activateExercise(event.item);
    }
  }

  // Inactiva (elimina) un ejercicio tras confirmar la acción
  async deleteExercise(exercise: ExerciseEntity): Promise<void> {
    this.alertService.waring("El registro será inactivado").then(async (result) => {
      if (result && result.isConfirmed) {
        const exerciseRegister: ExerciseRegisterDto = new ExerciseRegisterDto();
        exercise.Status = "I";
        exerciseRegister.exercise = exercise;
        const rpt = await this.exerciseService.Save(exerciseRegister);
        if (!rpt.ErrorStatus) {
          this.filter(1);
        }
      }
    });
  }

  // Activa un ejercicio tras confirmar la acción
  async activateExercise(exercise: ExerciseEntity): Promise<void> {
    this.alertService.waring("El registro será activado").then(async (result) => {
      if (result && result.isConfirmed) {
        const exerciseRegister: ExerciseRegisterDto = new ExerciseRegisterDto();
        exercise.Status = "A";
        exerciseRegister.exercise = exercise;
        const rpt = await this.exerciseService.Save(exerciseRegister);
        if (!rpt.ErrorStatus) {
          this.filter(1);
        }
      }
    });
  }

  ngOnInit(): void {
    this.findAll(1, "");
  }
}
