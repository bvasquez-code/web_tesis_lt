import { GlobalReclassificationDto } from "./GlobalReclassificationDto";

export class ExamResultDto {
  global_reclassification: GlobalReclassificationDto = new GlobalReclassificationDto();
  message: string = "";
  total_score: number = 0;
}
