import { AppMenuEntity } from "../../menu/model/entity/AppMenuEntity";
import { PersonEntity } from "../../person/model/entity/PersonEntity";
import { UserProfileEntity } from "../../user/model/entity/UserProfileEntity";

export class SessionStorageDto{

    public token : string = "";
    public codUsuario : string = "";
    public codPersona : string = "";
    public desEmail : string = "";
    public nombres : string = "";
    public id_sesion : string = "";
    public cod_local : string = "";

    public Token : string = "";
    public UserCod : string = "";
    public PersonCod : string = "";
    public Email : string = "";
    public Names : string = "";
    public SessionID : number = 0;
    public StoreCod : string = "";
    public AppMenuPermissions : AppMenuEntity[] = [];
    public Person : PersonEntity = new PersonEntity();
    public UserProfile : UserProfileEntity[] = [];

    constructor()
    {
        
    }

}