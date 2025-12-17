import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuPagina } from 'src/app/enterprise/menu/model/entity/MenuPagina';
import { SubMenuPagina } from 'src/app/enterprise/menu/model/entity/SubMenuPagina';
import { DataSesionService } from '../../compartido/service/datasesion.service';


@Component({
  selector: 'app-menusidebar',
  templateUrl: './menusidebar.component.html'
})
export class MenusidebarComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) document: any,
    private dataSesionService: DataSesionService
  ) {
  }


  public g_flg_menu_defecto: boolean = false;
  public g_list_menu: MenuPagina[] = [];
  public isOpenMenu: boolean = false;

  ngOnInit(): void {
    this.ObtenerMenu();
  }

  ObtenerMenu() {
    this.g_list_menu.push(this.getOptionDashboard());

    if (this.dataSesionService.PermissionExists("AT000000")) this.g_list_menu.push(this.getOptionsAdminSales());

    if (this.dataSesionService.PermissionExists("SI000000")) this.g_list_menu.push(this.getOptionSystem());

    if (this.dataSesionService.PermissionExists("US000000")) this.g_list_menu.push(this.getOptionsUser());

    if (this.dataSesionService.PermissionExists("VT000000")) this.g_list_menu.push(this.getOptionsSale());

    if (this.dataSesionService.PermissionExists("PR000000")) this.g_list_menu.push(this.getOptionsProducts());

    if (this.dataSesionService.PermissionExists("CO000000")) this.g_list_menu.push(this.getOptionsPucharse());

    if (this.dataSesionService.PermissionExists("ESC00000")) this.g_list_menu.push(this.getOptionSchool());

    let url = document.location.href;
    this.isOpenMenu = false;

    for (let i = 0; i < this.g_list_menu.length; i++) {

      const menu = this.g_list_menu[i];

      for (let j = 0; j < menu.list_sub_menu.length; j++) {

        const submenu = menu.list_sub_menu[j];

        if (submenu.url !== "" && submenu.url !== null && url.includes(submenu.url_position)) {
          submenu.flg_menu_activo = true;
          menu.flg_menu_activo = true;
          this.isOpenMenu = true;
          console.log({ submenu: submenu });
        }
      }
    }
  }


  getOptionsUser(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();
    MainMenu.url = "#";
    MainMenu.des_menu = "usuarios";
    MainMenu.icono = "nav-icon fa fa-cube";

    //bandeja de usuarios
    let ListUser: SubMenuPagina = new SubMenuPagina();
    ListUser.url = "enterprise/user/pages/listuser";
    ListUser.url_position = "enterprise/user/pages/listuser";
    ListUser.des_menu = "Bandeja de Usuarios";
    ListUser.icono = "nav-icon fa fa-cube";

    let CreateUser: SubMenuPagina = new SubMenuPagina();
    CreateUser.url = "enterprise/user/pages/createuser";
    CreateUser.url_position = "enterprise/user/pages/createuser";
    CreateUser.des_menu = "Creación de Usuarios";
    CreateUser.icono = "nav-icon fa fa-cube";
    CreateUser.IsVisible = false;

    if (this.dataSesionService.PermissionExists("US000001")) MainMenu.list_sub_menu.push(ListUser);
    if (this.dataSesionService.PermissionExists("US000003")) MainMenu.list_sub_menu.push(CreateUser);

    //bandeja de perfiles
    let ListProfile: SubMenuPagina = new SubMenuPagina();
    ListProfile.url = "enterprise/user/pages/listprofile";
    ListProfile.url_position = "enterprise/user/pages/listprofile";
    ListProfile.des_menu = "Bandeja de perfiles";
    ListProfile.icono = "nav-icon fa fa-cube";

    let CreateProfile: SubMenuPagina = new SubMenuPagina();
    CreateProfile.url = "enterprise/user/pages/createprofile";
    CreateProfile.url_position = "enterprise/user/pages/createprofile";
    CreateProfile.des_menu = "crear perfil de Usuarios";
    CreateProfile.icono = "nav-icon fa fa-cube";
    CreateProfile.IsVisible = false;

    if (this.dataSesionService.PermissionExists("US000002")) MainMenu.list_sub_menu.push(ListProfile);
    if (this.dataSesionService.PermissionExists("US000004")) MainMenu.list_sub_menu.push(CreateProfile);

    return MainMenu;
  }

  getOptionSystem(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();
    MainMenu.url = "#";
    MainMenu.des_menu = "sistema";
    MainMenu.icono = "nav-icon fa fa-cube";

    let ListMenu: SubMenuPagina = new SubMenuPagina();
    ListMenu.url = "enterprise/menu/pages/listmenu";
    ListMenu.url_position = "enterprise/menu/pages/listmenu";
    ListMenu.des_menu = "Bandeja de menús";
    ListMenu.icono = "nav-icon fa fa-cube";


    let CreateMenu: SubMenuPagina = new SubMenuPagina();
    CreateMenu.url = "enterprise/menu/pages/createmenu";
    CreateMenu.url_position = "enterprise/menu/pages/createmenu";
    CreateMenu.des_menu = "Crear Menu";
    CreateMenu.icono = "nav-icon fa fa-cube";
    CreateMenu.IsVisible = false;

    if (this.dataSesionService.PermissionExists("SI000001")) MainMenu.list_sub_menu.push(ListMenu);
    if (this.dataSesionService.PermissionExists("SI000002")) MainMenu.list_sub_menu.push(CreateMenu);

    return MainMenu;
  }

  getOptionDashboard(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();

    MainMenu.url = "";
    MainMenu.des_menu = "Dashboard";
    MainMenu.icono = "nav-icon fa fa-tachometer-alt";

    return MainMenu;
  }

  getOptionsSale(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();

    MainMenu.url = "#";
    MainMenu.des_menu = "Ventas";
    MainMenu.icono = "nav-icon fa fa-cube";

    let CreatePresale: SubMenuPagina = new SubMenuPagina();
    CreatePresale.url = "enterprise/sale/pages/createpresale";
    CreatePresale.url_position = "enterprise/sale/pages/createpresale";
    CreatePresale.des_menu = "Realizar venta";
    CreatePresale.icono = "nav-icon fa fa-cube";

    let ListPresale: SubMenuPagina = new SubMenuPagina();
    ListPresale.url = "enterprise/sale/pages/listpresale";
    ListPresale.url_position = "enterprise/sale/pages/listpresale";
    ListPresale.des_menu = "Preventa";
    ListPresale.icono = "nav-icon fa fa-cube";

    let ListSale: SubMenuPagina = new SubMenuPagina();
    ListSale.url = "enterprise/sale/pages/listsale";
    ListSale.url_position = "enterprise/sale/pages/listsale";
    ListSale.des_menu = "Facturación";
    ListSale.icono = "nav-icon fa fa-cube";

    let CreateSale: SubMenuPagina = new SubMenuPagina();
    CreateSale.url = "enterprise/sale/pages/createsale";
    CreateSale.url_position = "enterprise/sale/pages/createsale";
    CreateSale.des_menu = "Crear Facturación";
    CreateSale.icono = "nav-icon fa fa-cube";
    CreateSale.IsVisible = false;

    let ListCreditNote: SubMenuPagina = new SubMenuPagina();
    ListCreditNote.url = "enterprise/sale/pages/listcreditnote";
    ListCreditNote.url_position = "enterprise/sale/pages/listcreditnote";
    ListCreditNote.des_menu = "Nota de credito";
    ListCreditNote.icono = "nav-icon fa fa-cube";

    let CreateCreditNote: SubMenuPagina = new SubMenuPagina();
    CreateCreditNote.url = "enterprise/sale/pages/createcreditnote";
    CreateCreditNote.url_position = "enterprise/sale/pages/createcreditnote";
    CreateCreditNote.des_menu = "Crear nota de credito";
    CreateCreditNote.icono = "nav-icon fa fa-cube";
    CreateCreditNote.IsVisible = false;

    let ReturnStockCreditnote: SubMenuPagina = new SubMenuPagina();
    ReturnStockCreditnote.url = "enterprise/sale/pages/returnstockcreditnote";
    ReturnStockCreditnote.url_position = "enterprise/sale/pages/returnstockcreditnote";
    ReturnStockCreditnote.des_menu = "Crear nota de credito";
    ReturnStockCreditnote.icono = "nav-icon fa fa-cube";
    ReturnStockCreditnote.IsVisible = false;


    if (this.dataSesionService.PermissionExists("VT000004")) MainMenu.list_sub_menu.push(CreatePresale);
    if (this.dataSesionService.PermissionExists("VT000002")) MainMenu.list_sub_menu.push(ListPresale);
    if (this.dataSesionService.PermissionExists("VT000003")) MainMenu.list_sub_menu.push(ListSale);
    if (this.dataSesionService.PermissionExists("VT000005")) MainMenu.list_sub_menu.push(CreateSale);
    if (this.dataSesionService.PermissionExists("VT000003")) MainMenu.list_sub_menu.push(ListCreditNote);
    if (this.dataSesionService.PermissionExists("VT000005")) MainMenu.list_sub_menu.push(CreateCreditNote);
    if (this.dataSesionService.PermissionExists("VT000005")) MainMenu.list_sub_menu.push(ReturnStockCreditnote);


    return MainMenu;
  }

  getOptionsAdminSales(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();

    MainMenu.url = "#";
    MainMenu.des_menu = "Administrar tienda";
    MainMenu.icono = "nav-icon fa fa-cube";

    let ListClient: SubMenuPagina = new SubMenuPagina();
    ListClient.url = "enterprise/client/pages/listclient";
    ListClient.url_position = "enterprise/client/pages/listclient";
    ListClient.des_menu = "Bandeja de Clientes";
    ListClient.icono = "nav-icon fa fa-cube";

    let CreateClient: SubMenuPagina = new SubMenuPagina();
    CreateClient.url = "enterprise/client/pages/createclient";
    CreateClient.url_position = "enterprise/client/pages/createclient";
    CreateClient.des_menu = "Creación de clientes";
    CreateClient.icono = "nav-icon fa fa-cube";
    CreateClient.IsVisible = false;

    if (this.dataSesionService.PermissionExists("AT000001")) MainMenu.list_sub_menu.push(ListClient);
    if (this.dataSesionService.PermissionExists("AT000002")) MainMenu.list_sub_menu.push(CreateClient);

    return MainMenu;
  }

  getOptionsProducts(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();

    MainMenu.url = "#";
    MainMenu.des_menu = "Productos";
    MainMenu.icono = "nav-icon fa fa-cube";

    let ListProduct: SubMenuPagina = new SubMenuPagina();
    ListProduct.url = "enterprise/product/pages/listProduct";
    ListProduct.url_position = "enterprise/product/pages/listProduct";
    ListProduct.des_menu = "Bandeja de Productos";
    ListProduct.icono = "nav-icon fa fa-cube";

    let CreateProduct: SubMenuPagina = new SubMenuPagina();
    CreateProduct.url = "enterprise/product/pages/createProduct";
    CreateProduct.url_position = "enterprise/product/pages/createProduct";
    CreateProduct.des_menu = "Creación de Productos";
    CreateProduct.icono = "nav-icon fa fa-cube";
    CreateProduct.IsVisible = false;

    if (this.dataSesionService.PermissionExists("PR000001")) MainMenu.list_sub_menu.push(ListProduct);
    if (this.dataSesionService.PermissionExists("PR000005")) MainMenu.list_sub_menu.push(CreateProduct);


    let ListBrand: SubMenuPagina = new SubMenuPagina();
    ListBrand.url = "enterprise/product/pages/listBrand";
    ListBrand.url_position = "enterprise/product/pages/listBrand";
    ListBrand.des_menu = "Bandeja de Marcas";
    ListBrand.icono = "nav-icon fa fa-cube";

    let CreateBrand: SubMenuPagina = new SubMenuPagina();
    CreateBrand.url = "enterprise/product/pages/createBrand";
    CreateBrand.url_position = "enterprise/product/pages/createBrand";
    CreateBrand.des_menu = "Creación de Marcas";
    CreateBrand.icono = "nav-icon fa fa-cube";
    CreateBrand.IsVisible = false;

    if (this.dataSesionService.PermissionExists("PR000002")) MainMenu.list_sub_menu.push(ListBrand);
    if (this.dataSesionService.PermissionExists("PR000006")) MainMenu.list_sub_menu.push(CreateBrand);


    let ListCategory: SubMenuPagina = new SubMenuPagina();
    ListCategory.url = "enterprise/product/pages/listCategory";
    ListCategory.url_position = "enterprise/product/pages/listCategory";
    ListCategory.des_menu = "Bandeja de Categorias";
    ListCategory.icono = "nav-icon fa fa-cube";

    let CreateCategory: SubMenuPagina = new SubMenuPagina();
    CreateCategory.url = "enterprise/product/pages/createCategory";
    CreateCategory.url_position = "enterprise/product/pages/createCategory";
    CreateCategory.des_menu = "Creación de categorias";
    CreateCategory.icono = "nav-icon fa fa-cube";
    CreateCategory.IsVisible = false;

    if (this.dataSesionService.PermissionExists("PR000003")) MainMenu.list_sub_menu.push(ListCategory);
    if (this.dataSesionService.PermissionExists("PR000007")) MainMenu.list_sub_menu.push(CreateCategory);


    let ListKardex: SubMenuPagina = new SubMenuPagina();
    ListKardex.url = "enterprise/product/pages/listkardex";
    ListKardex.url_position = "enterprise/product/pages/listkardex";
    ListKardex.des_menu = "Kardex";
    ListKardex.icono = "nav-icon fa fa-cube";

    if (this.dataSesionService.PermissionExists("PR000004")) MainMenu.list_sub_menu.push(ListKardex);

    return MainMenu;
  }

  getOptionsPucharse(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();

    MainMenu.url = "#";
    MainMenu.des_menu = "Compras";
    MainMenu.icono = "nav-icon fa fa-cube";

    let ListPucharse: SubMenuPagina = new SubMenuPagina();
    ListPucharse.url = "enterprise/pucharse/pages/listpucharse";
    ListPucharse.url_position = "enterprise/pucharse/pages/listpucharse";
    ListPucharse.des_menu = "Bandeja de compras";
    ListPucharse.icono = "nav-icon fa fa-cube";

    let CreatePucharse: SubMenuPagina = new SubMenuPagina();
    CreatePucharse.url = "enterprise/pucharse/pages/createpucharse";
    CreatePucharse.url_position = "enterprise/pucharse/pages/createpucharse";
    CreatePucharse.des_menu = "Solicitud de compra";
    CreatePucharse.icono = "nav-icon fa fa-cube";
    CreatePucharse.IsVisible = false;

    let Confirmpucharse: SubMenuPagina = new SubMenuPagina();
    Confirmpucharse.url = "enterprise/pucharse/pages/confirmpucharse";
    Confirmpucharse.url_position = "enterprise/pucharse/pages/confirmpucharse";
    Confirmpucharse.des_menu = "Solicitud de compra";
    Confirmpucharse.icono = "nav-icon fa fa-cube";
    Confirmpucharse.IsVisible = false;

    let Listreception: SubMenuPagina = new SubMenuPagina();
    Listreception.url = "enterprise/pucharse/pages/listreception";
    Listreception.url_position = "enterprise/pucharse/pages/listreception";
    Listreception.des_menu = "Recepción de compras";
    Listreception.icono = "nav-icon fa fa-cube";

    if (this.dataSesionService.PermissionExists("CO000001")) MainMenu.list_sub_menu.push(ListPucharse);
    if (this.dataSesionService.PermissionExists("CO000003")) MainMenu.list_sub_menu.push(CreatePucharse);
    if (this.dataSesionService.PermissionExists("CO000002")) MainMenu.list_sub_menu.push(Listreception);
    if (this.dataSesionService.PermissionExists("CO000004")) MainMenu.list_sub_menu.push(Confirmpucharse);

    return MainMenu;
  }


  getOptionSchool(): MenuPagina {
    let MainMenu: MenuPagina = new MenuPagina();
    MainMenu.url = "#";
    MainMenu.des_menu = "Escuela";
    MainMenu.icono = "nav-icon fa fa-school"; // Utiliza el icono que prefieras

    // Opción: Listado de Estudiantes
    let ListStudents: SubMenuPagina = new SubMenuPagina();
    ListStudents.url = "enterprise/student/page/liststudentcomponent";
    ListStudents.url_position = "enterprise/student/page/liststudentcomponent";
    ListStudents.des_menu = "Listado de Estudiantes";
    ListStudents.icono = "nav-icon fa fa-users";

    let CreateStudent: SubMenuPagina = new SubMenuPagina();
    CreateStudent.url = "enterprise/student/page/createstudent";
    CreateStudent.url_position = "enterprise/student/page/createstudent";
    CreateStudent.des_menu = "Crear Estudiante";
    CreateStudent.icono = "nav-icon fa fa-plus-circle";
    CreateStudent.IsVisible = false;

    // Opción 3: Listado de Exámenes
    let ListExam: SubMenuPagina = new SubMenuPagina();
    ListExam.url = "enterprise/student/page/listexam";
    ListExam.url_position = "enterprise/student/page/listexam";
    ListExam.des_menu = "Listado de Exámenes";
    ListExam.icono = "nav-icon fa fa-book"; // O el icono que prefieras

    let CreateExam: SubMenuPagina = new SubMenuPagina();
    CreateExam.url = "enterprise/student/page/createexam";
    CreateExam.url_position = "enterprise/student/page/createexam";
    CreateExam.des_menu = "Crear Examen";
    CreateExam.icono = "nav-icon fa fa-plus-square";
    CreateExam.IsVisible = false;

    let ListExercise: SubMenuPagina = new SubMenuPagina();
    ListExercise.url = "enterprise/student/page/listexercise";
    ListExercise.url_position = "enterprise/student/page/listexercise";
    ListExercise.des_menu = "Listado de Ejercicios";
    ListExercise.icono = "nav-icon fa fa-dumbbell";

    let CreateExercise: SubMenuPagina = new SubMenuPagina();
    CreateExercise.url = "enterprise/student/page/createexercise";
    CreateExercise.url_position = "enterprise/student/page/createexercise";
    CreateExercise.des_menu = "Crear Ejercicio";
    CreateExercise.icono = "nav-icon fa fa-plus-square";
    CreateExercise.IsVisible = false;

    let ListTopic: SubMenuPagina = new SubMenuPagina();
    ListTopic.url = "enterprise/student/page/listtopic";
    ListTopic.url_position = "enterprise/student/page/listtopic";
    ListTopic.des_menu = "Listado de Temas";
    ListTopic.icono = "nav-icon fa fa-book";

    let CreateTopic: SubMenuPagina = new SubMenuPagina();
    CreateTopic.url = "enterprise/student/page/createtopic";
    CreateTopic.url_position = "enterprise/student/page/createtopic";
    CreateTopic.des_menu = "Crear Tema";
    CreateTopic.icono = "nav-icon fa fa-plus-square";
    CreateTopic.IsVisible = false;

    let ListStudentExamHistory: SubMenuPagina = new SubMenuPagina();
    ListStudentExamHistory.url = "enterprise/student/page/liststudentexamhistory";
    ListStudentExamHistory.url_position = "enterprise/student/page/liststudentexamhistory";
    ListStudentExamHistory.des_menu = "Historial de Exámenes";
    ListStudentExamHistory.icono = "nav-icon fa fa-history";

    let ListStudentTopicPerformance: SubMenuPagina = new SubMenuPagina();
    ListStudentTopicPerformance.url = "enterprise/student/page/liststudenttopicperformance";
    ListStudentTopicPerformance.url_position = "enterprise/student/page/liststudenttopicperformance";
    ListStudentTopicPerformance.des_menu = "Desempeño de Temas";
    ListStudentTopicPerformance.icono = "nav-icon fa fa-chart-line";

    let ResolveExam: SubMenuPagina = new SubMenuPagina();
    ResolveExam.url = "enterprise/student/page/resolveexam";
    ResolveExam.url_position = "enterprise/student/page/resolveexam";
    ResolveExam.des_menu = "Resolver Examen";
    ResolveExam.icono = "nav-icon fa fa-pencil-alt";

    let ListCourse: SubMenuPagina = new SubMenuPagina();
    ListCourse.url = "enterprise/student/page/listcourse";
    ListCourse.url_position = "enterprise/student/page/listcourse";
    ListCourse.des_menu = "Listado de Cursos";
    ListCourse.icono = "nav-icon fa fa-book-open";

    let CreateCourse: SubMenuPagina = new SubMenuPagina();
    CreateCourse.url = "enterprise/student/page/createcourse";
    CreateCourse.url_position = "enterprise/student/page/createcourse";
    CreateCourse.des_menu = "Crear Curso";
    CreateCourse.icono = "nav-icon fa fa-plus-square";
    CreateCourse.IsVisible = false;

    // Verificamos el permiso específico para visualizar esta opción (por ejemplo "ES000001")
    if (this.dataSesionService.PermissionExists("ESC00001")) {
      MainMenu.list_sub_menu.push(ListStudents);
    }
    if (this.dataSesionService.PermissionExists("ESC00001")) {
      MainMenu.list_sub_menu.push(CreateStudent);
    }
    if (this.dataSesionService.PermissionExists("ESC00002")) {
      MainMenu.list_sub_menu.push(ListExam);
    }
    if (this.dataSesionService.PermissionExists("ESC00002")) {
      MainMenu.list_sub_menu.push(CreateExam);
    }
    if (this.dataSesionService.PermissionExists("ESC00003")) {
      MainMenu.list_sub_menu.push(ListExercise);
    }
    if (this.dataSesionService.PermissionExists("ESC00003")) {
      MainMenu.list_sub_menu.push(CreateExercise);
    }
    if (this.dataSesionService.PermissionExists("ESC00006")) {
      MainMenu.list_sub_menu.push(ListTopic);
    }
    if (this.dataSesionService.PermissionExists("ESC00006")) {
      MainMenu.list_sub_menu.push(CreateTopic);
    }

    if (this.dataSesionService.PermissionExists("ESC00004")) {
      MainMenu.list_sub_menu.push(ListStudentExamHistory);
    }

    if (this.dataSesionService.PermissionExists("ESC00005")) {
      MainMenu.list_sub_menu.push(ListStudentTopicPerformance);
    }

    if (this.dataSesionService.PermissionExists("ESC0000X")) {
      MainMenu.list_sub_menu.push(ResolveExam);
    }

    if (this.dataSesionService.PermissionExists("ESC00009")) {
      MainMenu.list_sub_menu.push(ListCourse);
      MainMenu.list_sub_menu.push(CreateCourse);
    }

    let RegisterStudent: SubMenuPagina = new SubMenuPagina();
    RegisterStudent.url = "enterprise/student/page/registerstudent";
    RegisterStudent.url_position = "enterprise/student/page/registerstudent";
    RegisterStudent.des_menu = "Registrar Estudiante";
    RegisterStudent.icono = "nav-icon fa fa-user-plus";

    if (this.dataSesionService.PermissionExists("ESC0000X")) {
      MainMenu.list_sub_menu.push(RegisterStudent);
    }

    let CreateCustomExam: SubMenuPagina = new SubMenuPagina();
    CreateCustomExam.url = "enterprise/student/page/createcustomexam";
    CreateCustomExam.url_position = "enterprise/student/page/createcustomexam";
    CreateCustomExam.des_menu = "Crear Examen Personalizado";
    CreateCustomExam.icono = "nav-icon fa fa-plus-circle";

    let TeacherExamView: SubMenuPagina = new SubMenuPagina();
    TeacherExamView.url = "enterprise/student/page/examteacherview";
    TeacherExamView.url_position = "enterprise/student/page/listexam";
    TeacherExamView.des_menu = "Ver Examen (Profesor)";
    TeacherExamView.icono = "nav-icon fa fa-eye";

    let StudentExamReview: SubMenuPagina = new SubMenuPagina();
    StudentExamReview.url = "enterprise/student/page/examstudentreview";
    StudentExamReview.url_position = "enterprise/student/page/examstudentreview";
    StudentExamReview.des_menu = "Mi Examen (Resultado)";
    StudentExamReview.icono = "nav-icon fa fa-clipboard-check";

    let GradeEvolution: SubMenuPagina = new SubMenuPagina();
    GradeEvolution.url = "enterprise/student/page/gradeevolution";
    GradeEvolution.url_position = "enterprise/student/page/gradeevolution";
    GradeEvolution.des_menu = "Evolución de Notas";
    GradeEvolution.icono = "nav-icon fa fa-chart-line";

    if (this.dataSesionService.PermissionExists("ESC00001")) {
      MainMenu.list_sub_menu.push(GradeEvolution);
    }


    if (this.dataSesionService.PermissionExists("ESC00007")) {
      MainMenu.list_sub_menu.push(CreateCustomExam);
    }

    if (this.dataSesionService.PermissionExists("ESC0000X")) {
      MainMenu.list_sub_menu.push(TeacherExamView);
    }

    if (this.dataSesionService.PermissionExists("ESC0000X")) {
      MainMenu.list_sub_menu.push(StudentExamReview);
    }

    return MainMenu;
  }

}
