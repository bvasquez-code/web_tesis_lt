import { StudentEntity } from "../entity/StudentEntity";

export class StudentRegisterDto{

    public student :  StudentEntity;

    public constructor(){
        this.student = new StudentEntity();
    }

}