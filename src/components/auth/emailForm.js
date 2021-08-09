import SubmitButton from "~/components/submitButton";
import Button from "~/components/button";
import FormInput from "~/components/formInput";
import FormError from "~/components/formError";

export default function EmailForm({
  handleSubmit,
  handleChange,
  handleBlur,
  errors,
  values,
  isSubmitting,
  dirty,
  authView,
  resetForm,
  formSchema,
  setAuthView,
}) {
  function setAuthViewHandler(newView) {
    resetForm({
      values: formSchema.cast(),
    });
    setAuthView(newView);
  }

  function getSubmitText(isSubmitting) {
    switch (authView) {
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
        {authView === "CREATE_ACCOUNT" && (
          <div className="flex">
            <div className="pr-2">
              <FormInput
                name="firstName"
                autoFocus={authView === "CREATE_ACCOUNT"}
                placeholder="Your first name"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.firstName}
                error={errors.firstName}
              />
              <FormError error={errors.firstName} />
            </div>
            <div className="pl-2">
              <FormInput
                name="lastName"
                autoFocus={false}
                placeholder="Your last name"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.lastName}
                error={errors.lastName}
              />
              <FormError error={errors.lastName} />
            </div>
          </div>
        )}
        <FormInput
          autoFocus
          name="email"
          autoFocus={authView !== "CREATE_ACCOUNT"}
          placeholder="Your email"
          handleChange={handleChange}
          handleBlur={handleBlur}
          value={values.email}
          error={errors.email}
        />
        <FormError error={errors.email} />
        {authView !== "FORGOT_PASSWORD" && (
          <>
            <FormInput
              name="password"
              type="password"
              autoFocus={false}
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
          <SubmitButton
            isSubmitting={isSubmitting}
            disabled={!dirty}
            formId="email-form"
            width="w-full"
          >
            {getSubmitText(isSubmitting)}
          </SubmitButton>
        </div>
      </form>
      <div className="flex justify-between pt-4">
        <div>
          {authView === "LOGIN" ? (
            <Button
              minimal
              css="w-full"
              onClick={() => setAuthViewHandler("CREATE_ACCOUNT")}
            >
              Create an account
            </Button>
          ) : (
            <Button
              minimal
              css="w-full"
              onClick={() => setAuthViewHandler("LOGIN")}
            >
              Back
            </Button>
          )}
        </div>
        <div>
          {authView === "LOGIN" && (
            <Button
              minimal
              css="w-full"
              onClick={() => setAuthViewHandler("FORGOT_PASSWORD")}
            >
              Forgotten password?
            </Button>
          )}
        </div>
      </div>
    </>
  );
}