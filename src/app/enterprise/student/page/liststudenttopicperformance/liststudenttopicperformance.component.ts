import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionTableService } from 'src/app/enterprise/shared/interface/ActionTableService';
import { DataTablaGeneticDto } from 'src/app/enterprise/shared/model/dto/DataTablaGeneticDto';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { StudentTopicPerformanceEntity } from '../../model/entity/StudentTopicPerformanceEntity';
import { StudentTopicPerformanceRegisterDto } from '../../model/dto/StudentTopicPerformanceRegisterDto';
import { RowActionEvent } from 'src/app/enterprise/shared/model/dto/RowActionEvent'; // Se asume que este tipo está definido
import { StudentTopicPerformanceService } from '../../service/StudentTopicPerformanceService';
import { AlertService } from 'src/app/enterprise/compartido/service/AlertService';


@Component({
  selector: 'app-liststudenttopicperformance',
  templateUrl: './liststudenttopicperformance.component.html'
})
export class ListstudenttopicperformanceComponent implements OnInit, ActionTableService<StudentTopicPerformanceEntity> {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;

  responsePageSearch: ResponsePageSearch<StudentTopicPerformanceEntity> = new ResponsePageSearch();
  dataTablaGenetic: DataTablaGeneticDto<StudentTopicPerformanceEntity> = new DataTablaGeneticDto();

  constructor(
    private performanceService: StudentTopicPerformanceService,
    private alertService: AlertService
  ) {}

  // Configura la tabla con las columnas y las opciones de acción
  loadingTable(responsePageSearch: ResponsePageSearch<StudentTopicPerformanceEntity>): void {
    const data: DataTablaGeneticDto<StudentTopicPerformanceEntity> = new DataTablaGeneticDto();

    data.init(
      [
        { Name: "Student ID", key: "StudentID" },
        { Name: "Topic ID", key: "TopicID" },
        { Name: "Average Points", key: "AveragePoints" },
        { Name: "Performance", key: "PerformanceClassification" },
        { 
          Name: "Options", 
          ColumnAction: true, 
          Id: ["StudentID", "TopicID"],
          Options: [
            { Type: "Url", Name: "fa fa-pencil-alt", Url: "/enterprise/student_topic_performance/page/edit?StudentID={StudentID}&TopicID={TopicID}" },
            { Type: "Action", Name: "fa fa-trash-alt", Url: "#", ID: "delete" }
          ]
        }
      ],
      { data: responsePageSearch },
      "Student Topic Performance"
    );
    this.dataTablaGenetic = data;
  }

  // Filtra la lista según el valor ingresado en el campo de búsqueda
  filter(Page: number): void {
    const Query = this.txtSearch?.nativeElement?.value || "";
    this.findAll(Page, Query);
  }

  // Llama al servicio para obtener los registros y actualiza la tabla
  async findAll(Page: number, Query: string): Promise<void> {
    const rpt = await this.performanceService.FindAll(Query, Page);
    if (!rpt.ErrorStatus) {
      this.responsePageSearch = rpt.Data;
      this.loadingTable(this.responsePageSearch);
    }
  }

  // Método para registrar (o procesar) la acción sobre una fila
  getDataRow(item: any): void {
    console.log(item);
  }

  // Maneja el evento rowAction emitido por <app-table>
  actionRowEvent(event: RowActionEvent<StudentTopicPerformanceEntity>): void {
    if (event.optionId === "delete") {
      this.deletePerformance(event.item);
    }
  }

  // Elimina un registro de performance tras confirmar la acción
  async deletePerformance(performance: StudentTopicPerformanceEntity): Promise<void> {
    this.alertService.waring("El registro será eliminado").then(async (result) => {
      if (result && result.isConfirmed) {
        const registerDto: StudentTopicPerformanceRegisterDto = new StudentTopicPerformanceRegisterDto();
        registerDto.performance = performance;
        const rpt = await this.performanceService.Delete(registerDto);
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