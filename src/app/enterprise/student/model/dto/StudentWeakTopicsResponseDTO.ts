import { CourseWeaknessRankingDto } from "./CourseWeaknessRankingDto";
import { ExamAttemptInfoDto } from "./ExamAttemptInfoDto";
import { IExamResultDto } from "./IExamResultDto";
import { WeakTopicDto } from "./WeakTopicDto";
export class StudentWeakTopicsResponseDTO {
    WeakestTopics: WeakTopicDto[] = [];
    CourseWeaknessRanking: CourseWeaknessRankingDto[] = [];
    ExamAttemptInfo: ExamAttemptInfoDto[] = [];
    ExamResults: IExamResultDto = new IExamResultDto();
}