import Button from "~/components/button";
import Page from "~/components/page";

function Title({ children }) {
  return <h1 className="text-xl">{children}</h1>;
}

function Row({ css = "", children }) {
  return <div className={`flex flex-wrap py-2 ${css}`}>{children}</div>;
}

function Column({ size = "flex-1", children }) {
  return <div className={`px-2 ${size}`}>{children}</div>;
}

function ComponentLibraryItem({ title, children }) {
  return (
    <Column>
      <div className="p-2 border-dashed border border-gray">{children}</div>
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

      <ComponentSection title="Cards"></ComponentSection>
    </Page>
  );
}
