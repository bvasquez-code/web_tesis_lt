import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSesionService } from '../../compartido/service/datasesion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private dataSesionService: DataSesionService
  ) { }

  ngOnInit(): void {
  }

  Logout()
  {
    localStorage.setItem('Token',"");
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getName(){
    const user = this.dataSesionService.getSessionStorageDto();
    return user.Names;
  }

}
