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
import { NotificationService } from '../../service/NotificationService';
import { EmailSendDto } from '../../model/dto/EmailSendDto';


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
    private alertService  : AlertService,
    private notificationService: NotificationService
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

    const viewInvitation = (item : StudentEntity) => {
      return (item.HasAccount === "N");
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
        { Type: "Action", Name: "fa fa-envelope", Url: "#", ID: "invitation", Function: viewInvitation }
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

  async showInvitationModal(student: StudentEntity): Promise<void> {
  const baseUrl = window.location.origin;
  const expirationTimestamp = Date.now() + (24 * 60 * 60 * 1000);
  const uniqueId = Math.random().toString(36).slice(2, 11);
  const rawParams = `StudentID=${student.StudentID}&expirationDate=${expirationTimestamp}&uid=${uniqueId}`;
  const encryptedParams = btoa(rawParams);
  const invitationUrl = `${baseUrl}/enterprise/student/page/registerstudent?invitation=${encryptedParams}`;

  // 1) Guarda la URL en el alumno (opcional, igual que ya hacías)
  student.RegistrationUrl = invitationUrl;
  const payload = new StudentRegisterDto();
  payload.student = student;
  const saveRpt = await this.studentService.Save(payload);
  if (saveRpt.ErrorStatus) return;

  // 2) Muestra el modal con link clickeable, botón copiar, y opciones
  await Swal.fire({
    title: 'Enviar Invitación',
    html: `
      <div style="text-align:left">
        <p class="mb-2">URL de invitación:</p>
        <p class="mb-2">
          <a href="${invitationUrl}" target="_blank">${invitationUrl}</a>
        </p>
        <button id="btnCopyInvite" class="btn btn-primary" style="background:#6c757d;margin-bottom:12px">Copiar URL</button>
        <hr/>
        <p class="mb-2">¿Cómo deseas enviarla?</p>
        <div style="display:flex; gap:8px; flex-wrap:wrap">
          <button id="btnEmail" class="btn btn-primary" style="background:#2563eb">Correo</button>
          <button id="btnWsp" class="btn btn-primary" style="background:#25D366">WhatsApp</button>
          <button id="btnClose" class="btn btn-primary" style="background:#9CA3AF">Cerrar</button>
        </div>
      </div>
    `,
    showConfirmButton: false,
    didOpen: () => {
      const btnCopy = document.getElementById('btnCopyInvite')!;
      const btnEmail = document.getElementById('btnEmail')!;
      const btnWsp = document.getElementById('btnWsp')!;
      const btnClose = document.getElementById('btnClose')!;

      btnCopy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(invitationUrl);
          Swal.showValidationMessage('¡Copiado al portapapeles!');
          setTimeout(() => Swal.resetValidationMessage(), 1200);
        } catch {
          Swal.showValidationMessage('No se pudo copiar. Copia manualmente el link.');
          setTimeout(() => Swal.resetValidationMessage(), 2000);
        }
      });

      btnEmail.addEventListener('click', async () => this.openEmailMiniForm(student, invitationUrl));
      btnWsp.addEventListener('click', async () => this.openWspMiniForm(student, invitationUrl));
      btnClose.addEventListener('click', () => Swal.close());
    }
  });

  // refresca tabla
  this.filter(1);
}
  
  
  private async openEmailMiniForm(student: StudentEntity, invitationUrl: string): Promise<void> {
  const { value: formValues, isConfirmed } = await Swal.fire({
    title: 'Enviar por correo',
    html: `
      <div style="text-align:left">
        <label>Email</label>
        <input id="swalEmail" class="swal2-input" placeholder="correo@dominio.com" value="${student.Email ?? ''}">
        <label>Asunto</label>
        <input id="swalSubject" class="swal2-input" placeholder="Invitación a registro" value="Invitación a registro">
        <label>Mensaje</label>
        <textarea id="swalBody" class="swal2-textarea" rows="4"
          placeholder="Hola, aquí tienes tu enlace de invitación para registrarte">${this.defaultEmailBody(student, invitationUrl)}</textarea>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    preConfirm: () => {
      const email = (document.getElementById('swalEmail') as HTMLInputElement)?.value?.trim();
      const subject = (document.getElementById('swalSubject') as HTMLInputElement)?.value?.trim() || 'Invitación a registro';
      const body = (document.getElementById('swalBody') as HTMLTextAreaElement)?.value?.trim();
      if (!email) {
        Swal.showValidationMessage('Ingresa un correo válido');
        return;
      }
      return { email, subject, body };
    }
  });

  if (isConfirmed && formValues) {

    const dto = new EmailSendDto();
    dto.Email = formValues.email;      // <- antes: to
    dto.Subject = formValues.subject;
    dto.Body = formValues.body;

    try{
      const rpt = await this.notificationService.sendEmail(dto);

      if (!rpt.ErrorStatus) {
        Swal.fire({ icon: 'success', title: 'Correo enviado', timer: 1500, showConfirmButton: false });
      } else {
        Swal.fire({ icon: 'error', title: 'No se pudo enviar', text: rpt.Message });
      }
    }catch(e){
      console.error('Error enviando email:', e);
      Swal.fire({ icon: 'error', title: 'No se pudo enviar', text: 'Ocurrió un error inesperado.' });
    }

    
  }
}

private async openWspMiniForm(student: StudentEntity, invitationUrl: string): Promise<void> {
  const { value: phone, isConfirmed } = await Swal.fire({
    title: 'Enviar por WhatsApp',
    input: 'text',
    inputLabel: 'Número de teléfono (con código de país, p. ej. 51xxxxxxxxx)',
    inputValue: '',
    inputPlaceholder: '51xxxxxxxxx',
    showCancelButton: true,
    confirmButtonText: 'Abrir WhatsApp'
  });

  if (isConfirmed && phone) {
    const phoneClean = this.normalizePhone(phone);
    const message = this.defaultWspMessage(student, invitationUrl);
    const url = `https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    Swal.close();
  }
}

private defaultEmailBody(student: StudentEntity, invitationUrl: string): string {
  const nombre = `${student.FirstName ?? ''} ${student.LastName ?? ''}`.trim();
  return `Hola ${nombre || ''},
  
Te comparto tu enlace de invitación para registrarte en la plataforma:
${invitationUrl}

Este enlace expira en 24 horas. Si ya tienes una sesión iniciada, por favor ábrelo en una ventana de incógnito o en otro navegador.

Saludos.`;
}

private defaultWspMessage(student: StudentEntity, invitationUrl: string): string {
  const nombre = `${student.FirstName ?? ''} ${student.LastName ?? ''}`.trim();
  return `Hola ${nombre || ''}! 👋
Aquí tienes tu enlace de invitación para registrarte:
${invitationUrl}

Nota: si ya tienes sesión iniciada, ábrelo en incógnito u otro navegador. El enlace expira en 24 horas.`;
}

private normalizePhone(raw: string): string {
  // Mantén solo dígitos; si no incluye código de país, asume +51 (Perú)
  const digits = (raw || '').replace(/\D+/g, '');
  if (digits.startsWith('51')) return digits;
  if (digits.startsWith('0')) return `51${digits.slice(1)}`;
  return `51${digits}`;
}


  ngOnInit(): void {
    this.findAll(1, "");
  }
}