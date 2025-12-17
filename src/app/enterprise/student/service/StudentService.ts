// src/app/enterprise/student/service/student.service.ts

import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ResponseWsDto } from "src/app/enterprise/shared/model/dto/ResponseWsDto";
import { ApiService } from "../../compartido/service/api.service";
import { StudentRegisterDto } from "../model/dto/StudentRegisterDto";
import { StudentRegisterWithUserDto } from "../model/dto/StudentRegisterWithUserDto";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene la lista de estudiantes de acuerdo a un criterio de búsqueda y paginación.
   * @param Query Cadena de búsqueda.
   * @param Page Número de página.
   */
  async FindAll(Query: string, Page: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student/findAll`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { Query: Query, Page: Page });
    return RespuestaWS;
  }

  /**
   * Obtiene el detalle de un estudiante en base a su identificador.
   * @param StudentID Identificador único del estudiante.
   */
  async findDetailById(StudentID: string): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student/findDetailById`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { StudentID: StudentID });
    return RespuestaWS;
  }

  /**
   * Guarda o actualiza la información de un estudiante.
   * @param Request Objeto con la información del estudiante (StudentRegisterDto).
   */
  async Save(Request: StudentRegisterDto): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student/save`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecutePostService(url, Request);
    return RespuestaWS;
  }

  /**
   * Obtiene datos adicionales para el formulario de estudiante.
   * @param StudentID Identificador del estudiante (opcional, según requerimiento).
   */
  async FindDataForm(StudentID: string): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student/findDataForm`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { StudentID: StudentID });
    return RespuestaWS;
  }

  async registerStudent(dto: StudentRegisterWithUserDto): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student/registerStudent`;
    const response: ResponseWsDto = await this.apiService.ExecutePostServiceAnonimo(url, dto);
    return response;
  }

  async checkHistory(studentId: String): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student/checkHistory`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { StudentID: studentId });
    return RespuestaWS;
  }

  async findByCreationUser(CreationUser: string): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student/findByCreationUser`;
    const res: ResponseWsDto = await this.apiService.ExecuteGetService(url, { CreationUser });
    return res;
  }

  /**
   * Resumen de puntos por examen de un estudiante.
   * GET /api/v1/student/findExamPointsSummary?StudentID=ST00015
   */
  async findExamPointsSummary(StudentID: string): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student/findExamPointsSummary`;
    const res: ResponseWsDto = await this.apiService.ExecuteGetService(url, { StudentID });
    return res;
  }
}
