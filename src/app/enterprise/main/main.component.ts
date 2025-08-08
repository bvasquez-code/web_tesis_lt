import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/service/login.service';
import { DataSesionService } from '../compartido/service/datasesion.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

  constructor(
    private router: Router,
    private dataSesionService : DataSesionService
  ) { }

  ngOnInit(): void {

    let UserProfile = this.dataSesionService.getSessionStorageDto().UserProfile;

    if(UserProfile && UserProfile.filter( e => e.ProfileCod === "maestro" ).length > 0) {
      this.router.navigate(['/enterprise/student/page/liststudentcomponent']);
    }

    if(UserProfile && UserProfile.filter( e => e.ProfileCod === "student" ).length > 0) {
      this.router.navigate(['/enterprise/student/page/createcustomexam']);
    }

  }

}
