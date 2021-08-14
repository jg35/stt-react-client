import Button from "~/components/button";

export default function PublishStepper({
  stepBack,
  saveProgress,
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
    <div className="flex justify-between border-b-2 border-lightGray p-2 px-4 items-center">
      <div className="w-36">
        {currentStep > 1 && (
          <Button
            disabled={isSubmitting}
            onClick={() => stepBack(currentStep - 1)}
          >
            Back
          </Button>
        )}
      </div>
      <div className="flex justify-around p-4  w-8/12">
        {steps.map((step, i) => (
          <span
            key={i}
            className={`font-bold ${currentStep !== i + 1 && "text-gray"}`}
          >
            {step}
          </span>
        ))}
      </div>

      <div className="w-36">
        {currentStep !== steps.length && (
          <Button type="submit" variant="secondary" inProgress={isSubmitting}>
            {submitText}
          </Button>
        )}
      </div>
    </div>
  );
}
