import { upperFirst } from "lodash";

export default function FormError({ error }) {
  return <span className="block h-8 text-red">{upperFirst(error)}</span>;
}
