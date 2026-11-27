// labelled input with its validation message underneath
function FormField({ label, name, type = 'text', value, onChange, error, autoComplete }) {
  const id = `field-${name}`;
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default FormField;
