import { Button, FormInput, Grid } from "~/components/_styled";
import FormError from "~/components/formError";

export default function EmailForm({
  handleSubmit,
  handleChange,
  handleBlur,
  errors,
  values,
  isSubmitting,
  dirty,
  formType,
  syncing,
}) {
  function getSubmitText() {
    if (syncing) {
      return "Syncing user...";
    }
    switch (formType) {
      case "LOGIN":
        return isSubmitting ? "Logging in..." : "Login";
      case "CREATE_ACCOUNT":
        return isSubmitting ? "Creating account..." : "Create account";
      case "FORGOT_PASSWORD":
        return isSubmitting ? "Sending email..." : "Send reset email";
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} id="email-form">
        <FormInput
          name="email"
          placeholder="Your email"
          type="email"
          handleChange={handleChange}
          handleBlur={handleBlur}
          value={values.email}
          error={errors.email}
        />
        <FormError error={errors.email} />
        {formType !== "FORGOT_PASSWORD" && (
          <>
            <FormInput
              name="password"
              type="password"
              placeholder="Enter password"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.password}
              error={errors.password}
            />
            <FormError error={errors.password} />
          </>
        )}
        <div className="flex">
          <Button
            type="submit"
            variant="cta"
            inProgress={syncing || isSubmitting}
            disabled={!dirty}
          >
            {getSubmitText()}
          </Button>
        </div>
      </form>
    </>
  );
}
