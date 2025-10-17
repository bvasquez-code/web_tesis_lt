import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { ValidationHelper } from 'src/app/enterprise/shared/helper/ValidationHelper';
import { CourseRegisterDto } from '../../model/dto/CourseRegisterDto';
import { CourseService } from '../../service/CourseService';

@Component({
  selector: 'app-createcourse',
  templateUrl: './createcourse.component.html'
})
export class CreatecourseComponent implements OnInit {

  Course: string = "";                         // PK (string)
  CourseRegister: CourseRegisterDto = new CourseRegisterDto();
  txtCourseReadonly: boolean = false;          // si es edición, Course es readonly
  validation: ValidationHelper = new ValidationHelper();
  saving = false;

  @ViewChild('txtCourse') txtCourse!: ElementRef<HTMLInputElement>;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.Course = this.route.snapshot.queryParamMap.get('Course') ?? "";
    if (this.Course) this.loadFormData(this.Course);
  }

  ngOnInit(): void {}

  async loadFormData(Course: string) {
    const rpt: ResponseWsDto = await this.courseService.FindDataForm(Course);
    if (!rpt.ErrorStatus) {
      // Se espera que en DataAdditional haya un item Name="course" con el CourseRegisterDto
      const found = rpt.DataAdditional?.find((e: any) => e.Name === "course")?.Data;
      if (found) {
        this.CourseRegister = found;
        this.txtCourseReadonly = true;
        setTimeout(() => this.populateForm(this.CourseRegister), 50);
      }
    } else {
      this.toastr.error(rpt.Message);
    }
  }

  populateForm(dto: CourseRegisterDto) {
    if (!dto) return;
    this.txtCourse.nativeElement.value = dto.course.Course;
  }

  async save() {
    // recoger valores del form
    this.CourseRegister.course.Course = this.txtCourse.nativeElement.value;

    if (!this.validate(this.CourseRegister)) return;

    this.saving = true;
    try {
      const rpt: ResponseWsDto = await this.courseService.Save(this.CourseRegister);
      if (!rpt.ErrorStatus) {
        this.toastr.success("Operación realizada con éxito.");
        this.router.navigate(['/enterprise/student/page/listcourse']);
      } else {
        this.toastr.error(rpt.Message);
      }
    } finally {
      this.saving = false;
    }
  }

  validate(dto: CourseRegisterDto): boolean {
    try {
      this.validation.validateIsNotEmpty(dto.course.Course, "Debe ingresar el nombre del curso");
      return true;
    } catch (e: any) {
      this.toastr.error(e.message);
      return false;
    }
  }
}
