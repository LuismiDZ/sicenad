import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChange,
  AfterViewInit,
  AfterContentInit,
  AfterViewChecked,
  DoCheck,
  SimpleChanges,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Categoria } from "src/app/categorias/models/categoria";
import { TipoFormulario } from "src/app/tiposFormulario/models/tipoFormulario";
import { UsuarioGestor } from "src/app/usuarios/models/usuarioGestor";
import { RecursoImpl } from "../../models/recurso-impl";
import { RecursoService } from "../../service/recurso.service";

@Component({
  selector: "app-recurso-ficha",
  templateUrl: "./recurso-ficha.component.html",
  styleUrls: []
})
export class RecursoFichaComponent implements OnInit {
  /**
   * variable para capturar el id del cenad de la barra de navegacion
   */
  idCenad: string = "";
  /**
   * variable que trae del otro componente el recurso seleccionado
   */
  @Input() recurso: RecursoImpl;
  /**
   * variable que emite un evento con el recurso a eliminar
   */
  @Output() recursoEliminar = new EventEmitter<RecursoImpl>();
  /**
   * variable que emite un evento con el recurso a editar
   */
  @Output() recursoEditar = new EventEmitter<RecursoImpl>();
  /**
   * variable para recoger las categorias del cenad
   */
  categorias: Categoria[] = [];
  /**
   * variable para recoger los gestores de ese cenad
   */
  gestores: UsuarioGestor[] = [];
  /**
   * variable para recoger todos los tipos de formulario
   */
  tiposFormulario: TipoFormulario[] = [];
  /**
   * variable para poder mostrar el valor inicial de tipoFormulario
   */
  tipoFormularioSeleccionado: string;
  /**
   * variable para poder mostrar el valor inicial de categoria
   */
  categoriaRecursoSeleccionada: string;
  /**
   * variable para poder mostrar el valor inicial de usuarioGestor
   */
  recursoUsuarioGestorSeleccionado: string;

  /**
   *
   * @param recursoService Para usar los metodos propios de Recurso
   * @param activateRoute Para capturar el id de la barra de navegacion
   */
  constructor(
    private recursoService: RecursoService,
    private activateRoute: ActivatedRoute
  ) {}

  /**
   * - captura el id del cenad de la barra de navegacion
   * - rescata del local storage las categorias del cenad
   * - rescata del local storage los usuarios gestores de ese cenad
   * - rescata del LocalStorage los tipos de formulario
   * - asigna los valores seleccionados a los select de los campos del recurso
   */
  ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params["idCenad"];
    this.categorias = JSON.parse(
      localStorage.getItem(`categorias_${this.idCenad}`)
    );
    this.gestores = JSON.parse(
      localStorage.getItem(`usuariosGestor_${this.idCenad}`)
    );
    this.tiposFormulario = JSON.parse(localStorage.tiposFormulario);
    this.actualizarNgModels();
  }

  /**
   * metodo que emite el evento para eliminar el recurso
   */
  eliminar(): void {
    this.recursoEliminar.emit(this.recurso);
  }

  /**
   * metodo para poder mostrar en los select los valores seleccionados
   */
  actualizarNgModels(): void {
    this.tipoFormularioSeleccionado = this.recurso.tipoFormulario.url;
    this.categoriaRecursoSeleccionada = this.recurso.categoria.url;
    this.recursoUsuarioGestorSeleccionado = this.recurso.usuarioGestor.url;
  }

  /**
   * metodo que emite el evento para editar el recurso
   */
  editar(): void {
    this.recurso.tipoFormulario = this.tipoFormularioSeleccionado;
    this.recurso.categoria = this.categoriaRecursoSeleccionada;
    this.recurso.usuarioGestor = this.recursoUsuarioGestorSeleccionado;
    this.recursoEditar.emit(this.recurso);
  }
}
