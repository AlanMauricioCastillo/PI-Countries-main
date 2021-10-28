
export default function Validador(input) {
  let errors = {};
  if (!input.name) {
    errors.Nombre = "El campo Nombre no puede estar vacio";
  }
  return errors;
}