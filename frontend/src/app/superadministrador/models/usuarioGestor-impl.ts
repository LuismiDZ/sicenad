import { Cenad } from "./cenad";
import { UsuarioGestor } from "./usuarioGestor";

export class UsuarioGestorImpl implements UsuarioGestor {
  idUsuario: string;
  nombre: string;
  password: string;
  tfno: string;
  email: string;
  cenad: Cenad;
  tipo:string;
  descripcion:string;
  url: string;
  
  constructor() {}
  getId(url: string): string {
    return url.slice(url.lastIndexOf('/') + 1, url.length);
  }
}