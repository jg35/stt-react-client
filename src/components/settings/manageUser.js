import { Formik } from "formik";
import { useMutation, gql } from "@apollo/client";
import { UserSettingsSchema } from "~/lib/yup";
import { UPDATE_USER } from "~/lib/gql";

import DatePicker from "~/components/capture/datepicker";
import CountrySelect from "~/components/countrySelect";
import FormError from "~/components/formError";
import { Button, Title, FormLabel } from "~/components/_styled";

import useToastMessage from "~/hooks/useToastMessage";

export default function UserSettings({ dbUser }) {
  const [updateUser] = useMutation(UPDATE_USER);
  const { setError } = useToastMessage();

  function updateUserHandler(values) {
    return updateUser({
      variables: { userId: dbUser.id, data: values },
      update(cache, { data }) {
        const { dob, location } = data.update_stt_user_by_pk;
        cache.writeFragment({
          id: cache.identify(dbUser),
          data: {
            dob,
            location,
          },
          fragment: gql`
            fragment user on stt_user {
              dob
              location
            }
          `,
        });
      },
    });
  }
  return (
    <Formik
      initialValues={UserSettingsSchema.cast(dbUser)}
      onSubmit={(values) =>
        updateUserHandler(values).catch((e) => {
          setError(e, { ref: "UPDATE", params: ["account"] });
        })
      }
      validationSchema={UserSettingsSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        dirty,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        values,
      }) => {
        return (
          <div className="animate-fade-in">
            <Title>Update your user settings</Title>
            <form id="manage-user-settings-form" onSubmit={handleSubmit}>
              <div className="form-control">
                <FormLabel>Date of birth</FormLabel>
                <DatePicker
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
              </div>
              <div className="form-control my-6">
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
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="secondary"
                  css="w-36"
                  disabled={!dirty}
                  inProgress={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        );
      }}
    </Formik>
  );
}
