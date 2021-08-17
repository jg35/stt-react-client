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
        "col-span-3 md:col-span-3",
        "col-span-6 md:col-span-6",
        "col-span-3 md:col-span-3",
      ]}
      css="items-center p-2"
    >
      <div className="flex-justify-start">
        {currentStep > 1 && (
          <Button
            css="w-auto md:w-32"
            disabled={isSubmitting}
            onClick={() => stepBack(currentStep - 1)}
          >
            Back
          </Button>
        )}
      </div>

      <div className="flex justify-around items-center">
        {steps.map((step, i) => (
          <Text
            tag="span"
            key={i}
            css={`mb-0 ${
              currentStep !== i + 1 ? "text-gray hidden md:block" : ""
            }`}
          >
            {step}
          </Text>
        ))}
      </div>
      <div className="flex justify-end">
        {currentStep !== steps.length && (
          <Button
            css="w-auto md:w-32"
            type="submit"
            variant="cta"
            inProgress={isSubmitting}
          >
            {submitText}
          </Button>
        )}
      </div>
    </Grid>
  );
}
