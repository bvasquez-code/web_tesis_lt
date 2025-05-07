// src/app/enterprise/student-exam-history/model/dto/StudentExamHistoryRegisterDto.ts

import { StudentExamHistoryEntity } from '../entity/StudentExamHistoryEntity';

export class StudentExamHistoryRegisterDto {
  public history: StudentExamHistoryEntity;

  constructor(history?: StudentExamHistoryEntity) {
    this.history = history ? history : new StudentExamHistoryEntity();
  }
}
