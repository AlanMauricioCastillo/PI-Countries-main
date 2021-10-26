
export default function Validador(input) {
  let errors = {};
  if (!input.Nombre) {
    errors.Nombre = "El campo Nombre no puede estar vacio";
  }
  return errors;
}