import { FormCaption, FormLabel } from "~/components/_styled";

export default function FormField({ label, error, children: field }) {
  return (
    <div className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      {field}
      <FormCaption variant="error">{error}</FormCaption>
    </div>
  );
}
