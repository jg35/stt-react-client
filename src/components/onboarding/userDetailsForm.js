import React, { useContext } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router";
import { Formik } from "formik";

import useToastMessage from "~/hooks/useToastMessage";
import { OnboardingSchema } from "~/lib/yup";
import { UPDATE_USER } from "~/lib/gql";
import FormError from "~/components/formError";
import CountrySelect from "~/components/countrySelect";
import DatePicker from "~/components/capture/datepicker";
import SubmitButton from "~/components/submitButton";
import { AuthContext } from "~/components/authWrap";
import { useEffect } from "react/cjs/react.development";

export default function UserDeailsForm() {
  const { setError } = useToastMessage();
  const history = useHistory();
  const {
    authState: { user },
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
      variables: { userId: user.id, data: values },
      update(cache, { data }) {
        cache.modify({
          fields: {
            stt_user_by_pk(user = {}) {
              return { ...user, ...data.update_stt_user_by_pk };
            },
          },
        });
      },
    });
  }

  return (
    <div className="min-h-full w-screen absolute top-0 left-0 flex justify-center items-center z-40 bg-transparent">
      <div className="w-96 h-3/6 rounded shadow-xl p-4 bg-white border-2 border-black h-auto flex flex-col justify-between animate-fade-in">
        <div className="h-full flex flex-col">
          <h1 className="text-2xl text-center">
            Hello {user.displayName.split(" ")[0]}! 👋
          </h1>
          <p className="text-lg my-6">
            Let's fill in your date of birth and location so we can setup your
            timeline.
          </p>

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
                    <label>Date of birth</label>
                    <DatePicker
                      minDate={new Date().setYear(
                        new Date().getFullYear() - 100
                      )}
                      maxDate={new Date().setYear(
                        new Date().getFullYear() - 18
                      )}
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
                    <label>Your country</label>
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

                <SubmitButton
                  bigCta
                  formId="user-details-form"
                  style={{ width: "100%" }}
                  isSubmitting={isSubmitting}
                >
                  {isSubmitting ? "Creating timeline..." : "Create timeline"}
                </SubmitButton>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
