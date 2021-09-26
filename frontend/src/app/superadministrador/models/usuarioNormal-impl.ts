import { UsuarioNormal } from "./usuarioNormal";

export class UsuarioNormalImpl implements UsuarioNormal {
  idUsuario: string;
  nombre: string;
  password: string;
  tfno: string;
  email: string;
  unidad: string;
  tipo: string;
  url: string;
  
  constructor() {}
  getId(url: string): string {
    return url.slice(url.lastIndexOf('/') + 1, url.length);
  }
}