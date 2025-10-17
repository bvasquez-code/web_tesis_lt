import { Component, OnInit } from '@angular/core';
import { StudentRegisterWithUserDto } from '../../model/dto/StudentRegisterWithUserDto';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../service/StudentService';
import { ToastrService } from 'ngx-toastr';
import { DataSesionService } from 'src/app/enterprise/compartido/service/datasesion.service';

@Component({
  selector: 'app-registerstudent',
  templateUrl: './registerstudent.component.html'
})
export class RegisterstudentComponent implements OnInit {

  studentDto: StudentRegisterWithUserDto = new StudentRegisterWithUserDto();
  confirmPassword: string = "";
  token: string = "";
  tokenValid: boolean = false;
  expirationDate: number = 0; // en milisegundos
  isBlockedBySession = false;
  blockMessage = '';

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {

     this.viewPage(); // <-- primero valida si hay sesión
    if (this.isBlockedBySession) return;

    localStorage.clear();
    // Extraer el token del query param "invitation"
    this.token = this.route.snapshot.queryParamMap.get('invitation') || "";
    if (this.token) {
      this.validateToken();
    }
  }

  viewPage(){
      try {
        const dataSesionService : DataSesionService = new DataSesionService();
        const session = dataSesionService.getSessionStorageDto?.();
        // Criterio simple: si hay UserCod, consideramos que existe sesión activa
        const loggedIn = !!session && !!session.UserCod;

        if (loggedIn) {
          this.isBlockedBySession = true;
          this.blockMessage =
            'No puedes usar este enlace de invitación porque ya tienes una sesión iniciada. ' +
            'Ábrelo en otro navegador, en una ventana de incógnito/privada, o cierra sesión y vuelve a intentarlo.';
          this.tokenValid = false; // asegura que el formulario no se muestre
          // Opcional: avisar con toast
          this.toastr.info('Abre el enlace en modo incógnito o en otro navegador.', 'Sesión detectada');
        } else {
          // Si NO hay sesión, limpias storage para evitar restos
          localStorage.clear();
          sessionStorage.clear?.();
        }
      } catch (e) {
        console.error('viewPage error:', e);
        // En caso de error, por seguridad no bloqueamos
        this.isBlockedBySession = false;
      }
  }

  validateToken(): void {
    try {
      // Decodificar el token (suponemos que está en base64)
      const decoded = atob(this.token);
      // Ejemplo decodificado: "StudentID=S000755&expirationDate=1743451693693&uid=3cp49bohs"
      const params : any = decoded.split('&').reduce((acc, curr) => {
        const [key, value] = curr.split('=');
        acc[key] = value;
        return acc;
      }, {} as { [key: string]: string });

      if (params.expirationDate && params.StudentID) {
        this.expirationDate = Number(params.expirationDate);
        const now = Date.now();
        if (now <= this.expirationDate) {
          this.tokenValid = true;
          // Asignar el StudentID proveniente del token
          this.studentDto.student.StudentID = params.StudentID;
        } else {
          this.tokenValid = false;
        }
      } else {
        this.tokenValid = false;
      }
    } catch (error) {
      console.error('Error decodificando token:', error);
      this.tokenValid = false;
    }
  }

  onSubmit(): void {
    // Validar que el token no haya expirado
    if (Date.now() > this.expirationDate) {
      this.toastr.error("El enlace de registro ha expirado.");
      return;
    }
    // Validar que las contraseñas coincidan
    if (this.studentDto.password !== this.confirmPassword) {
      this.toastr.error("Las contraseñas no coinciden.");
      return;
    }

    // Enviar la información del formulario
    this.studentService.registerStudent(this.studentDto)
      .then(response => {
        if (!response.ErrorStatus) {
          this.toastr.success("Estudiante registrado correctamente.");     
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(response.Message);
        }
      })
      .catch(error => {
        console.error(error);
        this.toastr.error("Error en el registro del estudiante.");
      });
  }

  cancel(): void {
    // Lógica para cerrar el modal o reiniciar el formulario, si es necesario.
    console.log('Registro cancelado, cerrando modal.');
  }



  
}