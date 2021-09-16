import React, { useContext } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router";
import { Formik } from "formik";
import Modal from "~/components/modal";

import useToastMessage from "~/hooks/useToastMessage";
import { OnboardingSchema } from "~/lib/yup";
import { UPDATE_USER } from "~/lib/gql";
import FormError from "~/components/formError";
import CountrySelect from "~/components/countrySelect";
import DatePicker from "~/components/capture/datepicker";
import { Button, FormLabel, Title, Text } from "~/components/_styled";
import { AuthContext } from "~/components/authWrap";
import { useEffect } from "react";
import { getHTMLTranslation } from "~/lib/util";

export default function UserDeailsForm() {
  const { setError } = useToastMessage();
  const {
    authState: { dbUser, user },
  } = useContext(AuthContext);
  const [updateUser] = useMutation(UPDATE_USER);

  useEffect(() => {
    document.querySelector("#page").classList.add("blur");
    return () => {
      document.querySelector("#page").classList.remove("blur");
    };
  }, []);

  function submitForm(values) {
    return updateUser({
      variables: { userId: dbUser.id, data: values },
      update(cache, { data }) {
        const updateUser = data.update_stt_user_by_pk;
        cache.modify({
          id: cache.identify(dbUser),
          fields: {
            dob: () => updateUser.dob,
            location: () => updateUser.location,
          },
        });
      },
    });
  }

  return (
    <Modal isOpen size="md" canClose={false}>
      <div className="h-full flex flex-col">
        <Title css="text-center">
          {getHTMLTranslation("components.onboarding.userDetailsForm.welcome", [
            { key: "FIRST_NAME", value: user.displayName.split(" ")[0] },
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
                  <FormLabel>Date of birth</FormLabel>
                  <DatePicker
                    popperPlacement="top-start"
                    minDate={new Date().setYear(new Date().getFullYear() - 100)}
                    maxDate={new Date().setYear(new Date().getFullYear() - 18)}
                    placeholder="DD/MM/YYYY"
                    error={errors.dob}
                    date={values.dob}
                    handleChange={(newDate) => {
                      setFieldValue(
                        "dob",
                        newDate.toISOString().replace(/T.*/, "")
                      );
                    }}
                  />
                  <FormError error={errors.dob} />
                </div>
                <div
                  className="flex-1 form-control"
                  style={{ marginBottom: "10px" }}
                >
                  <FormLabel>Your country</FormLabel>
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

              <Button
                type="submit"
                size="large"
                variant="cta"
                inProgress={isSubmitting}
              >
                {isSubmitting ? "Creating timeline..." : "Create timeline"}
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
