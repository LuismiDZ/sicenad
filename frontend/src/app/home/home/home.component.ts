import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cenad } from '../models/cenad';
import { CenadImpl } from '../models/cenad-impl';
import { HomeService } from '../service/home-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  inicio: boolean = true;
  idProvinciaSeleccionada: number;
  provinciaSeleccionada: string = "";
  cenads: Cenad[] = [];
  cenadsFiltro: Cenad[] = [];
  idCenad: string;
  provincias = [{idProvincia:15, nombre:"A CORUÑA"}, {idProvincia:1, nombre:"ALAVA"}, {idProvincia:2, nombre:"ALBACETE"},
  {idProvincia:3, nombre:"ALICANTE"}, {idProvincia:4, nombre:"ALMERIA"}, {idProvincia:33, nombre:"ASTURIAS"},
  {idProvincia:5, nombre:"AVILA"}, {idProvincia:6, nombre:"BADAJOZ"}, {idProvincia:8, nombre:"BARCELONA"},
  {idProvincia:9, nombre:"BURGOS"}, {idProvincia:10, nombre:"CACERES"}, {idProvincia:11, nombre:"CADIZ"},
  {idProvincia:39, nombre:"CANTABRIA"}, {idProvincia:12, nombre:"CASTELLON"}, {idProvincia:51, nombre:"CEUTA"},
  {idProvincia:13, nombre:"CIUDAD REAL"}, {idProvincia:14, nombre:"CORDOBA"}, {idProvincia:16, nombre:"CUENCA"},
  {idProvincia:17, nombre:"GIRONA"}, {idProvincia:18, nombre:"GRANADA"}, {idProvincia:19, nombre:"GUADALAJARA"},
  {idProvincia:20, nombre:"GUIPUZCOA"}, {idProvincia:21, nombre:"HUELVA"}, {idProvincia:22, nombre:"HUESCA"},
  {idProvincia:7, nombre:"ILLES BALEARS"}, {idProvincia:23, nombre:"JAEN"}, {idProvincia:26, nombre:"LA RIOJA"},
  {idProvincia:24, nombre:"LEON"}, {idProvincia:25, nombre:"LLEIDA"}, {idProvincia:27, nombre:"LUGO"},
  {idProvincia:28, nombre:"MADRID"}, {idProvincia:29, nombre:"MALAGA"}, {idProvincia:52, nombre:"MELILLA"},
  {idProvincia:30, nombre:"MURCIA"}, {idProvincia:31, nombre:"NAVARRA"}, {idProvincia:32, nombre:"OURENSE"},
  {idProvincia:34, nombre:"PALENCIA"}, {idProvincia:35, nombre:"LAS PALMAS"}, {idProvincia:36, nombre:"PONTEVEDRA"},
  {idProvincia:37, nombre:"SALAMANCA"}, {idProvincia:40, nombre:"SEGOVIA"}, {idProvincia:41, nombre:"SEVILLA"},
  {idProvincia:42, nombre:"SORIA"}, {idProvincia:38, nombre:"STA CRUZ TENERIFE"}, {idProvincia:43, nombre:"TARRAGONA"},
  {idProvincia:44, nombre:"TERUEL"}, {idProvincia:45, nombre:"TOLEDO"}, {idProvincia:46, nombre:"VALENCIA"},
  {idProvincia:47, nombre:"VALLADOLID"}, {idProvincia:48, nombre:"VIZCAYA"}, {idProvincia:49, nombre:"ZAMORA"},
  {idProvincia:50, nombre:"ZARAGOZA"}];

  constructor(private homeService: HomeService, private router: Router) { }

  ngOnInit() {
   this.prueba();

   // this.cargarCenads();

  }

  // función de prueba que crea objetos cenads
  prueba() {
    let cenad1: Cenad = new CenadImpl();
    cenad1.nombre = "CENAD SAN GREGORIO";
    cenad1.provincia = 50;
    let cenad2: Cenad = new CenadImpl();
    cenad2.nombre = "CENAD PRUEBA";
    cenad2.provincia = 50;
    let cenad3: Cenad = new CenadImpl();
    cenad3.nombre = "CMT ALVAREZ DE SOTOMAYOR";
    cenad3.provincia = 4;
    this.cenads.push(cenad1, cenad2, cenad3);
   // console.log(this.cenads);
  }

  // función que carga los diferentes CENAD,s/CMT,s de la API
  cargarCenads() {
    this.homeService.getCenads().subscribe((response) => {
      this.cenads = this.homeService.extraerCenads(response);
    });
    console.log(this.cenads);
  }

  // Asigna al array cenadsFiltro todos los CENAD,s/CMT,s de una provincia
  // se le pasa como parámetro el código de la provincia
  buscarCenads(idProvincia: number): void {
   // console.log(idProvincia);
    this.cenadsFiltro = this.cenads.filter(cenad => {
      if (cenad.provincia == idProvincia) {
        return cenad;
      }
    });
    this.provincias.forEach(p => {
      if (p.idProvincia == idProvincia) {
        this.provinciaSeleccionada = p.nombre;
      }
    });
    //console.log(this.cenadsFiltro);
  }


  // Es invocada desde la capa presentación a través del filtro o al hacer click sobre una provincia
  respuesta(idProvincia: number): void {
    //console.log(idProvincia);
    if (!this.inicio) {
      this.borrarResultado();
    }
    this.buscarCenads(idProvincia);
    this.mostrarResultado();
  }

  // Borra el resultado de la búsqueda
  borrarResultado(): void {
    document.querySelector('.contenedor-resultado').remove();
  }

  // Muestra el resultado de la búsqueda de CENAD,S/CMT,s de una provincia
  mostrarResultado(): void {
    let div = document.createElement('div');
    div.classList.add('contenedor-resultado');
    div.classList.add('p-3');
    let span = document.createElement('span');
    span.classList.add('resultado');
    div.appendChild(span);
    document.querySelector('.titulo-busqueda').insertAdjacentElement('afterend', div);
    let ul = document.createElement('ul');
    if (this.cenadsFiltro.length != 0) {
        this.inicio = false;
        span.insertAdjacentElement('afterbegin', ul);
        this.cenadsFiltro.forEach((cenad)=> {
        ul.insertAdjacentHTML('beforebegin', `<li><a class="nav-link" routerLink="/cenads/${cenad.idCenad}">${cenad.nombre}</a></li>`);
          });
    } else {
      this.inicio = false;
      let span2 = document.createElement('span');
      span2.setAttribute('style', 'font-weight: bold; color: #2f3e46;');
      span2.innerText = "* No existe ningún CENAD/CMT";
      span.insertAdjacentElement('beforebegin', span2);
    }
  }
  // redireccionar(): void {
  //   this.router.navigate([`/cenads/${this.idCenad}`]);
  // }

}
