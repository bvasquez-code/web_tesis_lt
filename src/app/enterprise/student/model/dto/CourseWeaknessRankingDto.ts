export class CourseWeaknessRankingDto {
    course: string = "";
    averagePerformance: number = 0;
    type : string = "";
    description : string = "";

    constructor(){
        this.course = "";
        this.averagePerformance = 0;
        this.type = "";
        this.description = "";
    }
  }