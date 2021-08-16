import { Grid, Button, Text } from "~/components/_styled";

export default function PublishStepper({
  stepBack,
  currentStep,
  steps,
  isSubmitting,
}) {
  const totalSteps = steps.length;
  let submitText;
  if (isSubmitting) {
    submitText = currentStep === totalSteps ? "Publishing..." : "Saving...";
  } else {
    submitText = currentStep === totalSteps ? "Publish" : "Save";
  }
  return (
    <Grid
      colSpan={[
        "col-span-6 md:col-span-3",
        "col-span-6 md:col-span-3 md:order-3",
        "col-span-12 md:col-span-6 md:order-2",
      ]}
      css="border-b-2 border-lightGray items-center p-2"
    >
      <div className="flex-justify-start">
        {currentStep > 1 && (
          <Button
            css="w-32"
            variant="minimal"
            disabled={isSubmitting}
            onClick={() => stepBack(currentStep - 1)}
          >
            Back
          </Button>
        )}
      </div>

      <div className="flex justify-end">
        {currentStep !== steps.length && (
          <Button
            css="w-32"
            type="submit"
            variant="secondary"
            inProgress={isSubmitting}
          >
            {submitText}
          </Button>
        )}
      </div>
      <div className="flex justify-around">
        {steps.map((step, i) => (
          <Text
            tag="span"
            key={i}
            css={`font-bold ${currentStep !== i + 1 && "text-gray"}`}
          >
            {step}
          </Text>
        ))}
      </div>
    </Grid>
  );
}
