import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionTableService } from 'src/app/enterprise/shared/interface/ActionTableService';
import { DataTablaGeneticDto } from 'src/app/enterprise/shared/model/dto/DataTablaGeneticDto';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { TopicEntity } from '../../model/entity/TopicEntity';
import { TopicRegisterDto } from '../../model/dto/TopicRegisterDto';
import { RowActionEvent } from 'src/app/enterprise/shared/model/dto/RowActionEvent'; // Se asume que este tipo está definido
import { AlertService } from 'src/app/enterprise/compartido/service/AlertService';
import { TopicService } from '../../service/TopicService';


@Component({
  selector: 'app-listtopic',
  templateUrl: './listtopic.component.html'
})
export class ListtopicComponent implements OnInit, ActionTableService<TopicEntity> {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;

  responsePageSearch: ResponsePageSearch<TopicEntity> = new ResponsePageSearch();
  dataTablaGenetic: DataTablaGeneticDto<TopicEntity> = new DataTablaGeneticDto();

  constructor(
    private topicService: TopicService,
    private alertService: AlertService
  ) {}

  // Configuración de la tabla: define las columnas, el formato y las opciones de acción
  loadingTable(responsePageSearch: ResponsePageSearch<TopicEntity>): void {
    const data: DataTablaGeneticDto<TopicEntity> = new DataTablaGeneticDto();

    // Funciones para determinar la visibilidad de los botones de acción
    const viewButtonDelete = (item: TopicEntity) => {
      return item.Status === "Active";
    };

    const viewButtonActive = (item: TopicEntity) => {
      return item.Status === "Inactive";
    };

    data.init(
      [
        { Name: "Topic Code", key: "TopicCod" },
        { Name: "Name", key: "Name" },
        { Name: "Course", key: "Course" },
        { Name: "Modification", key: "ModifyDate", IsDate: true },
        { 
          Name: "Status", 
          key: "Status", 
          IsStatus: true,
          Html: {
            Active: 'badge badge-sm bgc-info-d1 text-white pb-1 px-25',
            Inactive: 'badge badge-sm bgc-red-d1 text-white pb-1 px-25'
          }
        },
        { 
          Name: "Options", 
          ColumnAction: true, 
          Id: ["TopicID"],
          Options: [
            { Type: "Url", Name: "fa fa-pencil-alt", Url: "/enterprise/student/page/createtopic?TopicID={TopicID}" },
            { Type: "Action", Name: "fa fa-trash-alt", Url: "#", ID: "delete", Function: viewButtonDelete },
            { Type: "Action", Name: "fa fa-check", Url: "#", ID: "active", Function: viewButtonActive }
          ]
        }
      ],
      { data: responsePageSearch },
      "Topic List"
    );
    this.dataTablaGenetic = data;
  }

  // Filtra la información según el texto ingresado en el campo de búsqueda
  filter(Page: number): void {
    const Query = this.txtSearch?.nativeElement?.value || "";
    this.findAll(Page, Query);
  }

  // Llama al servicio para obtener la lista de temas y actualiza la tabla
  async findAll(Page: number, Query: string): Promise<void> {
    const rpt = await this.topicService.FindAll(Query, Page);
    if (!rpt.ErrorStatus) {
      this.responsePageSearch = rpt.Data;
      if (this.responsePageSearch.resultSearch && this.responsePageSearch.resultSearch.length > 0) {
        for (let element of this.responsePageSearch.resultSearch) {
          // Transforma el estado: "A" se convierte en "Active", lo demás en "Inactive"
          element.Status = (element.Status === "A") ? "Active" : "Inactive";
        }
      }
      this.loadingTable(this.responsePageSearch);
    }
  }

  // Método que se invoca al hacer clic en una fila (para fines de logging o acción adicional)
  getDataRow(item: any): void {
    console.log(item);
  }

  // Maneja el evento rowAction emitido por el componente <app-table>
  actionRowEvent(event: RowActionEvent<TopicEntity>): void {
    if (event.optionId === "delete") {
      this.deleteTopic(event.item);
    } else if (event.optionId === "active") {
      this.activateTopic(event.item);
    }
  }

  // Inactiva (elimina) un tema tras confirmar la acción
  async deleteTopic(topic: TopicEntity): Promise<void> {
    this.alertService.waring("El registro será inactivado").then(async (result) => {
      if (result && result.isConfirmed) {
        const topicRegister: TopicRegisterDto = new TopicRegisterDto();
        topic.Status = "I";
        topicRegister.topic = topic;
        const rpt = await this.topicService.Save(topicRegister);
        if (!rpt.ErrorStatus) {
          this.filter(1);
        }
      }
    });
  }

  // Activa un tema tras confirmar la acción
  async activateTopic(topic: TopicEntity): Promise<void> {
    this.alertService.waring("El registro será activado").then(async (result) => {
      if (result && result.isConfirmed) {
        const topicRegister: TopicRegisterDto = new TopicRegisterDto();
        topic.Status = "A";
        topicRegister.topic = topic;
        const rpt = await this.topicService.Save(topicRegister);
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