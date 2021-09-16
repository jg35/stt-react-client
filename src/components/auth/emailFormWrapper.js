import { Formik } from "formik";
import {
  EmailForgotSchema,
  EmailLoginSchema,
  EmailCreateSchema,
} from "~/lib/yup";
import EmailForm from "~/components/auth/emailForm";

export default function EmailFormWrapper({ submit, authView, setAuthView }) {
  function getSchema() {
    switch (authView) {
      case "LOGIN":
        return EmailLoginSchema;
      case "CREATE_ACCOUNT":
        return EmailCreateSchema;
      case "FORGOT_PASSWORD":
        return EmailForgotSchema;
    }
  }

  return (
    <div>
      <Formik
        validationSchema={getSchema()}
        enableReinitialize
        initialValues={getSchema().cast()}
        onSubmit={(form, formBag) => {
          return submit(form).catch((err) => {
            switch (err.code) {
              case "auth/user-not-found":
                formBag.setFieldError(
                  "email",
                  "No user was found with that email addresss"
                );
                break;
              case "auth/email-already-in-use":
                formBag.setFieldError("email", "That email is already in use");
                break;
              case "auth/too-many-requests":
                formBag.setFieldError(
                  "password",
                  "Too many login attempts. Please reset your password or try again later"
                );
                break;
              case "auth/wrong-password":
                formBag.setFieldError(
                  "password",
                  "Your password is incorrect. Reset your password or try again"
                );
                break;
            }
          });
        }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(formProps) => {
          return (
            <EmailForm
              {...formProps}
              setAuthView={setAuthView}
              authView={authView}
              formSchema={getSchema()}
            />
          );
        }}
      </Formik>
    </div>
  );
}
