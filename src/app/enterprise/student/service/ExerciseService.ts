// src/app/enterprise/exercise/service/exercise.service.ts

import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ResponseWsDto } from "src/app/enterprise/shared/model/dto/ResponseWsDto";
import { ExerciseRegisterDto } from "../model/dto/ExerciseRegisterDto";
import { ApiService } from "../../compartido/service/api.service";

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene la lista de ejercicios de acuerdo a un criterio de búsqueda y paginación.
   * @param Query Cadena de búsqueda.
   * @param Page Número de página.
   */
  async FindAll(Query: string, Page: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/exercise/findAll`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { Query, Page });
    return RespuestaWS;
  }

  /**
   * Obtiene el detalle de un ejercicio en base a su identificador.
   * @param ExerciseID Identificador único del ejercicio.
   */
  async findDetailById(ExerciseID: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/exercise/findDetailById`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { ExerciseID });
    return RespuestaWS;
  }

  /**
   * Guarda o actualiza la información de un ejercicio.
   * @param Request Objeto con la información del ejercicio (ExerciseRegisterDto).
   */
  async Save(Request: ExerciseRegisterDto): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/exercise/save`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecutePostService(url, Request);
    return RespuestaWS;
  }

  /**
   * Obtiene datos adicionales para el formulario de ejercicios.
   * @param ExerciseID Identificador del ejercicio.
   */
  async FindDataForm(ExerciseID: number): Promise<ResponseWsDto> {
    const url: string = `${AppSetting.API}/api/v1/exercise/findDataForm`;
    const RespuestaWS: ResponseWsDto = await this.apiService.ExecuteGetService(url, { ExerciseID });
    return RespuestaWS;
  }
}
