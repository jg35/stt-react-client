import { LinkButton } from "~/components/_styled";

export default function AuthCardLink({ route, children: text }) {
  return (
    <LinkButton variant="minimal" size="compact" href={route} css="w-auto">
      {text}
    </LinkButton>
  );
}
