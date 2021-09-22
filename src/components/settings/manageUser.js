import { Formik } from "formik";
import { useMutation, gql } from "@apollo/client";
import { UserSettingsSchema } from "~/lib/yup";
import { ACTION_UPDATE_USER_DETAILS } from "~/lib/gql";
import { refreshToken } from "~/lib/firebase";

import DatePicker from "~/components/capture/datepicker";
import CountrySelect from "~/components/countrySelect";
import FormField from "~/components/formField";
import { Button, Title, Grid } from "~/components/_styled";

import useToastMessage from "~/hooks/useToastMessage";

export default function UserSettings({ dbUser }) {
  const [updateUser] = useMutation(ACTION_UPDATE_USER_DETAILS);
  const { setError } = useToastMessage();

  function updateUserHandler(values) {
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
              <div>
                <Grid colSpan={["col-span-12"]}>
                  <FormField label="Date of birth" error={errors.dob}>
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
                  </FormField>
                  <FormField label="Your country" error={errors.location}>
                    <CountrySelect
                      name="location"
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      value={values.location}
                      error={errors.location}
                    />
                  </FormField>
                </Grid>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="cta"
                  css="md:w-36"
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
