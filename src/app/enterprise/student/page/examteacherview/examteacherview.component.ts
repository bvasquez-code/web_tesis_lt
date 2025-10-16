import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExamService } from '../../service/ExamService';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ExamRegisterDto } from '../../model/dto/ExamRegisterDto';
import { ExamEntity } from '../../model/entity/ExamEntity';
import { ExamExerciseEntity } from '../../model/entity/ExamExerciseEntity';
import { ExerciseEntity } from '../../model/entity/ExerciseEntity';
import { ExamExerciseItemDto } from '../../model/dto/ExamExerciseItemDto';

@Component({
  selector: 'app-examteacherview',
  templateUrl: './examteacherview.component.html',
  styleUrls: ['./examteacherview.component.css']
})
export class ExamteacherviewComponent implements OnInit {

  exam: ExamEntity | null = null;
  items: ExamExerciseItemDto[] = [];
  loading = false;
  showAnswers = true;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const examID = this.route.snapshot.queryParamMap.get('ExamID');
    if (!examID) {
      this.toastr.error('Falta parámetro ExamID');
      return;
    }
    this.loadExam(examID);
  }

  private async loadExam(examID: string): Promise<void> {
    this.loading = true;
    try {
      const resp: ResponseWsDto = await this.examService.FindDataForm(examID, '', 0);
      if (resp?.ErrorStatus) {
        this.toastr.error(resp.Message || 'Error al cargar examen');
        return;
      }
      const examAdd = resp?.DataAdditional?.find((d: any) => d.Name === 'exam');
      const exercisesAdd = resp?.DataAdditional?.find((d: any) => d.Name === 'exercisesDataInfo');

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
    } catch (e) {
      console.error(e);
      this.toastr.error('Error inesperado al cargar el examen');
    } finally {
      this.loading = false;
    }
  }

  trackByExercise = (_: number, it: ExamExerciseItemDto) => it.examExercise.ExerciseID;

  getImageUrl(it: ExamExerciseItemDto): string {
    return it.exercise.ImagePath;
  }
}
