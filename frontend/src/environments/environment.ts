export const environment = {
  appName: 'Sicenad DEV',
  production: false,
  sizeMaxEscudo: 2, // MB
  sizeMaxDocRecurso: 10, // MB
  sizeMaxDocSolicitud: 10, // MB
  sizeMaxCartografia: 3, // GB
  tiposTiro:  ["Tiro directo", "Tiro indirecto", "Tiro antiaereo"],
  categoriaFicheroCartografia: "1", // es el id de la categoria de fichero "Cartografia", seria la primera en crearse al crear la app
  // endpoint para trabajar en local a H2
  hostSicenad: 'http://localhost:8081/api/'
  // endpoint para trabajar en local a la BD MINERVA
  // hostSicenad: 'http://192.168.100.199:8081/api/'
  // endpoint para atacar la app desplegada en heroku
  // hostSicenad: 'https://sicenad.herokuapp.com/api/'
};
