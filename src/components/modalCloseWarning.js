import Card from "~/components/card";
import Button from "~/components/button";

export default function ModalCloseWarning({
  text = "⚠️ You have unsaved changes. Are you sure you want to continue?",
  isOpen,
  close,
  back,
}) {
  return (
    isOpen && (
      <div
        className="animate-fade-in absolute min-w-full h-full bg-lightestGray left-0 top-0"
        style={{ zIndex: 999999 }}
      >
        <Card
          css="min-h-full w-full bg-white p-4 flex flex-col justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-medium my-10 text-xl mx-auto text-center">
            {text}
          </p>
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
