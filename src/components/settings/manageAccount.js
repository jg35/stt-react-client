import { useState } from "react";
import { useMutation } from "@apollo/client";
import useLogout from "~/hooks/useLogout";
import { ACTION_DELETE_USER } from "~/lib/gql";
import {
  Button,
  FormInput,
  FormLabel,
  Title,
  Text,
} from "~/components/_styled";
import useToastMessage from "~/hooks/useToastMessage";
import Modal from "~/components/modal";
import { Formik } from "formik";
import { DeleteAccountSchema } from "~/lib/yup";
import FormError from "~/components/formError";

export default function ManageAccount({ dbUser }) {
  const logout = useLogout();
  const [deleteAccount] = useMutation(ACTION_DELETE_USER);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  return (
    <div className="animate-fade-in">
      <Title>Manage my account</Title>

      {/* TODO */}
      {/* <Title size="compact">My data</Title>
      <Text size="large">
        To export your data, please click on one of the options below. Your
        export will be emailed to you when it's ready.
      </Text> */}

      <Title size="compact">Delete my account</Title>

      <Text size="large">
        If you would like to keep your book online and preserve your data
        consider cancelling your subscription instead. Published books will stay
        online regardless of your subscription status.
      </Text>
      <Text size="large">If you want to delete your account, click below.</Text>
      <Button css="w-auto" onClick={() => setShowDeleteAccountModal(true)}>
        Delete my account
      </Button>
      <Modal
        isOpen={showDeleteAccountModal}
        close={() => setShowDeleteAccountModal(false)}
      >
        <Title>Delete your account</Title>

        <Text size="large">
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
        </Text>
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
                  <FormLabel className="label">
                    Enter "Delete my account and all of my data" to continue
                  </FormLabel>
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
                <div className="flex justify-end">
                  <Button
                    onClick={() => setShowDeleteAccountModal(false)}
                    variant="cta"
                    css="mr-1 md:w-40"
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    inProgress={isSubmitting}
                    disabled={!dirty || errors.confirm}
                    css="ml-1 md:w-40"
                    type="submit"
                  >
                    {isSubmitting ? "Deleting..." : "Delete account"} ⚠️
                  </Button>
                </div>
              </form>
            );
          }}
        </Formik>
      </Modal>
    </div>
  );
}
