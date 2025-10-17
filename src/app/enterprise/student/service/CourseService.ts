import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ResponseWsDto } from "src/app/enterprise/shared/model/dto/ResponseWsDto";
import { ApiService } from "src/app/enterprise/compartido/service/api.service";
import { CourseRegisterDto } from "../model/dto/CourseRegisterDto";

@Injectable({ providedIn: 'root' })
export class CourseService {

  constructor(private apiService: ApiService) { }

  async FindAll(Query: string, Page: number): Promise<ResponseWsDto> {
    const url = `${AppSetting.API}/api/v1/course/findAll`;
    return await this.apiService.ExecuteGetService(url, { Query, Page });
  }

  async findById(Course: string): Promise<ResponseWsDto> {
    const url = `${AppSetting.API}/api/v1/course/findById`;
    return await this.apiService.ExecuteGetService(url, { Course });
  }

  async FindDataForm(Course?: string): Promise<ResponseWsDto> {
    const url = `${AppSetting.API}/api/v1/course/findDataForm`;
    return await this.apiService.ExecuteGetService(url, { Course });
  }

  async Save(Request: CourseRegisterDto): Promise<ResponseWsDto> {
    const url = `${AppSetting.API}/api/v1/course/save`;
    return await this.apiService.ExecutePostService(url, Request);
  }

  async findAllActive(): Promise<ResponseWsDto> {
    const url = `${AppSetting.API}/api/v1/course/findAllActive`;
    return await this.apiService.ExecuteGetService(url, {});
  }

  // Si luego usas carga masiva
  // async SaveAll(Request: CourseRegisterMassiveDto): Promise<ResponseWsDto> {
  //   const url = `${AppSetting.API}/api/v1/course/saveAll`;
  //   return await this.apiService.ExecutePostService(url, Request);
  // }
}
