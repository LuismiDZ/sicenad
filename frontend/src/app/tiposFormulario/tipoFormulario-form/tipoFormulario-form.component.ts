import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { TipoFormularioImpl } from '../models/tipoFormulario-impl';
import { TipoFormularioService } from '../service/tipoFormulario.service';

@Component({
  selector: 'app-tipoFormulario-form',
  templateUrl: './tipoFormulario-form.component.html',
  styleUrls: []
})
export class TipoFormularioFormComponent implements OnInit {
  /**
   * variable para guardar el nuevo tipo de formulario
   */
  tipoFormulario: TipoFormularioImpl = new TipoFormularioImpl();
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

  ngOnInit() {
  }

  /**
   * metodo que crea un tipo de formulario y vuelve al listado de tipos de formulario
   *
   * Tambien actualizo el localStorage
   */
  crearTipoFormulario(): void {
    this.tipoFormularioService.create(this.tipoFormulario).subscribe((response) => {
      this.tipoFormularioService.getTiposFormulario().subscribe((response) => {
        localStorage.tiposFormulario = JSON.stringify(this.tipoFormularioService.extraerTiposFormulario(response));
        console.log(`He creado el Tipo de Formulario ${this.tipoFormulario.nombre}`);
        this.router.navigate(['/tiposFormulario']);
      });
    });
  }
}
