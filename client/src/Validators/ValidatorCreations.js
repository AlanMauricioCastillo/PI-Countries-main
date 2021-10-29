
export default function Validador(input) {
  let errors = {};
  if (!input.name) {
    errors.Nombre = "El campo Nombre no puede estar vacio";
  }
  if (input.countryId.length < 1) {
    errors.Country = "Debe elegir al menos un pais";
  }
  
  return errors;
}