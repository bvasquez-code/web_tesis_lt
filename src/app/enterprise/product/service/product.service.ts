import { Injectable } from "@angular/core";
import { AppSetting } from "src/app/config/app.setting";
import { ApiService } from "../../compartido/service/api.service";
import { ResponseWsDto } from "../../shared/model/dto/ResponseWsDto";
import { ProductRegisterDto } from "../model/dto/ProductRegisterDto";
import { ProductPictureEntity } from "../model/entity/ProductPictureEntity";

@Injectable({
    providedIn: 'root'
})

export class ProductService
{

    constructor(private apiService: ApiService) {
    }

    async FindAll(Query : string, Page : number)
    {
        let url: string = `${AppSetting.API}/api/v1/product/findAll`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecuteGetService(url,{ Query : Query , Page : Page});

        return RespuestaWS;        
    }

    async findDetailById(ProductCod: string,StoreCod : string)
    {
        let url: string = `${AppSetting.API}/api/v1/product/findDetailById`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecuteGetService(url,{
            ProductCod : ProductCod,
            StoreCod : StoreCod
        });

        return RespuestaWS;
    }

    async Save( Request : ProductRegisterDto )
    {
        let url: string = `${AppSetting.API}/api/v1/product/save`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecutePostService(url,Request);

        return RespuestaWS;
    }

    async FindDataForm(ProductCod: string)
    {
        let url: string = `${AppSetting.API}/api/v1/product/findDataForm`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecuteGetService(url,{ ProductCod : ProductCod});

        return RespuestaWS;
    }

    async FindByBarCode(BarCode: string)
    {
        let url: string = `${AppSetting.API}/api/v1/product/findByBarCode`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecuteGetService(url,{ BarCode : BarCode});

        return RespuestaWS;
    }

    async DeletePicture(Request : ProductPictureEntity){
        let url: string = `${AppSetting.API}/api/v1/product/deletePicture`;
        let RespuestaWS : ResponseWsDto;

        RespuestaWS = await this.apiService.ExecutePostService(url,Request);

        return RespuestaWS;
    }

    
}