import { upperFirst } from "lodash";

export default function FormError({ error }) {
  return <span className="block h-6 text-red mt-2">{upperFirst(error)}</span>;
}
