import { StudentEntity } from "../entity/StudentEntity";

export class StudentRegisterWithUserDto {
    public student: StudentEntity = new StudentEntity();
    public password: string = "";
    public documentType: string = "";
    public documentNum: string = "";
    public ubigeoCod: string = "";
    public cellPhone: string = "";
  }