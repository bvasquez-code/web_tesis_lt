// src/app/enterprise/topic/service/topic.service.ts

import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ResponseWsDto } from "src/app/enterprise/shared/model/dto/ResponseWsDto";
import { TopicRegisterDto } from "../model/dto/TopicRegisterDto";
import { ApiService } from "../../compartido/service/api.service";

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene la lista de temas de acuerdo a un criterio de búsqueda y paginación.
   * @param Query Cadena de búsqueda.
   * @param Page Número de página.
   */
  async FindAll(Query: string, Page: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/topic/findAll`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { Query, Page });
    return RespuestaWS;
  }

  /**
   * Obtiene el detalle de un tema en base a su identificador.
   * @param TopicID Identificador único del tema.
   */
  async findDetailById(TopicID: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/topic/findDetailById`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { TopicID });
    return RespuestaWS;
  }

  /**
   * Guarda o actualiza la información de un tema.
   * @param Request Objeto con la información del tema (TopicRegisterDto).
   */
  async Save(Request: TopicRegisterDto): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/topic/save`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecutePostService(url, Request);
    return RespuestaWS;
  }

  /**
   * Obtiene datos adicionales para el formulario de temas.
   * @param TopicID Identificador del tema.
   */
  async FindDataForm(TopicID: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/topic/findDataForm`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { TopicID });
    return RespuestaWS;
  }
}
