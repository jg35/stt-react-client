import Page from "~/components/page";
import { Button, Card, FormInput, Title, Text } from "~/components/_styled";

function Row({ css = "", children }) {
  return <div className={`flex flex-wrap py-2 ${css}`}>{children}</div>;
}

function Column({ size = "flex-1", children }) {
  return <div className={`px-2 ${size}`}>{children}</div>;
}

function ComponentLibraryItem({ title, children }) {
  return (
    <Column>
      <div className="p-2 border-dashed rounded border border-gray">
        {children}
      </div>
      <div className="mt-2 text-gray">{title}</div>
    </Column>
  );
}

function ComponentSection({ title, children }) {
  return (
    <>
      <Row>
        <Column>
          <Title>{title}</Title>
        </Column>
      </Row>
      <Row css="border-b border-lightGray pb-6 mb-6">{children}</Row>
    </>
  );
}

export default function ComponentLibrary({}) {
  return (
    <Page minimal>
      <ComponentSection title="Buttons">
        <ComponentLibraryItem title="Minimal (Size: Compact)">
          <Button size="compact" variant="minimal">
            Minimal
          </Button>
        </ComponentLibraryItem>

        <ComponentLibraryItem title="Default (Size: Default)">
          <Button>Default Button</Button>
        </ComponentLibraryItem>

        <ComponentLibraryItem title="Secondary (Size: Default)">
          <Button variant="secondary">Secondary</Button>
        </ComponentLibraryItem>

        <ComponentLibraryItem title="CTA (Size: Large)">
          <Button variant="cta" size="large">
            Sign up!
          </Button>
        </ComponentLibraryItem>
        <ComponentLibraryItem title="CTA (In Progress: true) (Size: Large)">
          <Button variant="cta" size="large" inProgress={true}>
            Signing up...
          </Button>
        </ComponentLibraryItem>
      </ComponentSection>

      <ComponentSection title="Cards">
        <ComponentLibraryItem title="Card (Size: Compact)">
          <Card size="compact">Compact card</Card>
        </ComponentLibraryItem>
        <ComponentLibraryItem title="Card (Size: Default)">
          <Card size="large">Default card</Card>
        </ComponentLibraryItem>
        <ComponentLibraryItem title="Card (Size: Large)">
          <Card size="large">Large card</Card>
        </ComponentLibraryItem>
      </ComponentSection>

      <ComponentSection title="Form inputs">
        <ComponentLibraryItem title="Input: text (empty)">
          <FormInput placeholder="An empty input" />
        </ComponentLibraryItem>
        <ComponentLibraryItem title="Input: text (value)">
          <FormInput value="With a value" />
        </ComponentLibraryItem>
        <ComponentLibraryItem title="Input: text (error)">
          <FormInput value="With an error" error={true} />
        </ComponentLibraryItem>
      </ComponentSection>

      <ComponentSection title="Typography">
        <ComponentLibraryItem title="Titles">
          <Title size="compact">Compact</Title>
          <Title size="default">Default</Title>
          <Title size="large">Large</Title>
        </ComponentLibraryItem>
        <ComponentLibraryItem title="Text">
          <Text size="compact">Compact</Text>
          <Text size="default">Default</Text>
          <Text size="large">Large</Text>
          <Text size="callout">Callout</Text>
        </ComponentLibraryItem>
      </ComponentSection>
    </Page>
  );
}
