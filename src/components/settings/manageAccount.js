import { useState } from "react";
import { useMutation } from "@apollo/client";
import useLogout from "~/hooks/useLogout";
import { ACTION_DELETE_USER } from "~/lib/gql";
import SubmitButton from "~/components/submitButton";
import useToastMessage from "~/hooks/useToastMessage";
import Modal from "~/components/modal";
import { Formik } from "formik";
import { DeleteAccountSchema } from "~/lib/yup";
import FormInput from "~/components/formInput";
import Button from "~/components/button";
import FormError from "~/components/formError";

export default function ManageAccount({ dbUser }) {
  const logout = useLogout();
  const [deleteAccount] = useMutation(ACTION_DELETE_USER);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  return (
    <div className="animate-fade-in">
      <p className="font-medium mb-4 text-xl mx-auto bg-white py-2 text-left w-full">
        Manage my account
      </p>

      <p className="text-lg my-2">
        If you would like to delete your account please click below.
      </p>
      <Button css="w-auto" onClick={() => setShowDeleteAccountModal(true)}>
        Delete my account
      </Button>
      <Modal
        isOpen={showDeleteAccountModal}
        close={() => setShowDeleteAccountModal(false)}
      >
        <p className="font-medium mb-4 text-xl mx-auto bg-white py-2 text-left w-full">
          Delete your account
        </p>

        <p className="text-lg mb-10">
          Has it really come to this? We will be sad to see you go.
          <br />
          <br />
          Proceeding will cancel any active subscription and schedule your
          account for deletion in <strong>14 days</strong>.
          <br />
          <br />
          All of your data will be <strong>permanently deleted</strong> and your
          book will no longer accessible online. If you want to keep your book
          online, consider cancelling your subscription instead.
          <br />
          <br />
          If you change your mind, login within the next 14 days to restore your
          account.
        </p>
        <Formik
          initialValues={DeleteAccountSchema.cast()}
          validationSchema={DeleteAccountSchema}
          onSubmit={() => {
            return deleteAccount().then(() => {
              logout();
              localStorage.removeItem("uiState");
            });
          }}
        >
          {({
            handleSubmit,
            values,
            errors,
            handleChange,
            handleBlur,
            isSubmitting,
            dirty,
          }) => {
            return (
              <form
                onSubmit={handleSubmit}
                id="delete-account-modal-form"
                className=""
              >
                <div className="form-control">
                  <label className="label">
                    Enter "Delete my account and all of my data" to continue
                  </label>
                  <FormInput
                    value={values.confirm}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    name="confirm"
                    placeholder="Delete my account and all of my data"
                    error={errors.confirm}
                  />
                  <FormError error={errors.confirm} />
                </div>
                <SubmitButton
                  isSubmitting={isSubmitting}
                  disabled={!dirty || errors.confirm}
                  width="w-full"
                  formId="delete-account-modal-form"
                >
                  {isSubmitting ? "Deleting..." : "Delete account"} ⚠️
                </SubmitButton>
              </form>
            );
          }}
        </Formik>
      </Modal>
    </div>
  );
}
