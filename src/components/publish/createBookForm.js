import FormInput from "~/components/formInput";
import FormError from "~/components/formError";
import SubmitButton from "~/components/submitButton";

export default function PublishOptionsForm({
  values,

  handleBlur,
  handleChange,
  errors,
  isSubmitting,
}) {
  return (
    <div
      className="flex flex-col justify-center pt-20 w-10/12 md:w-6/12 mx-auto"
      style={{ maxWidth: "600px" }}
    >
      <p className="font-medium mb-6 text-xl">
        Finally set your sharing password. You'll give this to anyone you want
        to share your book with, so don't use your normal password!
      </p>

      <div className="form-control w-full my-10">
        <label>
          Think of a good password to keep your book private and secure
        </label>
        <FormInput
          name="sharePassword"
          placeholder="Your password should be at least 8 characters"
          handleChange={handleChange}
          handleBlur={handleBlur}
          value={values.sharePassword}
          error={errors.sharePassword}
        />
        <FormError error={errors.sharePassword} />
      </div>

      <SubmitButton isSubmitting={isSubmitting} bigCta width="w-60">
        {isSubmitting ? "Creating your book..." : "Create your book"}
      </SubmitButton>
    </div>
  );
}
