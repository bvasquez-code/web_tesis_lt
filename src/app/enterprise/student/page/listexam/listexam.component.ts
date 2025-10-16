import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionTableService } from 'src/app/enterprise/shared/interface/ActionTableService';
import { DataTablaGeneticDto } from 'src/app/enterprise/shared/model/dto/DataTablaGeneticDto';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { ExamEntity } from '../../model/entity/ExamEntity';
import { RowActionEvent } from 'src/app/enterprise/shared/model/dto/RowActionEvent'; 
import { AlertService } from 'src/app/enterprise/compartido/service/AlertService';
import { ExamService } from '../../service/ExamService';
import { ExamRegisterDto } from '../../model/dto/ExamRegisterDto';

@Component({
  selector: 'app-listexam',
  templateUrl: './listexam.component.html'
})
export class ListexamComponent implements OnInit, ActionTableService<ExamEntity> {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;

  responsePageSearch: ResponsePageSearch<ExamEntity> = new ResponsePageSearch();
  dataTablaGenetic: DataTablaGeneticDto<ExamEntity> = new DataTablaGeneticDto();

  constructor(
    private examService: ExamService,
    private alertService: AlertService
  ) { }

  // Configuración de la tabla con las columnas y opciones, incluyendo funciones para condicionar los botones
  loadingTable(responsePageSearch: ResponsePageSearch<ExamEntity>): void {
    const data: DataTablaGeneticDto<ExamEntity> = new DataTablaGeneticDto();

    const viewButtonDelete = (item: ExamEntity) => {
      return item.Status === "Active";
    };

    const viewButtonActive = (item: ExamEntity) => {
      return item.Status === "Inactive";
    };

    data.init(
      [
        { Name: "ID del Examen", key: "ExamID" },
        { Name: "Nombre del Examen", key: "ExamName" },
        { Name: "Descripción", key: "Description" },
        { Name: "Asignatura", key: "Subject" },
        { Name: "Duración (min)", key: "DurationMinutes" },
        { Name: "Fecha de Modificación", key: "ModifyDate", IsDate: true },
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
          Id: ["ExamID"], 
          Options: [
            { Type: "Url", Name: "fa fa-pencil-alt", Url: "/enterprise/student/page/createexam?ExamID={ExamID}" },
            { Type: "Url", Name: "fa fa-eye", Url: "/enterprise/student/page/examteacherview?ExamID={ExamID}" },
            { Type: "Action", Name: "fa fa-trash-alt", Url: "#", ID: "delete", Function: viewButtonDelete },
            { Type: "Action", Name: "fa fa-check", Url: "#", ID: "active", Function: viewButtonActive }
          ]
        }
      ],
      { data: responsePageSearch },
      "Lista de examenes"
    );
    this.dataTablaGenetic = data;
  }

  // Método para filtrar la lista según la búsqueda
  filter(Page: number): void {
    const Query = this.txtSearch?.nativeElement?.value || "";
    this.findAll(Page, Query);
  }

  // Realiza la búsqueda mediante el servicio y actualiza la tabla
  async findAll(Page: number, Query: string): Promise<void> {
    const rpt = await this.examService.FindAll(Query, Page);
    if (!rpt.ErrorStatus) {
      this.responsePageSearch = rpt.Data;
      if (this.responsePageSearch.resultSearch && this.responsePageSearch.resultSearch.length > 0) {
        for (let element of this.responsePageSearch.resultSearch) {
          // Se transforma el estado: "A" a "Active", cualquier otro a "Inactive"
          element.Status = (element.Status === "A") ? "Active" : "Inactive";
        }
      }
      this.loadingTable(this.responsePageSearch);
    }
  }

  // Método para manejar la acción al hacer clic en una fila; se delega en el servicio (si lo hubiera)
  getDataRow(item: any): void {
    console.log(item);
    // Se puede invocar adicionalmente algún método del ActionTableService si se requiere
  }

  // Maneja el evento emitido por la tabla cuando se realiza una acción en una fila
  actionRowEvent(event: RowActionEvent<ExamEntity>): void {
    if (event.optionId === "delete") {
      this.deleteExam(event.item);
    } else if (event.optionId === "active") {
      this.activateExam(event.item);
    }
  }

  // Elimina (inactiva) un examen tras confirmar la acción
  async deleteExam(exam: ExamEntity): Promise<void> {
    this.alertService.waring("El registro sera inactivado").then(async (result) => {
      if (result && result.isConfirmed) {
        const examRegister: ExamRegisterDto = new ExamRegisterDto();
        exam.Status = "I";
        examRegister.exam = exam;
        const rpt = await this.examService.Save(examRegister);
        if (!rpt.ErrorStatus) {
          this.filter(1);
        }
      }
    });
  }

  // Activa un examen tras confirmar la acción
  async activateExam(exam: ExamEntity): Promise<void> {
    this.alertService.waring("El registro sera activado").then(async (result) => {
      if (result && result.isConfirmed) {
        const examRegister: ExamRegisterDto = new ExamRegisterDto();
        exam.Status = "A";
        examRegister.exam = exam;
        const rpt = await this.examService.Save(examRegister);
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
