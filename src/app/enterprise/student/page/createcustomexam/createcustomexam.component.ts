import { Component, OnInit } from '@angular/core';
import { WeakTopicDto } from '../../model/dto/WeakTopicDto';
import { ExamService } from '../../service/ExamService';
import { ToastrService } from 'ngx-toastr';
import { CourseWeaknessRankingDto } from '../../model/dto/CourseWeaknessRankingDto';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';
import { ExamAttemptInfoDto } from '../../model/dto/ExamAttemptInfoDto';
import { StudentWeakTopicsResponseDTO } from '../../model/dto/StudentWeakTopicsResponseDTO';
import { GenerateExercisesRequestDto } from '../../model/dto/GenerateExercisesRequestDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createcustomexam',
  templateUrl: './createcustomexam.component.html',
  styleUrls: ['./createcustomexam.component.css']
})
export class CreatecustomexamComponent implements OnInit {

  examMode: string = "course";
  selectedCourse: string = "";
  selectedTopics: number[] = [];

  studentWeakTopics: StudentWeakTopicsResponseDTO = new StudentWeakTopicsResponseDTO();

  selectedAttemptCourse: string = "";

  public trigonometria = 100;
  public aritmetica = 30;
  public geometria = 75;
  public algebra = 0;
  public velocidadResolucion = 100;
  public precisionResolucion = 85;

  // Esta propiedad recibirá el clip-path dinámico
  public radarClipPath = '';

  json = {
    data: [
      { key: 'fuerza', value: 30 },
      { key: 'velocidad', value: 70 }
    ]
  };

  constructor(
    private examService: ExamService,
    private toastr: ToastrService,
    private dataSesionService: DataSesionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStudentWeakTopics();
  }

  async loadStudentWeakTopics(): Promise<void> {
    try {
      const userCod = this.dataSesionService.getSessionStorageDto().UserCod;
      const response = await this.examService.getStudentWeakTopics(userCod);
      if (!response.ErrorStatus) {
        const data: StudentWeakTopicsResponseDTO = response.Data;
        this.studentWeakTopics = response.Data;
        if (this.studentWeakTopics.CourseWeaknessRanking.length > 0) {
          this.selectedAttemptCourse = this.studentWeakTopics.CourseWeaknessRanking[0].course;
        }


        for (const course of this.studentWeakTopics.CourseWeaknessRanking) {
          if (course.course == "trigonometria") {
            this.trigonometria = course.averagePerformance;
          }
          if (course.course == "aritmetica") {
            this.aritmetica = course.averagePerformance;
          }
          if (course.course == "geometria") {

            this.geometria = course.averagePerformance;
          }
          if (course.course == "algebra") {
            this.algebra = course.averagePerformance;
          }
          if (course.course == "velocidadResolucion") {
            this.velocidadResolucion = course.averagePerformance;
          }
          if (course.course == "precisionResolucion") {
            this.precisionResolucion = course.averagePerformance;
          }
        }
        this.setMetrics();
      } else {
        this.toastr.error(response.Message, "Error al cargar datos de temas débiles");
      }
    } catch (error) {
      console.error(error);
      this.toastr.error("Error en la carga de datos de temas débiles", "Error");
    }
  }

  get lowCoursePerformance(): boolean {
    return this.studentWeakTopics.CourseWeaknessRanking && this.studentWeakTopics.CourseWeaknessRanking.some(c => c.averagePerformance < 5);
  }

  get highTopicFailure(): boolean {
    return this.studentWeakTopics.WeakestTopics && this.studentWeakTopics.WeakestTopics.some(t => t.FailureRate >= 1);
  }

  get filteredExamAttemptInfo(): ExamAttemptInfoDto[] {
    if (!this.selectedAttemptCourse) {
      return this.studentWeakTopics.ExamAttemptInfo;
    }
    return this.studentWeakTopics.ExamAttemptInfo.filter(info => info.course.toLowerCase() === this.selectedAttemptCourse.toLowerCase());
  }

  async generateEntryExam(): Promise<void> {
    // Obtenemos el student_id desde la sesión
    const studentId = this.dataSesionService.getSessionStorageDto().UserCod;

    // Construir el request usando el DTO GenerateExercisesRequestDto
    const requestDto: any = { student_id: studentId };



    try {
      // Llamada al endpoint de generación de ejercicios a través del servicio
      const response = await this.examService.generateEntryExam(requestDto);
      if (!response.ErrorStatus) {
        this.toastr.success("Examen generado exitosamente.", "Éxito");
        console.log("Examen generado:", response.Data); // Aquí response.Data se ajusta a GenerateExercisesResponseDto

        const examId = response.Data.ExamID;
        // Utilizando el router para redirigir a la ruta deseada
        this.router.navigate([`/enterprise/student/page/resolveexam`], { queryParams: { ExamID: examId } });

      } else {
        this.toastr.error(response.Message, "Error");
      }
    } catch (error) {
      console.error(error);
      this.toastr.error("Error al generar el examen.", "Error");
    }
  }


  onTopicChange(event: any): void {
    const topicId = +event.target.value;
    if (event.target.checked) {
      if (this.selectedTopics.indexOf(topicId) === -1) {
        this.selectedTopics.push(topicId);
      }
    } else {
      this.selectedTopics = this.selectedTopics.filter(id => id !== topicId);
    }
  }



  async onGenerateExamForAttempt(info: ExamAttemptInfoDto): Promise<void> {
    console.log("Generar examen para:", info);

    let topics: string[] = [String(info.topicID)];
    await this.generateExercises(topics);
  }

  async onGenerateExam(): Promise<void> {

    let topics: string[] = [];

    if (this.examMode === 'course') {
      topics = this.studentWeakTopics.ExamAttemptInfo.filter(info => info.course.toLowerCase() === this.selectedCourse.toLowerCase())
        .map(info => { return String(info.topicID); });
    } else {
      topics = this.selectedTopics.map(String);
    }

    await this.generateExercises(topics);

  }

  async generateExercises(topics: string[]): Promise<void> {
    // Obtenemos el student_id desde la sesión
    const studentId = this.dataSesionService.getSessionStorageDto().UserCod;

    // Construir el request usando el DTO GenerateExercisesRequestDto
    const requestDto = new GenerateExercisesRequestDto();
    requestDto.student_id = studentId;
    requestDto.limit = 10;
    requestDto.total_points = 20;
    requestDto.topics = topics;

    try {
      // Llamada al endpoint de generación de ejercicios a través del servicio
      const response = await this.examService.generateExercises(requestDto);
      if (!response.ErrorStatus) {
        this.toastr.success("Examen generado exitosamente.", "Éxito");
        console.log("Examen generado:", response.Data); // Aquí response.Data se ajusta a GenerateExercisesResponseDto

        const examId = response.Data.ExamID;
        // Utilizando el router para redirigir a la ruta deseada
        this.router.navigate([`/enterprise/student/page/resolveexam`], { queryParams: { ExamID: examId } });

      } else {
        this.toastr.error(response.Message, "Error");
      }
    } catch (error) {
      console.error(error);
      this.toastr.error("Error al generar el examen.", "Error");
    }
  }



  existsTopicHistory(): boolean {
    return !!(
      this.studentWeakTopics.CourseWeaknessRanking?.length ||
      this.studentWeakTopics.WeakestTopics?.length
    );
  }

  private setMetrics(): void {
    // … tu asignación de trigonometria, aritmetica, etc. …
    this.computeRadarClipPath();
  }

  /**
   * Calcula la cadena clip-path para un radar de 6 ejes
   * según los valores en 0–100 de cada métrica.
   */
  private computeRadarClipPath(): void {
    // Array con tus 6 valores en el orden de los vértices
    const vals = [
      this.precisionResolucion,
      this.velocidadResolucion,
      this.geometria,
      this.algebra,
      this.aritmetica,
      this.trigonometria
    ];
    // Ángulos (radianes) para cada eje, empezando arriba y girando en el sentido de las agujas
    const angles = [
      -Math.PI / 2,     // arriba
      -Math.PI / 6,     // arriba-dcha
      Math.PI / 6,     // abajo-dcha superior
      Math.PI / 2,     // abajo
      5 * Math.PI / 6, // abajo-izq superior
      7 * Math.PI / 6  // arriba-izq
    ];
    const points = angles.map((angle, i) => {
      // radio proporcional: 0.5 = 50% de la mitad del ancho
      const r = vals[i] / 100 * 0.5;
      // Coordenadas relativas en porcentaje (0–100)
      const x = 50 + Math.cos(angle) * r * 100;
      const y = 50 + Math.sin(angle) * r * 100;
      return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
    });
    this.radarClipPath = `polygon(${points.join(', ')})`;
  }






}