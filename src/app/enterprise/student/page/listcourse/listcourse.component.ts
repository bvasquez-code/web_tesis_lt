import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionTableService } from 'src/app/enterprise/shared/interface/ActionTableService';
import { DataTablaGeneticDto } from 'src/app/enterprise/shared/model/dto/DataTablaGeneticDto';
import { ResponsePageSearch } from 'src/app/enterprise/shared/model/dto/ResponsePageSearch';
import { RowActionEvent } from 'src/app/enterprise/shared/model/dto/RowActionEvent';
import { AlertService } from 'src/app/enterprise/compartido/service/AlertService';

import { CourseEntity } from '../../model/entity/CourseEntity';
import { CourseRegisterDto } from '../../model/dto/CourseRegisterDto';
import { CourseService } from '../../service/CourseService';

@Component({
  selector: 'app-listcourse',
  templateUrl: './listcourse.component.html'
})
export class ListcourseComponent implements OnInit, ActionTableService<CourseEntity> {

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;

  responsePageSearch: ResponsePageSearch<CourseEntity> = new ResponsePageSearch();
  dataTablaGenetic: DataTablaGeneticDto<CourseEntity> = new DataTablaGeneticDto();

  constructor(
    private courseService: CourseService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.findAll(1, "");
  }

  loadingTable(responsePageSearch: ResponsePageSearch<CourseEntity>): void {
    const data = new DataTablaGeneticDto<CourseEntity>();

    const viewButtonDelete = (item: CourseEntity) => item.Status === "Active";
    const viewButtonActive = (item: CourseEntity) => item.Status === "Inactive";

    data.init(
      [
        { Name: "Course", key: "Course" },
        { Name: "Modification", key: "ModifyDate", IsDate: true },
        {
          Name: "Status",
          key: "Status",
          IsStatus: true,
          Html: {
            Active: 'badge badge-sm bgc-info-d1 text-white pb-1 px-25',
            Inactive: 'badge badge-sm bgc-red-d1 text-white pb-1 px-25'
          }
        },
        {
          Name: "Options",
          ColumnAction: true,
          Id: ["Course"],
          Options: [
            { Type: "Url", Name: "fa fa-pencil-alt", Url: "/enterprise/student/page/createcourse?Course={Course}" },
            { Type: "Action", Name: "fa fa-trash-alt", Url: "#", ID: "delete", Function: viewButtonDelete },
            { Type: "Action", Name: "fa fa-check", Url: "#", ID: "active", Function: viewButtonActive }
          ]
        }
      ],
      { data: responsePageSearch },
      "Course List"
    );

    this.dataTablaGenetic = data;
  }

  filter(Page: number): void {
    const Query = this.txtSearch?.nativeElement?.value || "";
    this.findAll(Page, Query);
  }

  async findAll(Page: number, Query: string): Promise<void> {
    const rpt = await this.courseService.FindAll(Query, Page);
    if (!rpt.ErrorStatus) {
      this.responsePageSearch = rpt.Data;
      if (this.responsePageSearch.resultSearch?.length) {
        for (const e of this.responsePageSearch.resultSearch) {
          e.Status = e.Status === "A" ? "Active" : "Inactive";
        }
      }
      this.loadingTable(this.responsePageSearch);
    }
  }

  getDataRow(item: CourseEntity): void { /* opcional */ }

  actionRowEvent(event: RowActionEvent<CourseEntity>): void {
    if (event.optionId === "delete") {
      this.inactivateCourse(event.item);
    } else if (event.optionId === "active") {
      this.activateCourse(event.item);
    }
  }

  async inactivateCourse(course: CourseEntity): Promise<void> {
    this.alertService.waring("El registro será inactivado").then(async (r) => {
      if (r?.isConfirmed) {
        const dto = new CourseRegisterDto();
        course.Status = "I";
        dto.course = course;
        const rpt = await this.courseService.Save(dto);
        if (!rpt.ErrorStatus) this.filter(1);
      }
    });
  }

  async activateCourse(course: CourseEntity): Promise<void> {
    this.alertService.waring("El registro será activado").then(async (r) => {
      if (r?.isConfirmed) {
        const dto = new CourseRegisterDto();
        course.Status = "A";
        dto.course = course;
        const rpt = await this.courseService.Save(dto);
        if (!rpt.ErrorStatus) this.filter(1);
      }
    });
  }
}
