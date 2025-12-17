import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { StudentService } from '../../service/StudentService';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';
import { StudentEntity } from '../../model/entity/StudentEntity';
import { ExamPointsSummaryDto } from '../../model/dto/ExamPointsSummaryDto';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';

import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';

// registrar componentes de chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-gradeevolution',
  templateUrl: './gradeevolution.component.html',
  styleUrls: ['./gradeevolution.component.css']
})
export class GradeevolutionComponent {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  public students: StudentEntity[] = [];
  public selectedStudentID: string = "";
  public examSummary: ExamPointsSummaryDto[] = [];

  private chart: Chart | null = null;
  public loadingStudents: boolean = false;
  public loadingChart: boolean = false;

  constructor(
    private studentService: StudentService,
    private dataSesionService: DataSesionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  /**
   * Carga los estudiantes creados por el usuario actual (CreationUser)
   */
  async loadStudents(): Promise<void> {
    try {
      this.loadingStudents = true;
      const creationUser: string = "perucanada";

      const rpt: ResponseWsDto = await this.studentService.findByCreationUser(creationUser);
      if (!rpt.ErrorStatus) {
        this.students = rpt.Data || [];
        if (this.students.length > 0) {
          this.selectedStudentID = this.students[0].StudentID;
          await this.loadExamSummary(this.selectedStudentID);
        }
      } else {
        this.toastr.error(rpt.Message || 'Error al cargar estudiantes');
      }
    } catch (e) {
      console.error(e);
      this.toastr.error('Error al cargar estudiantes');
    } finally {
      this.loadingStudents = false;
    }
  }

  /**
   * Evento al cambiar el alumno en el <select>
   */
  async onStudentChange(): Promise<void> {
    if (!this.selectedStudentID) { return; }
    await this.loadExamSummary(this.selectedStudentID);
  }

  /**
   * Consulta el backend para la evolución de notas del alumno
   */
  async loadExamSummary(studentId: string): Promise<void> {
    try {
      this.loadingChart = true;
      const rpt: ResponseWsDto = await this.studentService.findExamPointsSummary(studentId);
      if (!rpt.ErrorStatus) {
        this.examSummary = (rpt.Data || []) as ExamPointsSummaryDto[];

        // Ordenar por fecha de creación
        this.examSummary.sort((a, b) =>
          new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()
        );

        this.buildChart();
      } else {
        this.toastr.error(rpt.Message || 'Error al cargar evolución de notas');
      }
    } catch (e) {
      console.error(e);
      this.toastr.error('Error al cargar evolución de notas');
    } finally {
      this.loadingChart = false;
    }
  }

  /**
   * Construye / actualiza el gráfico de líneas
   */
  private buildChart(): void {
    if (!this.chartCanvas) return;

    const labels = this.examSummary.map((item, index) => {
      const date = new Date(item.creationDate);
      // Puedes ajustar el formato de fecha a tu gusto
      const formatted = date.toLocaleString(); // fecha + hora
      // Otra opción: `Examen #1`, etc.
      return `Ex ${index + 1} (${formatted})`;
    });

    const dataPoints = this.examSummary.map(item => item.pointsOnExam);

    const data: ChartData<'line'> = {
      labels,
      datasets: [
        {
          label: 'Puntaje en examen',
          data: dataPoints,
          fill: false,
          tension: 0.2
        }
      ]
    };

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Puntaje'
            },
            suggestedMax: 20 // ajusta según tu escala de notas
          },
          x: {
            ticks: {
              autoSkip: true,
              maxRotation: 45,
              minRotation: 0
            },
            title: {
              display: true,
              text: 'Intentos / Fechas de examen'
            }
          }
        }
      }
    };

    // destruir si ya existe un chart previo
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) { return; }

    this.chart = new Chart(ctx, config);
  }

}
