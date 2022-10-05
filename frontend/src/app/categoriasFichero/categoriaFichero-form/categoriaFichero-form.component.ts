import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { CategoriaFicheroImpl } from '../models/categoriaFichero-impl';
import { CategoriaFicheroService } from '../service/categoriaFichero.service';

@Component({
  selector: 'app-categoriaFichero-form',
  templateUrl: './categoriaFichero-form.component.html',
  styleUrls: []
})
export class CategoriaFicheroFormComponent implements OnInit {
  /**
   * variable con la que guardar la nueva categoria de fichero
   */
  categoriaFichero: CategoriaFicheroImpl = new CategoriaFicheroImpl();
  /**
   * variable para icono "volver"
   */
  faVolver = faArrowAltCircleLeft;

  /**
   * 
   * @param categoriaFicheroService Para usar los metodos propios de CategoriaFichero
   * @param router Para redirigir
   */
  constructor(
    private categoriaFicheroService: CategoriaFicheroService,
    private router: Router) { }

  /**
   * metodo para crear una nueva categoria de fichero y volver al listado de categorias de fichero
   * - actualiza localStorage
   */  
  ngOnInit() {  }
  crearCategoriaFichero(): void {
    this.categoriaFicheroService.create(this.categoriaFichero).subscribe((response) => {
      this.categoriaFicheroService.getCategoriasFichero().subscribe((response) => {
        localStorage.categoriasFichero = JSON.stringify(this.categoriaFicheroService.extraerCategoriasFichero(response));
        console.log(`He creado la Categoría de Fichero ${this.categoriaFichero.nombre}`);
        this.router.navigate(['/categoriasFichero']);
      });
    });
  }
}