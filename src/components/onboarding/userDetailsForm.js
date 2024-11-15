import React, { useContext } from "react";
import { useMutation } from "@apollo/client";

import { Formik } from "formik";
import Modal from "~/components/modal";

import useToastMessage from "~/hooks/useToastMessage";
import { OnboardingSchema } from "~/lib/yup";
import { ACTION_UPDATE_USER_DETAILS } from "~/lib/gql";
import FormError from "~/components/formError";
import CountrySelect from "~/components/countrySelect";
import SimpleDateInput from "~/components/simpleDateInput";
import { Button, FormLabel, Title, Text } from "~/components/_styled";
import { AuthContext } from "~/components/authWrap";
import { useEffect } from "react";
import { getHTMLTranslation } from "~/lib/util";
import { refreshToken } from "~/lib/firebase";

export default function UserDeailsForm() {
  const { setError } = useToastMessage();
  const {
    authState: { user },
  } = useContext(AuthContext);
  const [updateUser] = useMutation(ACTION_UPDATE_USER_DETAILS);

  useEffect(() => {
    document.querySelector("#page").classList.add("blur");
    return () => {
      document.querySelector("#page").classList.remove("blur");
    };
  }, []);

  function submitForm(values) {
    return updateUser({
      variables: { data: values },
      update: async (cache, { data }) => {
        const { updated } = data.action_update_user_details;
        if (updated) {
          await refreshToken();
          // Reset cache as session variable has changed
          cache.reset();
        }
      },
    });
  }

  return (
    <Modal isOpen size="sm" canClose={false} noScroll>
      <div className="h-full flex flex-col">
        <Title css="text-center">
          {getHTMLTranslation("components.onboarding.userDetailsForm.welcome", [
            {
              key: "FIRST_NAME",
              value: user.displayName
                ? ` ${user.displayName.split(" ")[0]}`
                : "",
            },
          ])}
        </Title>
        <Text size="large">
          {getHTMLTranslation(
            "components.onboarding.userDetailsForm.description"
          )}
        </Text>

        <Formik
          initialValues={OnboardingSchema.cast()}
          onSubmit={(values) =>
            submitForm(values).catch((e) => {
              setError(e, {
                ref: "UPDATE",
                params: ["account"],
              });
            })
          }
          validationSchema={OnboardingSchema}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <form
              onSubmit={handleSubmit}
              id="user-details-form"
              className="flex-1 flex flex-col h-full justify-between"
            >
              <div className=" user-details-form">
                <div
                  className="flex-1 form-control"
                  style={{ marginBottom: "10px" }}
                >
                  <FormLabel>Select your country</FormLabel>
                  <CountrySelect
                    name="location"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.location}
                    error={errors.location}
                  />
                  <FormError error={errors.location} />
                </div>
              </div>

              <div className="mb-6">
                <SimpleDateInput
                  label="Enter your date of birth"
                  error={errors.dob}
                  date={values.dob}
                  handleChange={(newDate) => {
                    setFieldValue("dob", newDate);
                  }}
                />
              </div>

              <Button type="submit" variant="cta" inProgress={isSubmitting}>
                {isSubmitting ? "Creating timeline..." : "Create timeline"}
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
