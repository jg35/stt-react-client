import { Card, Container, Title, Text } from "~/components/_styled";
import { getHTMLTranslation } from "~/lib/util";

export default function AuthCard({ title, children: content }) {
  return (
    <Container
      background={{
        color: "lightestGray",
      }}
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-4">
        <Card
          css="border border-gray md:p-6 max-w-full bg-white"
          style={{ width: "450px" }}
        >
          <a href={process.env.REACT_APP_HOME_URL} title="Go to homepage">
            <Title css="mb-6 text-center brand text-4xl md:text-4xl">
              {getHTMLTranslation("routes.login.app.name")}
            </Title>
          </a>
          {title && (
            <Text css="mb-4 text-center text-lg text-offBlack">{title}</Text>
          )}
          {content}
        </Card>
      </div>
    </Container>
  );
}
