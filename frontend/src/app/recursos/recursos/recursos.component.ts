import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/categorias/models/categoria';
import { Recurso } from '../models/recurso';
import { RecursoImpl } from '../models/recurso-impl';
import { RecursoService } from '../service/recurso.service';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.css']
})
export class RecursosComponent implements OnInit {

  idCenad: string = "";
  recursos: Recurso[] = [];
  recursoVerDatos: Recurso;
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  recursosFiltrados: Recurso[] = [];
  categoriaSeleccionada: Categoria;
  categoriaSeleccionadaAnterior: Categoria;
  sumaCategoria: number = 1;

  constructor(
    private recursoService: RecursoService,
    private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.recursoService.getRecursosDeCenad(this.idCenad).subscribe((response) => this.recursos = this.recursoService.extraerRecursos(response));
    this.recursoService.getCategoriasPadreDeCenad(this.idCenad).subscribe((response) =>
      this.categoriasFiltradas = this.recursoService.extraerCategorias(response));
    this.recursoService.getCategoriasDeCenad(this.idCenad).subscribe((response) =>
      this.categorias = this.recursoService.extraerCategorias(response));
  }

  verDatos(recurso: Recurso): void {
    this.recursoVerDatos = recurso;
  }

  onRecursoEliminar(recurso: RecursoImpl): void {
    this.recursoService.delete(recurso).subscribe(response => {
      console.log(`He borrado el recurso ${recurso.nombre}`);
      this.router.navigate([`/principalCenad/${this.idCenad}/recursos/${this.idCenad}`]);
    });
  }

  onRecursoEditar(recurso: RecursoImpl): void {
    this.recursoService.update(recurso).subscribe(response => {
      console.log(`He actualizado el recurso ${recurso.nombre}`);
      this.router.navigate([`/principalCenad/${this.idCenad}/recursos/${this.idCenad}`]);
    });
  }
  filtrar() {
    console.log(this.categoriaSeleccionada.nombre);
    this.recursoService.getCategoriaPadre(this.categoriaSeleccionada).subscribe((response) =>
      this.categoriaSeleccionadaAnterior = this.recursoService.mapearCategoria(response));
    this.recursoService.getSubcategorias(this.categoriaSeleccionada).subscribe((response) =>
      this.categoriasFiltradas = this.recursoService.extraerCategorias(response));
    setTimeout(() => {

      if (this.categoriasFiltradas.length === 0) {
        this.recursoService.getRecursosDeCategoria(this.categoriaSeleccionada).subscribe((response) => this.recursos = this.recursoService.extraerRecursos(response));
      }
      else {
        this.recursoService.getRecursosDeSubcategorias(this.categoriaSeleccionada).subscribe((response) => this.recursos = this.recursoService.extraerRecursos(response));
      }
    }, 500);
  }

  borrarFiltros() {
    this.recursoService.getCategoriasPadreDeCenad(this.idCenad).subscribe((response) =>
      this.categoriasFiltradas = this.recursoService.extraerCategorias(response));
    this.recursoService.getRecursosDeCenad(this.idCenad).subscribe((response) => this.recursos = this.recursoService.extraerRecursos(response));
    this.categoriaSeleccionada = null;
  }
}


