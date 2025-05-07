import { StudentTopicPerformanceEntity } from '../entity/StudentTopicPerformanceEntity';

export class StudentTopicPerformanceRegisterDto {
  public performance: StudentTopicPerformanceEntity;

  constructor(performance?: StudentTopicPerformanceEntity) {
    this.performance = performance ? performance : new StudentTopicPerformanceEntity();
  }
}
