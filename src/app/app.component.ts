import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'ccadmin2';

  ExisteSesion : boolean = ( localStorage.getItem('Token') ) ? true : false;


  getSession(){

    const Token : string = localStorage.getItem('Token') || "";
    let ExistSesion : boolean = ( Token ) ? true : false;

    return ExistSesion;
    
  }


}
