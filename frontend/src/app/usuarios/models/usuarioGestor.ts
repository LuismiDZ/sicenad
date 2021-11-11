import { Cenad } from "src/app/superadministrador/models/cenad";

export interface UsuarioGestor {
  idUsuario: string;
  nombre: string;
  password: string;
  tfno: string;
  email: string;
  cenad: Cenad | any;
  tipo:string;
  descripcion:string;
  emailAdmitido: boolean;
  url: string;}