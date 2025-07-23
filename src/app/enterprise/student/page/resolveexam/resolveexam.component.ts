import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExamService } from '../../service/ExamService';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';
import { ExamExerciseItemDto } from '../../model/dto/ExamExerciseItemDto';
import { StudentExamHistoryRegisterDto } from '../../model/dto/StudentExamHistoryRegisterDto';
import { StudentExamHistoryEntity } from '../../model/entity/StudentExamHistoryEntity';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ExamRegisterDto } from '../../model/dto/ExamRegisterDto';
import { ExamEntity } from '../../model/entity/ExamEntity';
import { ExamExerciseEntity } from '../../model/entity/ExamExerciseEntity';
import { ExerciseEntity } from '../../model/entity/ExerciseEntity';
import { ExamResultDto } from '../../model/dto/ExamResultDto';
import { StudentExamHistoryService } from '../../service/StudentExamHistoryService';
import { ExamSubmissionDto } from '../../model/dto/ExamSubmissionDto';

@Component({
  selector: 'app-resolveexam',
  templateUrl: './resolveexam.component.html'
})
export class ResolveexamComponent implements OnInit {

  exam: ExamEntity | null = null;
  exercises: ExamExerciseItemDto[] = [];
  examCompleted = false;
  examResult: ExamResultDto | null = null;
  studentID = '';
  currentQuestionIndex = 0; // índice de la pregunta visible
  examSubmission: ExamSubmissionDto | null = null;
  studentExamHistory : StudentExamHistoryEntity = new StudentExamHistoryEntity();
  examID: string = '';
  historyID: number = 0;

  constructor(
    private examService: ExamService,
    private historyService: StudentExamHistoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private dataSesionService: DataSesionService
  ) {
    this.studentID = this.dataSesionService.getSessionStorageDto().UserCod;
  }

  ngOnInit(): void {
    const examID = this.route.snapshot.queryParamMap.get('ExamID');
    const historyID = this.route.snapshot.queryParamMap.get('HistoryID');
    if (historyID) {
      this.historyID = Number(historyID);
    }
    if (examID) {
      this.examID = examID;
      this.loadExamData(examID, this.studentID,this.historyID);
    }
  }

  private async loadExamData(examID: string,StudentID : string, historyID : number): Promise<void> {
    try {
      const resp: ResponseWsDto = await this.examService.FindDataForm(examID,StudentID,historyID);
      if (!resp.ErrorStatus) {
        const examAdd = resp.DataAdditional.find(d => d.Name === 'exam');
        const exercisesAdd = resp.DataAdditional.find(d => d.Name === 'exercisesDataInfo');
        const studentExamHistory = resp.DataAdditional.find(d => d.Name === 'studentExamHistory');

        if (examAdd && exercisesAdd) {
          const reg: ExamRegisterDto = examAdd.Data;
          this.exam = reg.exam;
          const examExercises: ExamExerciseEntity[] = reg.examExercises;
          const infos: ExerciseEntity[] = exercisesAdd.Data;
          this.exercises = examExercises.map(exE => {
            const info = infos.find(e => e.ExerciseID === exE.ExerciseID)!;
            return new ExamExerciseItemDto(exE, info);
          });
        }
        if (studentExamHistory) {
          const history: StudentExamHistoryEntity = studentExamHistory.Data;
          this.studentExamHistory = history;
          this.examSubmission = new ExamSubmissionDto();
          this.examSubmission.ExamID = history.ExamID;
          this.examSubmission.StudentID = history.StudentID;

          const JsonDataExam = JSON.parse(history.JsonDataExam);

          if(JsonDataExam) {
            this.examSubmission.results = JsonDataExam.results;
          }

          this.examSubmission.results.forEach((item: any) => {
            const exercise = this.exercises.find(e => e.exercise.ExerciseID === item.ExerciseID);
            if (exercise) {
              exercise.userAnswer = item.userAnswer;
            }
          });
          this.currentQuestionIndex = this.examSubmission.results.filter((item: any) => item.userAnswer ).length;
          this.examCompleted = history.IsCompleted === 1;

        }
      } else {
        this.toastr.error(resp.Message, 'Error al cargar examen');
      }
    } catch(e) {
      console.error(e);
      this.toastr.error('Error en la carga del examen');
    }
  }

  /** Confirma la respuesta actual y avanza a la siguiente */
  async confirmAnswer(item: ExamExerciseItemDto): Promise<void> {
    // respaldo parcial idéntico al ejemplo anterior...
    const results = this.exercises.map(it => ({
      ExerciseCod: it.exercise.ExerciseCod,
      ExerciseID: it.examExercise.ExerciseID,
      Level: it.exercise.Level,
      Points: it.examExercise.Points,
      TopicID: it.examExercise.TopicID,
      predicted_utility: 0.5,
      topic_name: it.exercise.ExerciseCod,
      SolvedCorrectly: (it.userAnswer?.trim() === it.exercise.CorrectAnswer?.trim()) ? 1 : 0,
      CreationUser: this.studentID,
      NumberAttempt: 1,
      userAnswer: it.userAnswer
    }));
    const payload = {
      ExamID: this.exam!.ExamID,
      StudentID: this.studentID,
      results
    };
    const histDto = new StudentExamHistoryRegisterDto();
    const hist = new StudentExamHistoryEntity();
    hist.StudentID     = this.studentID;
    hist.ExamID        = this.exam!.ExamID;
    hist.HistoryID     = this.studentExamHistory.HistoryID;
    hist.AttemptNumber = 1;
    hist.IsCompleted   = 0;
    hist.JsonDataExam  = JSON.stringify(payload);
    histDto.history    = hist;

    try {
      const r = await this.historyService.Save(histDto);
      if (!r.ErrorStatus) {
        this.toastr.success('Respuesta confirmada y progreso guardado.', 'Respaldo');
      } else {
        this.toastr.error(r.Message, 'Error al guardar progreso');
      }
    } catch {
      this.toastr.error('No se pudo guardar el progreso.', 'Error');
    }

    // Avanzar a la siguiente pregunta
    if (this.currentQuestionIndex < this.exercises.length - 1) {
      this.currentQuestionIndex++;
    } else {
      // última pregunta: enviar examen completo
      this.submitExam();
    }
  }

  /** Envía el examen completo */
  async submitExam(): Promise<void> {
    const results = this.exercises.map(it => ({
      ExerciseCod: it.exercise.ExerciseCod,
      ExerciseID: it.examExercise.ExerciseID,
      Level: it.exercise.Level,
      Points: it.examExercise.Points,
      TopicID: it.examExercise.TopicID,
      predicted_utility: 0.5,
      topic_name: it.exercise.ExerciseCod,
      SolvedCorrectly: (it.userAnswer?.trim() === it.exercise.CorrectAnswer?.trim()) ? 1 : 0,
      CreationUser: this.studentID,
      NumberAttempt: 1,
      userAnswer: it.userAnswer
    }));
    const req = { 
      ExamID: this.exam!.ExamID, 
      StudentID: this.studentID, 
      HistoryID: this.studentExamHistory.HistoryID,
      results 
    };
    try {
      const resp: ResponseWsDto = await this.examService.ResolveExam(req);
      if (!resp.ErrorStatus) {
        this.examResult = resp.Data;
        this.examCompleted = true;
      } else {
        this.toastr.error(resp.Message, 'Error al enviar examen');
      }
    } catch {
      this.toastr.error('Error en el envío del examen');
    }
  }

  getImageUrl(item: ExamExerciseItemDto): string {
    return item.exercise.ImagePath;
  }
}
