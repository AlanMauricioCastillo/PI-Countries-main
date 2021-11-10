
export default function Validador(input) {
  let errors = {};
  if (!input.name) {
    errors.Nombre = "Input name cannot be empty";
  }
  if (input.countryId.length < 1) {
    errors.Country = "Should choose at least one country";
  }
  
  return errors;
}