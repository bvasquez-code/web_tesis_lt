// src/app/enterprise/student-topic-performance/service/student-topic-performance.service.ts

import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ResponseWsDto } from "src/app/enterprise/shared/model/dto/ResponseWsDto";
import { StudentTopicPerformanceRegisterDto } from "../model/dto/StudentTopicPerformanceRegisterDto";
import { ApiService } from "../../compartido/service/api.service";

@Injectable({
  providedIn: 'root'
})
export class StudentTopicPerformanceService {

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene la lista de registros de desempeño de estudiantes en temas de acuerdo a un criterio de búsqueda y paginación.
   * @param Query Cadena de búsqueda.
   * @param Page Número de página.
   */
  async FindAll(Query: string, Page: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student-topic-performance/findAll`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { Query, Page });
    return RespuestaWS;
  }

  /**
   * Obtiene el detalle de un registro de desempeño en base a los identificadores StudentID y TopicID.
   * @param StudentID Identificador del alumno.
   * @param TopicID Identificador del tópico.
   */
  async findDetailById(StudentID: string, TopicID: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student-topic-performance/findDetailById`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { StudentID, TopicID });
    return RespuestaWS;
  }

  /**
   * Guarda o actualiza la información de un registro de desempeño.
   * @param Request Objeto con la información del registro (StudentTopicPerformanceRegisterDto).
   */
  async Save(Request: StudentTopicPerformanceRegisterDto): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student-topic-performance/save`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecutePostService(url, Request);
    return RespuestaWS;
  }

  /**
   * Elimina un registro de desempeño.
   * @param Request Objeto con la información del registro a eliminar (StudentTopicPerformanceRegisterDto).
   */
  async Delete(Request: StudentTopicPerformanceRegisterDto): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/student-topic-performance/delete`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecutePostService(url, Request);
    return RespuestaWS;
  }
}
