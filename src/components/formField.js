import { FormCaption, FormLabel } from "~/components/_styled";

export default function FormField({
  label,
  caption = null,
  error,
  children: field,
  css,
}) {
  return (
    <div className={`flex flex-col ${css}`}>
      <FormLabel css="mb-1">{label}</FormLabel>
      {field}
      <FormCaption variant={error ? "error" : "info"}>
        {caption || error}
      </FormCaption>
    </div>
  );
}
