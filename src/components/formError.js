import upperFirst from "lodash/upperFirst";

export default function FormError({ error, lowercase = false }) {
  return (
    <span className="block h-8 text-red">
      {!lowercase ? upperFirst(error) : error}
    </span>
  );
}
