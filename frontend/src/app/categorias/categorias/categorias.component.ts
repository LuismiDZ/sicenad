import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../models/categoria';
import { CategoriaImpl } from '../models/categoria-impl';
import { CategoriaService } from '../service/categoria.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  //variable para recuperar el id del CENAD/CMT
  idCenad: string = "";
  //variable que recoge todas las categorias del cenad
  categorias: Categoria[] = [];
  //variable que posibilita la comunicacion de datos con el otro componente para mostrar los datos de una categoria
  categoriaVerDatos: Categoria;

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
    , private activateRoute: ActivatedRoute) { }

    ngOnInit(): void {
    //recuperamos el id del CENAD de la barra de navegacion
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    //metemos en la variable todas las categorias del cenad
    this.categorias = JSON.parse(localStorage.getItem(`categorias_${this.idCenad}`));
    }

    //metodo que asigna los datos de la categoria para la comunicacion al otro componente
    verDatos(categoria: Categoria): void {
      this.categoriaVerDatos = categoria;
    }

    //metodo que materializa la eliminacion de una categoria y vuelve al listado de categorias del cenad
    onCategoriaEliminar(categoria: CategoriaImpl): void {
      this.categoriaService.delete(categoria).subscribe(response => {
        //actualizamos el localStorage
        this.categoriaService.getCategoriasPadreDeCenad(this.idCenad).subscribe((response) => localStorage.setItem(`categoriasPadre_${this.idCenad}`, JSON.stringify(this.categoriaService.extraerCategorias(response))));
        this.categoriaService.getCategoriasDeCenad(this.idCenad).subscribe((response) => {
          localStorage.setItem(`categorias_${this.idCenad}`, JSON.stringify(this.categoriaService.extraerCategorias(response)));
          console.log(`He borrado la Categoria ${categoria.nombre}`);
          this.router.navigate([`/principalCenad/${this.idCenad}/categorias/${this.idCenad}`]);
        });
      });
    }

    //metodo que materializa la edicion de una categoria y vuelve al listado de categorias del cenad
    onCategoriaEditar(categoria: CategoriaImpl): void {
      this.categoriaService.update(categoria).subscribe(response => {
        //actualizamos el localStorage
        this.categoriaService.getCategoriasPadreDeCenad(this.idCenad).subscribe((response) => localStorage.setItem(`categoriasPadre_${this.idCenad}`, JSON.stringify(this.categoriaService.extraerCategorias(response))));
        this.categoriaService.getCategoriasDeCenad(this.idCenad).subscribe((response) => {
          localStorage.setItem(`categorias_${this.idCenad}`, JSON.stringify(this.categoriaService.extraerCategorias(response)));
          console.log(`He actualizado la Categoria ${categoria.nombre}`);
          this.router.navigate([`/principalCenad/${this.idCenad}/categorias/${this.idCenad}`]);
        });
      });
    }
  }