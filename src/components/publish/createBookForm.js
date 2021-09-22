import { Button, Title } from "~/components/_styled";
import ManagePrivacyStatus from "~/components/accessList/managePrivacyStatus";
import FormHandleAvailabilityInput from "~/components/formHandleAvailabilityInput";
import AccessListStatusButton from "~/components/accessList/accessListStatusButton";
import { getHTMLTranslation } from "~/lib/util";

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
      className="pt-10 md:pt-20 w-12/12 lg:w-6/12 mx-auto px-4"
      style={{ maxWidth: "768px" }}
    >
      {!savedHandle && (
        <div className="mb-6">
          <Title tag="h2">
            {getHTMLTranslation("components.publish.createBookForm.setHandle")}
          </Title>
          <FormHandleAvailabilityInput
            value={values.publicHandle}
            error={errors.publicHandle}
            handleBlur={handleBlur}
            handleChange={handleChange}
            setFieldError={setFieldError}
            setFieldValue={setFieldValue}
            savedHandle={savedHandle}
          />
        </div>
      )}

      <div className="mb-6">
        <Title tag="h2">
          {getHTMLTranslation(
            "components.publish.createBookForm.shareSettings"
          )}
        </Title>
        <ManagePrivacyStatus
          showLabel={false}
          privacyStatus={values.privacyStatus}
          setPrivacyStatus={(val) => setFieldValue("privacyStatus", val)}
        />
      </div>

      <div className="mb-12">
        {values.privacyStatus === "PRIVATE" && (
          <AccessListStatusButton size="default" />
        )}
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          size="large"
          disabled={!isValid}
          inProgress={isSubmitting}
          variant="cta"
          css="md:w-60"
        >
          {isSubmitting ? "Creating your book..." : "Create your book"}
        </Button>
      </div>
    </div>
  );
}
