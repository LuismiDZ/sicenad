import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { UsuarioGestorImpl } from '../../models/usuarioGestor-impl';
import { UsuarioGestorService } from '../../service/usuarioGestor.service';

@Component({
  selector: 'app-usuarioGestor-form',
  templateUrl: './usuarioGestor-form.component.html',
  styleUrls: ['./usuarioGestor-form.component.css']
})
export class UsuarioGestorFormComponent implements OnInit {
  //variable para capturar el id del cenad de la barra de navegacion
  idCenad: string = "";
  //variable en la que se grabara el nuevo usuarioGestor
  usuarioGestor: UsuarioGestorImpl = new UsuarioGestorImpl();
  //variable del icono "volver"
  faVolver = faArrowAltCircleLeft;
  //variable para poner la ruta de vuelta
  volver: string = '';

  constructor(
    private usuarioGestorService: UsuarioGestorService,
    private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //resacata el id del cenad de la barra de navegacion
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.volver = `/principalCenad/${this.idCenad}/usuarios/${this.idCenad}`;
  }

  //metodo para crear un usuarioGestor
  crearUsuarioGestor(): void {
    this.usuarioGestor.cenad = `environment.hostSicenad/cenads/${this.idCenad}`;
    this.usuarioGestorService.create(this.usuarioGestor).subscribe((response) => {
      //actualizo el local storage
      this.usuarioGestorService.getUsuariosGestoresDeCenad(this.idCenad).subscribe((response) => localStorage.setItem(`usuariosGestor_${this.idCenad}`, JSON.stringify(this.usuarioGestorService.extraerUsuarios(response))));
      this.usuarioGestorService.getUsuarios().subscribe((response) => localStorage.usuariosGestor = JSON.stringify(this.usuarioGestorService.extraerUsuarios(response)));
      console.log(`He creado el Usuario Gestor ${this.usuarioGestor.nombre}`);
      this.router.navigate([`/principalCenad/${this.idCenad}/usuarios/${this.idCenad}`]);
    });
  }
}