import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { lastValueFrom, Observable, of, throwError } from 'rxjs';
import { RespuestaWsDto } from '../entity/RespuestaWsDto';
import { ResponseWsDto } from '../../shared/model/dto/ResponseWsDto';
import { SessionStorageDto } from '../entity/SessionStorageDto';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
         private http: HttpClient,
         private router: Router,
    ){}

    private generateHeaders(): HttpHeaders {
        const token = localStorage.getItem('Token');
        if (!token) {
          this.router.navigate(['/login']);
        }
        return new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token ? token : ''
        });
    }

    private generateHeadersAnonimo(): HttpHeaders {
      const token = localStorage.getItem('Token');
      if (!token) {
        this.router.navigate(['/login']);
      }
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
  }

    public get<T>(url: string, paramsObj?: any): Observable<T> {
        let params = new HttpParams();
        if (paramsObj) {
          for (const key in paramsObj) {
            if (paramsObj.hasOwnProperty(key)) {
              params = params.append(key, paramsObj[key]);
            }
          }
        }
        return this.http.get<T>(url, { headers: this.generateHeaders(), params })
          .pipe(catchError(this.handleError));
    }

    public post<T>(url: string, body: any): Observable<T> {
        return this.http.post<T>(url, body, { headers: this.generateHeaders() })
          .pipe(catchError(this.handleError));
    }

    public postAnonimo<T>(url: string, body: any): Observable<T> {
      return this.http.post<T>(url, body, { headers: this.generateHeadersAnonimo() })
        .pipe(catchError(this.handleError));
  }

    private handleError(error: any) {
        console.error('API Service Error:', error);
        return throwError(() => error);
    }

    public async executePostService<T>(url: string, body: any): Promise<T> {
        try {
          const response = await lastValueFrom(this.post<T>(url, body));
          return response;
        } catch (error) {
          console.error('Error in executePostService', error);
          throw error;
        }
    }

    public async executeGetService<T>(url: string, paramsObj?: any): Promise<T> {
        try {
          const response = await lastValueFrom(this.get<T>(url, paramsObj));
          return response;
        } catch (error) {
          console.error('Error in executeGetService', error);
          throw error;
        }
    }


    async ExecutePostService(URL: string, Request : any):Promise<ResponseWsDto>
    {
        let RespuestaWS : ResponseWsDto = new ResponseWsDto();

        RespuestaWS = await this.executePostService<ResponseWsDto>(URL,Request);

        return RespuestaWS;
    }

    async ExecuteGetService(URL: string, Request : any):Promise<ResponseWsDto>
    {
        let RespuestaWS : ResponseWsDto = new ResponseWsDto();

        RespuestaWS = await this.executeGetService<ResponseWsDto>(URL,Request);

        return RespuestaWS;
    }

    async ExecutePostServiceLogin(URL: string, Request : any, URLDataLogin : string)
    {
        try {
            const loginResponse: any = await lastValueFrom(this.post<any>(URL, Request));
            if (loginResponse && loginResponse.token) {
              localStorage.setItem('Token', `Bearer ${loginResponse.token}`);
              
              const sessionResponse: ResponseWsDto = await lastValueFrom(this.get<ResponseWsDto>(URLDataLogin));
              if (!sessionResponse.ErrorStatus) {
                let sessionData : SessionStorageDto = sessionResponse.Data;
                localStorage.setItem('UserCod', sessionData.UserCod);
                localStorage.setItem('PersonCod', sessionData.PersonCod);
                localStorage.setItem('Email', sessionData.Email);
                localStorage.setItem('SessionID', sessionData.SessionID.toString());
                localStorage.setItem('Names', sessionData.Names);
                localStorage.setItem('StoreCod', sessionData.StoreCod);
                localStorage.setItem('AppMenuPermissions', JSON.stringify(sessionData.AppMenuPermissions));
                location.reload();
              } else {
                console.error('Session error:', sessionResponse.Message);
              }
            }
          } catch (error) {
            console.error('Error in executeLogin', error);
            throw error;
          }
    }

    async ExecutePostServiceAnonimo(URL: string, Request : any):Promise<ResponseWsDto>
    {
        try {
          const response : ResponseWsDto = await lastValueFrom(this.postAnonimo<ResponseWsDto>(URL, Request));
          return response;
        } catch (error) {
          console.error('Error in executePostService', error);
          throw error;
        }
    }

}