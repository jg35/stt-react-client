import SubmitButton from "~/components/submitButton";
import ManagePrivacyStatus from "~/components/accessList/managePrivacyStatus";
import AccessListStatusButton from "~/components/accessList/accessListStatusButton";
import FormHandleAvailabilityInput from "~/components/formHandleAvailabilityInput";

export default function PublishOptionsForm({
  values,
  setFieldValue,
  handleBlur,
  handleChange,
  errors,
  isSubmitting,
  setFieldError,
  savedHandle,
  isValid,
}) {
  return (
    <div
      className="flex flex-col justify-center pt-20 w-12/12 lg:w-6/12 mx-auto"
      style={{ maxWidth: "768px" }}
    >
      <p className="font-medium mb-6 text-xl p-2">
        Decide how you would like to share your book
      </p>

      <div className="mb-6">
        <ManagePrivacyStatus
          privacyStatus={values.privacyStatus}
          setPrivacyStatus={(val) => setFieldValue("privacyStatus", val)}
        />

        {values.privacyStatus === "PRIVATE" && (
          <div className="mt-6">
            <AccessListStatusButton userId={values.userId} future={true} />
          </div>
        )}
      </div>

      {!savedHandle && (
        <div className="mt-6">
          <p className="text-xl font-medium">URL handle</p>
          <p className="text-lg mb-4 ">
            Now let's set your handle. This will form the web address where
            readers can access your book.
          </p>
          <FormHandleAvailabilityInput
            value={values.publicHandle}
            error={errors.publicHandle}
            handleBlur={handleBlur}
            handleChange={handleChange}
            setFieldError={setFieldError}
            savedHandle={savedHandle}
          />
        </div>
      )}

      <div className="mx-auto mt-6">
        <SubmitButton
          disabled={!isValid}
          isSubmitting={isSubmitting}
          bigCta
          width="w-60"
          formId="publish-new-version-form"
        >
          {isSubmitting ? "Creating your book..." : "Create your book"}
        </SubmitButton>
      </div>
    </div>
  );
}
