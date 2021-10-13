import { Button, FormInput, Text } from "~/components/_styled";
import FormField from "~/components/formField";

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
        <FormField label="Email" error={errors.email}>
          <FormInput
            name="email"
            placeholder={
              formType === "FORGOT_PASSWORD"
                ? "Enter your email to reset your password"
                : "Enter your email"
            }
            type="email"
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.email}
            error={errors.email}
            autoComplete="on"
          />
        </FormField>
        {formType !== "FORGOT_PASSWORD" && (
          <FormField error={errors.password} label="Password">
            <FormInput
              name="password"
              type="password"
              placeholder={
                formType === "CREATE_ACCOUNT"
                  ? "Enter a secure password"
                  : "Enter your password"
              }
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.password}
              error={errors.password}
            />
          </FormField>
        )}
        {formType === "CREATE_ACCOUNT" && (
          <FormField
            error={errors.confirmPassword}
            label="Confirm your password"
          >
            <FormInput
              name="confirmPassword"
              type="password"
              placeholder="Type your password again here"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.confirmPassword}
              error={errors.confirmPassword}
            />
          </FormField>
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
