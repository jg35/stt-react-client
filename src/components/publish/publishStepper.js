import { Grid, Button, Text } from "~/components/_styled";

export default function PublishStepper({
  stepBack,
  currentStep,
  steps,
  isSubmitting,
}) {
  let submitText;
  if (isSubmitting) {
    submitText = "Saving";
  } else {
    submitText = "Save";
  }
  return (
    <Grid
      colSpan={[
        "col-span-4 md:col-span-3",
        "col-span-4 md:col-span-6",
        "col-span-4 md:col-span-3",
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
            css="w-auto md:w-32 h-10"
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
