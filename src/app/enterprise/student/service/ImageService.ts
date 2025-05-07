// src/app/enterprise/image/service/image.service.ts

import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ResponseWsDto } from "src/app/enterprise/shared/model/dto/ResponseWsDto";
import { ApiService } from "src/app/enterprise/compartido/service/api.service";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly baseUrl = `${AppSetting.API}/api/image`;

  constructor(private apiService: ApiService) { }

  /**
   * Sube una imagen en formato Base64 al servidor.
   * @param base64Data Data URL (p.ej. "data:image/png;base64,AAA...").
   * @returns El nombre de archivo generado en el servidor.
   */
  async uploadImage(base64Data: string): Promise<ResponseWsDto> {
    const url = `${this.baseUrl}/upload`;
    // Se envía el string Base64 como body
    const respuesta: ResponseWsDto = await this.apiService.ExecutePostService(url, base64Data);
    return respuesta;
  }

  /**
   * Obtiene la imagen del servidor en Base64.
   * @param fileName Nombre del archivo que devolvió el endpoint upload.
   * @returns El Data URL completo (p.ej. "data:image/png;base64,AAA...").
   */
  async getImageBase64(fileName: string): Promise<ResponseWsDto> {
    const url = `${this.baseUrl}/view/${fileName}`;
    const respuesta: ResponseWsDto = await this.apiService.ExecuteGetService(url, {});
    return respuesta;
  }
}
