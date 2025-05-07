import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ApiService } from "../../compartido/service/api.service";
import { ResponseWsDto } from "../../shared/model/dto/ResponseWsDto";
import { PresaleRegisterDto } from "../model/dto/PresaleRegisterDto";
import { SalePaymentDto } from "../model/dto/SalePaymentDto";
import { SearchDto } from "../../shared/model/dto/SearchDto";

@Injectable({
    providedIn: 'root'
})
export class SaleService
{
    constructor(private apiService: ApiService) {
    }

    async findDataForm(SaleCod : string)
    {
        let url: string = `${AppSetting.API}/api/v1/sale/findDataForm`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecuteGetService(url,{ SaleCod : SaleCod });

        return RespuestaWS;
    }

    async AddPayment(salePayment : SalePaymentDto){
        let url: string = `${AppSetting.API}/api/v1/sale/addPayment`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecutePostService(url,salePayment);

        return RespuestaWS;
    }

    async FindAll(search : SearchDto)
    {
        let url: string = `${AppSetting.API}/api/v1/sale/findAll`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecuteGetService(url,search);

        return RespuestaWS;
    }

    async FindByDocumentCod(Id: string): Promise<ResponseWsDto> {
        let url: string = `${AppSetting.API}/api/v1/sale/findByDocumentCod`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecuteGetService(url,{ DocumentCod : Id});

        return RespuestaWS;
    }

    async FindById(Id: string): Promise<ResponseWsDto> {
        let url: string = `${AppSetting.API}/api/v1/sale/findById`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecuteGetService(url,{ SaleCod : Id});

        return RespuestaWS;
    }
}