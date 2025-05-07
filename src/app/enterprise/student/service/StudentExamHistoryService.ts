// src/app/enterprise/student-exam-history/service/student-exam-history.service.ts

import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ResponseWsDto } from "src/app/enterprise/shared/model/dto/ResponseWsDto";
import { StudentExamHistoryRegisterDto } from "../model/dto/StudentExamHistoryRegisterDto";
import { ApiService } from "../../compartido/service/api.service";

@Injectable({
  providedIn: 'root'
})
export class StudentExamHistoryService {

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene la lista de intentos de examen de acuerdo a un criterio de búsqueda y paginación.
   * @param Query Cadena de búsqueda.
   * @param Page Número de página.
   */
  async FindAll(Query: string, Page: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student-exam-history/findAll`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { Query, Page });
    return RespuestaWS;
  }

  /**
   * Obtiene el detalle de un intento de examen en base a su identificador.
   * @param HistoryID Identificador único del intento.
   */
  async findDetailById(HistoryID: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student-exam-history/findDetailById`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { HistoryID });
    return RespuestaWS;
  }

  /**
   * Guarda o actualiza la información de un intento de examen.
   * @param Request Objeto con la información del intento (StudentExamHistoryRegisterDto).
   */
  async Save(Request: StudentExamHistoryRegisterDto): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student-exam-history/save`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecutePostService(url, Request);
    return RespuestaWS;
  }

  /**
   * Obtiene datos adicionales para el formulario de intentos de examen.
   * @param HistoryID Identificador del intento.
   */
  async FindDataForm(HistoryID: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student-exam-history/findDataForm`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { HistoryID });
    return RespuestaWS;
  }

   /**
   * Obtiene el historial de exámenes para un estudiante en particular.
   * @param StudentID Identificador del alumno.
   */
   async findByStudentID(StudentID: string): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student-exam-history/findByStudentID`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { StudentID });
    return RespuestaWS;
  }
}
