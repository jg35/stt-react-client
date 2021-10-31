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
import Modal from "~/components/modal";
import { Formik } from "formik";
import { DeleteAccountSchema } from "~/lib/yup";
import FormError from "~/components/formError";
import { getHTMLTranslation } from "~/lib/util";
import ManageStripeCustomer from "~/components/settings/manageStripeCustomer";

import AccountActivation from "./accountActivation";

export default function ManageAccount({ dbUser }) {
  const logout = useLogout();
  const [deleteAccount] = useMutation(ACTION_DELETE_USER);
  const [initDeleteModal, setInitDeleteModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function closeHandler() {
    const ANIMATE_CLOSE_TIME = 200;
    setIsOpen(false);
    setTimeout(() => {
      setInitDeleteModal(false);
    }, ANIMATE_CLOSE_TIME);
  }

  return (
    <div className="animate-fade-in">
      <Title css="mb-6">Manage my account</Title>

      {/* TODO */}
      {/* <Title size="compact">My data</Title>
      <Text size="large">
        To export your data, please click on one of the options below. Your
        export will be emailed to you when it's ready.
      </Text> */}

      <AccountActivation />

      {/* <ManageStripeCustomer
        subscriptionStatus={dbUser.subscriptionStatus}
        subscriptionMeta={dbUser.subscriptionMeta}
        stripeCustomerId={dbUser.stripeCustomerId}
      /> */}

      <Title size="compact">Delete your account</Title>
      <Text css="mb-6">
        {getHTMLTranslation(
          "components.settings.manageAccount.delete.continue"
        )}
      </Text>
      <Button
        size="compact"
        onClick={() => {
          setInitDeleteModal(true);
          setIsOpen(true);
        }}
      >
        Delete my account
      </Button>
      {initDeleteModal && (
        <Modal isOpen={isOpen} close={closeHandler}>
          <Title>Delete your account</Title>

          <Text>
            {getHTMLTranslation(
              "components.settings.manageAccount.delete.plea"
            )}
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
                  <div className="form-control mt-6">
                    <FormLabel className="label">
                      Enter "Delete my account and all of my data" to continue
                    </FormLabel>
                    <FormInput
                      value={values.confirm}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      name="confirm"
                      placeholder={`Delete my account and all of my data`}
                      error={errors.confirm}
                    />
                    <FormError error={errors.confirm} />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={closeHandler}
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
      )}
    </div>
  );
}
