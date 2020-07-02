export default function validarCrearProducto(valores) {
  let errores = {};

  //Validar el nombre de usuario
  if (!valores.nombre) {
    errores.nombre = "El nombre del producto es obligatorio";
  }
  //Validar empresa
  if (!valores.empresa) {
    errores.empresa = "El nombre de empresa es obligatirio";
  }
  //Validar URL
  if (!valores.url) {
    errores.url = "La url del producto es obligatoria";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "URL Invalida";
  }
  //Validar Descripcion
  if (!valores.descripcion) {
    errores.descripcion = "Agrega una descripcion de tu producto";
  }
  return errores;
}
