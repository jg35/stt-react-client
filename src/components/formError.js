import { upperFirst } from "lodash";

export default function FormError({ error }) {
  console.log(JSON.stringify(error, null, 2));
  return <span className="block h-6 text-red mt-2">{upperFirst(error)}</span>;
}
