import { environment } from '../../environments/environment';

export class AppSetting{

    public static API_SERVER: string = environment.name;
    public static API: string =  `${environment.settings.backend}`;
    public static API_AI: string =  `${environment.settings.backend_ia}`;
    public static APICupones: string =  `${environment.settings.backend}/api/v1/carga-cupon`;

}