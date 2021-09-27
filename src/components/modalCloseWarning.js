import { Button, Card, Title } from "~/components/_styled";

export default function ModalCloseWarning({
  text = "⚠️ You have unsaved changes. Are you sure you want to continue?",
  isOpen,
  close,
  back,
}) {
  return (
    isOpen && (
      <div
        className="animate-fade-in absolute min-w-full min-h-full h-full bg-lightestGray left-0 top-0 rounded-2xl"
        style={{ zIndex: 999999 }}
      >
        <Card
          css="min-h-full h-full w-full bg-white p-4 flex flex-col justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Title css="mb-6 mx-auto text-center">{text}</Title>
          <div className="flex justify-center">
            <Button variant="minimal" css="w-36" onClick={back}>
              Go back
            </Button>
            <Button css="w-36" onClick={close}>
              Yes
            </Button>
          </div>
        </Card>
      </div>
    )
  );
}
