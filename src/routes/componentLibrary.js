import Page from "~/components/page";
import {
  Button,
  Card,
  FormInput,
  Title,
  Text,
  Grid,
} from "~/components/_styled";

function ComponentLibraryItem({ title, children }) {
  return (
    <>
      <div className="p-2 border-dashed rounded border border-gray">
        {children}
      </div>
      <div className="mt-2 text-gray">{title}</div>
    </>
  );
}

function ComponentSection({ title, children }) {
  return (
    <>
      <Grid>
        <Title>{title}</Title>
      </Grid>
      <div className="border-b border-lightGray pb-6 mb-6">{children}</div>
    </>
  );
}

export default function ComponentLibrary({}) {
  return (
    <Page minimal>
      <ComponentSection title="Buttons">
        <Grid colSpan={["col-span-6 md:col-span-3"]}>
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
        </Grid>
      </ComponentSection>

      <ComponentSection title="Cards">
        <Grid colSpan={["col-span-12 md:col-span-4"]}>
          <ComponentLibraryItem title="Card (Size: Compact)">
            <Card size="compact">Compact card</Card>
          </ComponentLibraryItem>
          <ComponentLibraryItem title="Card (Size: Default)">
            <Card size="large">Default card</Card>
          </ComponentLibraryItem>
          <ComponentLibraryItem title="Card (Size: Large)">
            <Card size="large">Large card</Card>
          </ComponentLibraryItem>
        </Grid>
      </ComponentSection>

      <ComponentSection title="Form inputs">
        <Grid colSpan={["col-span-12 lg:col-span-4"]}>
          <ComponentLibraryItem title="Input: text (empty)">
            <FormInput placeholder="An empty input" />
          </ComponentLibraryItem>
          <ComponentLibraryItem title="Input: text (value)">
            <FormInput value="With a value" />
          </ComponentLibraryItem>
          <ComponentLibraryItem title="Input: text (error)">
            <FormInput value="With an error" error={true} />
          </ComponentLibraryItem>
        </Grid>
      </ComponentSection>

      <ComponentSection title="Typography">
        <Grid colSpan={["col-span-12 md:col-span-6"]}>
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
        </Grid>
      </ComponentSection>
    </Page>
  );
}
