import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { RespuestaWsDto } from '../entity/RespuestaWsDto';
import { SessionStorageDto } from '../entity/SessionStorageDto';
import { AppMenuEntity } from '../../menu/model/entity/AppMenuEntity';


@Injectable({
    providedIn: 'root'
})
export class DataSesionService {

    private g_SessionStorageDto : SessionStorageDto = new SessionStorageDto();

    constructor()
    {
        this.cargarInfoSesion();
    }

    private cargarInfoSesion()
    {
        this.g_SessionStorageDto.Token = this.ObtenerKeySesion( localStorage.getItem('Token') );
        this.g_SessionStorageDto.UserCod = this.ObtenerKeySesion( localStorage.getItem('UserCod') );
        this.g_SessionStorageDto.PersonCod = this.ObtenerKeySesion( localStorage.getItem('PersonCod') );
        this.g_SessionStorageDto.Email = this.ObtenerKeySesion( localStorage.getItem('Email') );
        this.g_SessionStorageDto.SessionID = Number(this.ObtenerKeySesion( localStorage.getItem('SessionID') ));
        this.g_SessionStorageDto.StoreCod = this.ObtenerKeySesion( localStorage.getItem('StoreCod') );
        this.g_SessionStorageDto.Names = this.ObtenerKeySesion( localStorage.getItem('Names') );
        this.g_SessionStorageDto.AppMenuPermissions = JSON.parse(this.ObtenerKeySesion( localStorage.getItem('AppMenuPermissions') ));
        this.g_SessionStorageDto.Person = JSON.parse(this.ObtenerKeySesion( localStorage.getItem('Person') ));
    }

    private ObtenerKeySesion( valor : any ) : string
    {
        if( valor)
        {
            return valor;
        }

        return "";
    }

    getSessionStorageDto()
    {
        return this.g_SessionStorageDto;
    }

    PermissionExists(MenuCod : string):boolean
    {
        let AppMenuPermissions : AppMenuEntity[] = this.getSessionStorageDto().AppMenuPermissions;
        if(AppMenuPermissions.find( e => e.MenuCod === MenuCod )){
            return true;
        }else{
            return false;
        }
    }

}