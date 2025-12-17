import { CourseWeaknessRankingDto } from "./CourseWeaknessRankingDto";
import { ExamAttemptInfoDto } from "./ExamAttemptInfoDto";
import { WeakTopicDto } from "./WeakTopicDto";
export class StudentWeakTopicsResponseDTO {
    WeakestTopics: WeakTopicDto[] = [];
    CourseWeaknessRanking: CourseWeaknessRankingDto[] = [];
    ExamAttemptInfo: ExamAttemptInfoDto[] = [];
}