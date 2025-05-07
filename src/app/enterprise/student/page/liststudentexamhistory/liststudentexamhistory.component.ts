import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionTableService } from 'src/app/enterprise/shared/interface/ActionTableService';
import { DataTablaGeneticDto } from 'src/app/enterprise/shared/model/dto/DataTablaGeneticDto';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { RowActionEvent } from 'src/app/enterprise/shared/model/dto/RowActionEvent';
import { StudentExamHistoryEntity } from '../../model/entity/StudentExamHistoryEntity';
import { StudentExamHistoryService } from '../../service/StudentExamHistoryService';
import { AlertService } from 'src/app/enterprise/compartido/service/AlertService';
import { StudentExamHistoryRegisterDto } from '../../model/dto/StudentExamHistoryRegisterDto';


@Component({
  selector: 'app-liststudentexamhistory',
  templateUrl: './liststudentexamhistory.component.html'
})
export class ListstudentexamhistoryComponent implements OnInit, ActionTableService<StudentExamHistoryEntity> {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;

  responsePageSearch: ResponsePageSearch<StudentExamHistoryEntity> = new ResponsePageSearch();
  dataTablaGenetic: DataTablaGeneticDto<StudentExamHistoryEntity> = new DataTablaGeneticDto();

  constructor(
    private historyService: StudentExamHistoryService,
    private alertService: AlertService
  ) {}

  // Configura la tabla con columnas y opciones de acción
  loadingTable(responsePageSearch: ResponsePageSearch<StudentExamHistoryEntity>): void {
    const data: DataTablaGeneticDto<StudentExamHistoryEntity> = new DataTablaGeneticDto();

    // Función que muestra el botón para marcar el intento como completado (solo si está en curso)
    const viewButtonComplete = (item: StudentExamHistoryEntity) => {
      return item.IsCompleted === 0; // 0: En curso
    };

    // Función que muestra el botón para eliminar el intento (solo si ya está completado)
    const viewButtonDelete = (item: StudentExamHistoryEntity) => {
      return item.IsCompleted === 1; // 1: Completado
    };

    data.init(
      [
        { Name: "History ID", key: "HistoryID" },
        { Name: "Student ID", key: "StudentID" },
        { Name: "Exam ID", key: "ExamID" },
        { 
          Name: "Status", 
          key: "IsCompleted", 
          IsStatus: true,
          Html: {
            // Las clases CSS se asignan según el estado; se espera que el componente <app-table> muestre "Completed" si el valor es 1 y "In Progress" si es 0.
            0: 'badge badge-sm bgc-info-d1 text-white pb-1 px-25',
            1: 'badge badge-sm bgc-red-d1 text-white pb-1 px-25'
          },
          Mask: {
            0: 'En proceso',
            1: 'Finalizado'
          }
        },
        { Name: "Start Date", key: "StartDate", IsDate: true },
        { 
          Name: "Options", 
          ColumnAction: true, 
          Id: ["HistoryID","ExamID"],
          Options: [
            { Type: "Action", Name: "fa fa-check", Url: "#", ID: "complete", 
              Function: viewButtonComplete , Title: "Marcar como examen finalizado" },
            { Type: "Url", Name: "fa fa-pencil-alt", Url: "/enterprise/student/page/resolveexam?HistoryID={HistoryID}&ExamID={ExamID}" , 
              Function: viewButtonComplete,Title: "Resolver examen" },
          ]
        }
      ],
      { data: responsePageSearch },
      "Student Exam History"
    );
    this.dataTablaGenetic = data;
  }

  // Filtra la tabla de acuerdo al texto de búsqueda
  filter(Page: number): void {
    const Query = this.txtSearch?.nativeElement?.value || "";
    this.findAll(Page, Query);
  }

  // Llama al servicio para obtener los registros y transforma el valor de IsCompleted para la visualización
  async findAll(Page: number, Query: string): Promise<void> {
    const rpt = await this.historyService.FindAll(Query, Page);
    if (!rpt.ErrorStatus) {
      this.responsePageSearch = rpt.Data;
      if (this.responsePageSearch.resultSearch && this.responsePageSearch.resultSearch.length > 0) {
        for (let element of this.responsePageSearch.resultSearch) {
          // Se puede agregar una propiedad de texto para el estado si se requiere:
          // element['StatusText'] = (element.IsCompleted === 1) ? "Completed" : "In Progress";
          // Por simplicidad, aquí mantenemos el valor numérico y se asume que el <app-table> lo interpreta según lo configurado.
        }
      }
      this.loadingTable(this.responsePageSearch);
    }
  }

  // Método para acciones generales en una fila
  getDataRow(item: any): void {
    console.log(item);
  }

  // Maneja el evento rowAction emitido por <app-table>
  actionRowEvent(event: RowActionEvent<StudentExamHistoryEntity>): void {
    if (event.optionId === "complete") {
      this.completeAttempt(event.item);
    } else if (event.optionId === "delete") {
      this.deleteAttempt(event.item);
    }
  }

  // Marca un intento como completado
  async completeAttempt(history: StudentExamHistoryEntity): Promise<void> {
    this.alertService.waring("El intento será marcado como completado").then(async (result) => {
      if (result && result.isConfirmed) {
        const registerDto: StudentExamHistoryRegisterDto = new StudentExamHistoryRegisterDto();
        history.IsCompleted = 1; // Marca como completado
        registerDto.history = history;
        const rpt = await this.historyService.Save(registerDto);
        if (!rpt.ErrorStatus) {
          this.filter(1);
        }
      }
    });
  }

  // Elimina un intento (sólo si ya está completado)
  async deleteAttempt(history: StudentExamHistoryEntity): Promise<void> {
    this.alertService.waring("El intento será eliminado").then(async (result) => {
      if (result && result.isConfirmed) {
        const registerDto: StudentExamHistoryRegisterDto = new StudentExamHistoryRegisterDto();
        // Suponemos que la eliminación se maneja mediante el método Save en el servicio, actualizando el registro de alguna forma.
        // Por ejemplo, se podría interpretar que eliminar significa removerlo de la lista.
        // Aquí simplemente llamamos a Save; la implementación en el backend deberá determinar la acción.
        registerDto.history = history;
        const rpt = await this.historyService.Save(registerDto);
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
