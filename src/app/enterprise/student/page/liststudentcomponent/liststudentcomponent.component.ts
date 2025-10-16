import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionTableService } from 'src/app/enterprise/shared/interface/ActionTableService';
import { DataTablaGeneticDto } from 'src/app/enterprise/shared/model/dto/DataTablaGeneticDto';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { StudentEntity } from '../../model/entity/StudentEntity';
import { StudentService } from '../../service/StudentService';
import { ActionModalConfirmService } from 'src/app/enterprise/shared/interface/ActionModalConfirmService';
import { StudentRegisterDto } from '../../model/dto/StudentRegisterDto';
import { RowActionEvent } from 'src/app/enterprise/shared/model/dto/RowActionEvent';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { AlertService } from 'src/app/enterprise/compartido/service/AlertService';
import { AppSetting } from 'src/app/config/app.setting';


@Component({
  selector: 'app-liststudentcomponent',
  templateUrl: './liststudentcomponent.component.html'
})
export class ListstudentcomponentComponent implements OnInit, ActionTableService<StudentEntity>,ActionModalConfirmService {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;

  responsePageSearch: ResponsePageSearch<StudentEntity> = new ResponsePageSearch();
  dataTablaGenetic: DataTablaGeneticDto<StudentEntity> = new DataTablaGeneticDto();

  constructor(
    private studentService: StudentService,
    private alertService  : AlertService
  ) { }

  actionModal(ModalId: string): void {
    
  }

  filter(Page: number): void {
    const Query = (this.txtSearch?.nativeElement?.value) ? this.txtSearch.nativeElement.value : "";
    this.findAll(Page, Query);
  }

  loadingTable(responsePageSearch: ResponsePageSearch<StudentEntity>): void {
    const data: DataTablaGeneticDto<StudentEntity> = new DataTablaGeneticDto();


    const viewButtonDelete = (item : StudentEntity) => {
      return item.Status === "A";
    }

    const viewButtonActive = (item : StudentEntity) => {
      return item.Status === "I";
    }

    const StatusColumnHtml = (item : StudentEntity) => {
      return (item.Status === "A") ? "Active" : "Inactive";
    }

    data.init(
      [
      { Name: "ID Estudiante", key: "StudentID" },
      { Name: "Nombre", key: "FirstName" },
      { Name: "Apellido", key: "LastName" },
      { Name: "Fecha de inscripción", key: "EnrollmentDate", IsDate: true },
      { Name: "Grado", key: "GradeLevel" },
      { Name: "Fecha de modificación", key: "ModifyDate", IsDate: true },
      { 
        Name: "Estado", 
        key: "Status", 
        IsStatus: true,
        FunctionKey: StatusColumnHtml,
        Html: {
        Active: 'badge badge-sm bgc-info-d1 text-white pb-1 px-25',
        Inactive: 'badge badge-sm bgc-red-d1 text-white pb-1 px-25'
        }
      },
      { 
        Name: "Opciones", 
        ColumnAction: true, 
        Id: ["StudentID"], 
        Options: [
        { Type: "Url", Name: "fa fa-pencil-alt", Url: "/enterprise/student/page/createstudent?StudentID={StudentID}" },
        { Type: "Action", Name: "fa fa-trash-alt", Url: "#", ID: "delete", Function: viewButtonDelete },
        { Type: "Action", Name: "fa fa-check", Url: "#", ID: "active", Function: viewButtonActive },
        { Type: "Action", Name: "fa fa-envelope", Url: "#", ID: "invitation" }
        ]
      }
      ],
      {
      data: responsePageSearch
      },
      "Lista de estudiantes"
    );
    this.dataTablaGenetic = data;
  }

  async findAll(Page: number, Query: string): Promise<void> {
    const rpt = await this.studentService.FindAll(Query, Page);
    if (!rpt.ErrorStatus) {
      this.responsePageSearch = rpt.Data;
      this.loadingTable(this.responsePageSearch);
    }
  }

  async deleteStudent(student : StudentEntity){

    this.alertService.waring("El registro sera inactivado").then(async (result) => {
      if (result && result.isConfirmed) {
        const strudenRegister :StudentRegisterDto = new StudentRegisterDto();
        student.Status = "I";
        strudenRegister.student = student;
        const rpt = await this.studentService.Save(strudenRegister);
        if (!rpt.ErrorStatus) {
          this.filter(1);
        }
      }
    });
  }

  async activateStudent(student : StudentEntity){

    this.alertService.waring("El registro sera activado").then(async (result) => {
      if (result.isConfirmed) {
        const strudenRegister :StudentRegisterDto = new StudentRegisterDto();
        student.Status = "A";
        strudenRegister.student = student;
        const rpt = await this.studentService.Save(strudenRegister);
        if (!rpt.ErrorStatus) {
          this.filter(1);
        }
      }
    });
  }

  getDataRow(item: any): void {
   
  }

  actionRowEvent(event: RowActionEvent<StudentEntity>): void {

    if (event.optionId === "delete") {
      this.deleteStudent(event.item);
    } else if (event.optionId === "active") {
      this.activateStudent(event.item);
    } else if (event.optionId === "invitation") {
      this.showInvitationModal(event.item);
    }
  }

  showInvitationModal(student: StudentEntity): void {

    const baseUrl = window.location.origin;
    const expirationTimestamp = new Date().getTime() + (24 * 60 * 60 * 1000);
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const rawParams = `StudentID=${student.StudentID}&expirationDate=${expirationTimestamp}&uid=${uniqueId}`;
    
    const encryptedParams = btoa(rawParams);
    
    const invitationUrl = `${baseUrl}/enterprise/student/page/registerstudent?invitation=${encryptedParams}`;
    
    this.alertService.customConfirmation(
      "Enviar Invitación",
      `La URL generada es:<br/><strong>${invitationUrl}</strong><br/><br/>Seleccione el método de envío:`,
      [
        { text: "Correo", value: "correo" },
        { text: "WhatsApp", value: "wsp" },
        { text: "Cancelar", value: "cancel" }
      ]
    ).then(async (result) => {

      if (result && result.value && result.value !== "cancel") {

        student.RegistrationUrl = invitationUrl;

        const studentRegister: StudentRegisterDto = new StudentRegisterDto();
        studentRegister.student = student;
        const rpt = await this.studentService.Save(studentRegister);
        if (!rpt.ErrorStatus) {
          this.filter(1);
          // Muestra una alerta de éxito después de guardar
          Swal.fire({
            icon: 'success',
            title: 'Invitación enviada',
            text: 'La invitación se ha generado y guardado con éxito.'
          });
        }
      }
    });
  }
  
  
  

  ngOnInit(): void {
    this.findAll(1, "");
  }
}