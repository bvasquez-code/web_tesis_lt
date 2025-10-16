import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ExamService } from '../../service/ExamService';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';

import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ExamRegisterDto } from '../../model/dto/ExamRegisterDto';
import { ExamEntity } from '../../model/entity/ExamEntity';
import { ExamExerciseEntity } from '../../model/entity/ExamExerciseEntity';
import { ExerciseEntity } from '../../model/entity/ExerciseEntity';
import { ExamExerciseItemDto } from '../../model/dto/ExamExerciseItemDto';
import { StudentExamHistoryEntity } from '../../model/entity/StudentExamHistoryEntity';

@Component({
  selector: 'app-examstudentreview',
  templateUrl: './examstudentreview.component.html',
  styleUrls: ['./examstudentreview.component.css']
})
export class ExamstudentreviewComponent implements OnInit {

  // Datos base
  exam: ExamEntity | null = null;
  items: ExamExerciseItemDto[] = [];

  // Filas para la vista de revisión
  viewRows: Array<{
    idx: number;
    exerciseCod: string;
    points: number;
    userAnswer?: string;
    correctAnswer?: string;
    isCorrect: boolean;
    imageUrl?: string;
    earnedPoints: number; // puntos obtenidos por pregunta
  }> = [];

  // Totales / Nota
  totalPointsPossible = 0;
  totalScore = 0;       // suma de earnedPoints
  numCorrect = 0;
  numQuestions = 0;
  percent = 0;

  loading = false;

  private studentID = '';
  private history?: StudentExamHistoryEntity;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private dataSesion: DataSesionService,
    private toastr: ToastrService
  ) {
    this.studentID = this.dataSesion.getSessionStorageDto().UserCod;
  }

  ngOnInit(): void {
    const examID = this.route.snapshot.queryParamMap.get('ExamID');
    const historyID = this.route.snapshot.queryParamMap.get('HistoryID');

    if (!examID) {
      this.toastr.error('Falta parámetro ExamID');
      return;
    }
    const histNum = historyID ? Number(historyID) : 0;
    this.load(examID, this.studentID, histNum);
  }

  private normalize(v?: string | any) {
    return v ? v.trim().toUpperCase() : undefined;
  }

  private async load(examID: string, studentID: string, historyID: number): Promise<void> {
    this.loading = true;
    try {
      // Trae examen + ejercicios + historial del alumno
      const resp: ResponseWsDto = await this.examService.FindDataForm(examID, studentID, historyID);
      if (resp?.ErrorStatus) {
        this.toastr.error(resp.Message || 'Error al cargar los datos');
        return;
      }

      const examAdd = resp?.DataAdditional?.find((d: any) => d.Name === 'exam');
      const exercisesAdd = resp?.DataAdditional?.find((d: any) => d.Name === 'exercisesDataInfo');
      const studentExamHistory = resp?.DataAdditional?.find((d: any) => d.Name === 'studentExamHistory');

      if (!examAdd?.Data || !exercisesAdd?.Data) {
        this.toastr.warning('No se encontraron datos de examen o ejercicios.');
        return;
      }

      const reg: ExamRegisterDto = examAdd.Data;
      this.exam = reg.exam;

      const examExercises: ExamExerciseEntity[] = reg.examExercises || [];
      const infos: ExerciseEntity[] = exercisesAdd.Data || [];

      this.items = examExercises.map(exE => {
        const info = infos.find(e => e.ExerciseID === exE.ExerciseID)!;
        return new ExamExerciseItemDto(exE, info);
      });

      // Recupera lo que marcó el alumno desde el historial (JsonDataExam)
      let savedResults: any[] = [];
      if (studentExamHistory?.Data) {
        this.history = studentExamHistory.Data as StudentExamHistoryEntity;
        if (this.history?.JsonDataExam) {
          try {
            const parsed = JSON.parse(this.history.JsonDataExam);
            if (parsed?.results?.length) savedResults = parsed.results;
          } catch {
            // JSON inválido: lo ignoramos sin romper la vista
          }
        }
      }

      this.buildView(savedResults);
    } catch (e) {
      console.error(e);
      this.toastr.error('Error inesperado al cargar la vista');
    } finally {
      this.loading = false;
    }
  }

  private buildView(savedResults: any[]): void {
    // Índice de respuestas del estudiante por ExerciseID
    const mapUserAns = new Map<number, string>();
    for (const r of savedResults) {
      if (r?.ExerciseID != null) {
        mapUserAns.set(Number(r.ExerciseID), this.normalize(r.userAnswer));
      }
    }

    // Construir filas de la vista (con puntos obtenidos)
    this.viewRows = this.items.map((it, idx) => {
      const userAns = mapUserAns.get(it.examExercise.ExerciseID);
      const correct = this.normalize(it.exercise.CorrectAnswer);
      const isCorrect = !!userAns && !!correct && userAns === correct;
      const pts = it.examExercise.Points || 0;

      return {
        idx: idx + 1,
        exerciseCod: it.exercise.ExerciseCod,
        points: pts,
        userAnswer: userAns,
        correctAnswer: correct,
        isCorrect,
        imageUrl: it.exercise.ImagePath,
        earnedPoints: isCorrect ? pts : 0
      };
    });

    // Totales / Nota
    this.totalPointsPossible = this.viewRows.reduce((acc, r) => acc + (r.points || 0), 0);
    this.totalScore = this.viewRows.reduce((acc, r) => acc + r.earnedPoints, 0);
    this.numCorrect = this.viewRows.filter(r => r.isCorrect).length;
    this.numQuestions = this.viewRows.length;
    this.percent = this.numQuestions ? Math.round((this.numCorrect / this.numQuestions) * 100) : 0;
  }

  trackByRow = (_: number, r: any) => r.exerciseCod;

  getBadgeClass(r: { isCorrect: boolean }) {
    return r.isCorrect ? 'badge-ok' : 'badge-bad';
  }
}
