import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { TipoFormulario } from '../models/tipoFormulario';
import { TipoFormularioImpl } from '../models/tipoFormulario-impl';
import { TipoFormularioService } from '../service/tipoFormulario.service';

@Component({
  selector: 'app-tiposFormulario',
  templateUrl: './tiposFormulario.component.html',
  styleUrls: []
})
export class TiposFormularioComponent implements OnInit {
  /**
   * variable que recoge todos los tipos de formulario
   */
  tiposFormulario: TipoFormulario[] = [];
  /**
   * variable que relaciona cada tipo de formulario con sus datos
   */
  tipoFormularioVerDatos: TipoFormulario;
  /**
   * variable del icono "volver"
   */
  faVolver = faArrowAltCircleLeft;

  /**
   *
   * @param tipoFormularioService Para usar los metodos propios de TipoFormulario
   * @param router Para redirigir
   */
  constructor(
    private tipoFormularioService: TipoFormularioService,
    private router: Router) { }

    /**
     * recoge del local storage en la variable todos los tipos de formulario
     */
  ngOnInit(): void {
    this.tiposFormulario = JSON.parse(localStorage.tiposFormulario);
  }

  /**
   * metodo para poder mostrar los datos del tipo de formulario
   * @param tipoFormulario Tipo de formulario a mostrar en el modal
   */
  verDatos(tipoFormulario: TipoFormulario): void {
    this.tipoFormularioVerDatos = tipoFormulario;
  }

  /**
   * metodo para eliminar un tipo de formulario y volver al listado y actualizo el localStorage
   * @param tipoFromulario Tipo de formulario a eliminar
   */
  onTipoFormularioEliminar(tipoFormulario: TipoFormulario): void {
    this.tipoFormularioService.delete(tipoFormulario).subscribe(response => {
      this.tipoFormularioService.getTiposFormulario().subscribe((response) => {
        localStorage.tiposFormulario = JSON.stringify(this.tipoFormularioService.extraerTiposFormulario(response));
        console.log(`He borrado el Tipo de Formulario ${tipoFormulario.nombre}`);
        this.router.navigate(['/tiposFormulario']);
      });
    });
  }

  /**
   * metodo para editar un tipo de formulario y volver al listado y actualizo el localStorage
   * @param tipoFromulario Tipo de formulario a editar
   */
  onTipoFormularioEditar(tipoFormulario: TipoFormularioImpl): void {
    this.tipoFormularioService.update(tipoFormulario).subscribe(response => {
      this.tipoFormularioService.getTiposFormulario().subscribe((response) => {
        localStorage.tiposFormulario = JSON.stringify(this.tipoFormularioService.extraerTiposFormulario(response));
        console.log(`He actualizado el Tipo de Formulario ${tipoFormulario.nombre}`);
        this.router.navigate(['/tiposFormulario']);
      });
    });
  }
}
