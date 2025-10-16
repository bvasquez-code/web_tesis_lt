// src/app/enterprise/exam/service/exam.service.ts

import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ResponseWsDto } from "src/app/enterprise/shared/model/dto/ResponseWsDto";
import { ApiService } from "../../compartido/service/api.service";
import { ExamRegisterDto } from "../model/dto/ExamRegisterDto";

@Injectable({
  providedIn: 'root'
})
export class ExamService {


  constructor(private apiService: ApiService) { }

  /**
   * Obtiene la lista de exámenes de acuerdo a un criterio de búsqueda y paginación.
   * @param Query Cadena de búsqueda.
   * @param Page Número de página.
   */
  async FindAll(Query: string, Page: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/exam/findAll`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { Query, Page });
    return RespuestaWS;
  }

  /**
   * Obtiene el detalle de un examen en base a su identificador.
   * @param ExamID Identificador único del examen.
   */
  async findDetailById(ExamID: string): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/exam/findDetailById`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { ExamID });
    return RespuestaWS;
  }

  /**
   * Guarda o actualiza la información de un examen.
   * @param Request Objeto con la información del examen (ExamRegisterDto).
   */
  async Save(Request: ExamRegisterDto): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/exam/save`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecutePostService(url, Request);
    return RespuestaWS;
  }

  /**
   * Obtiene datos adicionales para el formulario de exámenes.
   * @param ExamID Identificador del examen.
   */
  async FindDataForm(ExamID: string, StudentID : string, HistoryID : number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/exam/findDataForm`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { ExamID : ExamID, StudentID: StudentID, HistoryID : HistoryID });
    return RespuestaWS;
  }

  async ResolveExam(Request: any): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API_AI}/exam/submit`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecutePostService(url, Request);
    return RespuestaWS;
  }

  async getStudentWeakTopics(studentId: String): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/exam/getStudentWeakTopics`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, {studentId});
    return RespuestaWS;
  }

  async generateExamByCustomCriteria(request: any): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API_AI}/exam/submit`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecutePostService(url, Request);
    return RespuestaWS;
  }

  async generateExercises(request: any): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API_AI}/exam/generate_exercises`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecutePostService(url, request);
    return RespuestaWS;
  }

  async generateEntryExam(request: any): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API_AI}/exam/generate_entry_exam`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecutePostService(url, request);
    return RespuestaWS;
  }
  

}
