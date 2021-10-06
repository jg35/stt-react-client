import countries from "~/lib/countries";

export default function CountrySelect({
  handleChange,
  handleBlur,
  value,
  error,
  name,
}) {
  return (
    <select
      id="form-country-select"
      name={name}
      className={`input select ${error && "input-error"} appearance-none`}
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
    >
      <option disabled selected value="">
        Select a country
      </option>
      {countries.map((o, i) => (
        <option value={o.id} key={i} disabled={o.disabled}>
          {o.flag}
          &nbsp;
          {o.name}
        </option>
      ))}
    </select>
  );
}
