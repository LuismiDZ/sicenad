import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Categoria } from 'src/app/categorias/models/categoria';
import { TipoFormulario } from 'src/app/tiposFormulario/models/tipoFormulario';
import { UsuarioGestor } from 'src/app/usuarios/models/usuarioGestor';
import { RecursoImpl } from '../models/recurso-impl';
import { RecursoService } from '../service/recurso.service';

@Component({
  selector: 'app-recurso-form',
  templateUrl: './recurso-form.component.html',
  styleUrls: []
})
export class RecursoFormComponent implements OnInit {
  /**
   * variable para capturar el id del cenad de la barra de navegacion
   */
  idCenad: string = "";
  /**
   * variable para grabar el nuevo recurso
   */
  recurso: RecursoImpl = new RecursoImpl();
  /**
   * variable para recoger las categorias de ese cenad
   */
  categorias: Categoria[] = [];
  /**
   * variable para cargar los gestores de ese cenad
   */
  gestores: UsuarioGestor[] = [];
  /**
   * variable para cargar todos los tipos de formulario
   */
  tiposFormulario: TipoFormulario[] = [];
  /**
   * variable del icono "volver"
   */
  faVolver =faArrowAltCircleLeft;

  /**
   *
   * @param recursoService Para usar los metodos propios de Recurso
   * @param router Para redirigir
   * @param activateRoute Para capturar el id de la barra de navegacion
   */
  constructor(
    private recursoService: RecursoService,
    private router: Router, private activateRoute: ActivatedRoute) { }

    /**
     * - resacata el id del cenad de la barra de navegacion
     * - rescata del local storage las categorias del cenad
     * - rescata del local storage los usuarios gestores de ese cenad
     * - rescata del LocalStorage los tipos de formulario
     */
  ngOnInit() {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.categorias = JSON.parse(localStorage.getItem(`categorias_${this.idCenad}`));
    this.gestores = JSON.parse(localStorage.getItem(`usuariosGestor_${this.idCenad}`));
    this.tiposFormulario = JSON.parse(localStorage.tiposFormulario);
  }

  /**
   * metodo para crear un recurso en ese cenad y volver al listado de recursos de ese cenad
   * - actualiza localStorage
   */
  crearRecurso(): void {
    this.recursoService.create(this.recurso).subscribe((response) => {
      this.recursoService.getRecursosDeCenad(this.idCenad).subscribe((response) => {
        localStorage.setItem(`recursos_${this.idCenad}`, JSON.stringify(this.recursoService.extraerRecursos(response)));
        console.log(`He creado el recurso ${this.recurso.nombre}`);
        this.router.navigate([`/principalCenad/${this.idCenad}/recursos/${this.idCenad}`]);
      });
    });
  }
}
