// src/app/models/exercise-result.dto.ts
export class ExerciseResultDto {
    public ExerciseCod: string;
    public ExerciseID: number;
    public Level: number;
    public Points: number;
    public TopicID: number;
    public predicted_utility: number;
    public topic_name: string;
    public SolvedCorrectly: number;
    public CreationUser: string;
    public NumberAttempt: number;
    public userAnswer: string;
  
    constructor(data?: any) {
      this.ExerciseCod       = data?.ExerciseCod       ?? '';
      this.ExerciseID        = data?.ExerciseID        ?? 0;
      this.Level             = data?.Level             ?? 0;
      this.Points            = data?.Points            ?? 0;
      this.TopicID           = data?.TopicID           ?? 0;
      this.predicted_utility = data?.predicted_utility ?? 0;
      this.topic_name        = data?.topic_name        ?? '';
      this.SolvedCorrectly   = data?.SolvedCorrectly   ?? 0;
      this.CreationUser      = data?.CreationUser      ?? '';
      this.NumberAttempt     = data?.NumberAttempt     ?? 0;
      this.userAnswer        = data?.userAnswer        ?? '';
    }
  }
  