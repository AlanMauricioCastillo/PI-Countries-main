export default function Validador(input) {
  let errors = {};
  if (!input.name) {
    errors.Nombre = "Input name cannot be empty";
  }
  if (input.countryId && input.countryId.length < 1) {
    errors.Country = "Should choose at least one country";
  }
  const risk = parseInt(input.risk_level, 10);
  if (risk < 1 || risk > 5) {
    errors.risk_level = "Risk level must be between 1 and 5";
  }
  return errors;
}
