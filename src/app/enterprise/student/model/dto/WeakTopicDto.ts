export class WeakTopicDto {
    TopicID: number = 0;
    TopicName: string = "";
    Course: string = "";
    AveragePoints: number = 0;
    TotalAttempts: number = 0;
    FailureRate: number = 0;
    CompositeScore: number = 0;

    constructor(){
        this.TopicID = 0;
        this.TopicName = "";
        this.Course = "";
        this.AveragePoints = 0;
        this.TotalAttempts = 0;
        this.FailureRate = 0;
        this.CompositeScore = 0;
    }
}
  