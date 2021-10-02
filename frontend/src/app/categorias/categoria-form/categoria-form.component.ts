import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/categoria';
import { CategoriaImpl } from '../models/categoria-impl';
import { CategoriaService } from '../service/categoria.service';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit {

  idCenad: string = "";
  categoria = new CategoriaImpl();
  categorias: Categoria[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private activateRoute: ActivatedRoute) { }


  ngOnInit() {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.categoriaService.getCategoriasDeCenad(this.idCenad).subscribe((response) => this.categorias = this.categoriaService.extraerCategorias(response));
    this.categoria.cenad = `${environment.hostSicenad}cenads/${this.idCenad}`;
  }

  crearCategoria(): void {
    this.categoriaService.create(this.categoria).subscribe((response) => {
            console.log(`He creado la Categoria ${this.categoria.nombre}`);
      this.router.navigate([`/categorias/${this.idCenad}`]);
      //console.log(response);
      // this.categoria.cenad = this.categoriaService.mapearCenad(response).url;
    });

    //  setTimeout(()=> {
    // //   console.log(this.categoria);
    //   this.categoriaService.create(this.categoria).subscribe((response) => {
    //   console.log(`He creado la Categoria ${this.categoria.nombre}`);
    //   this.router.navigate([`/categorias/${this.idCenad}`]);
    //  });
    //  }, 500);

  }

}
