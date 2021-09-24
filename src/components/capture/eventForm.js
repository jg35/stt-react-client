import { useContext } from "react";
import { FormInput } from "~/components/_styled";
import FormField from "~/components/formField";
import DatePicker from "~/components/capture/datepicker";
import { AuthContext } from "~/components/authWrap";
import { getDatePickerAgeCaption } from "~/lib/util";
import { pick } from "lodash";

export default function EventForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
  tutorialInProgress,
}) {
  const {
    authState: { dbUser },
  } = useContext(AuthContext);
  return (
    <>
      <FormField error={errors.title}>
        <FormInput
          autoFocus={!tutorialInProgress}
          name="title"
          placeholder="Enter event title"
          handleChange={handleChange}
          handleBlur={handleBlur}
          value={values.title}
          error={errors.title}
        />
      </FormField>

      <FormField
        label="Date"
        error={errors.date}
        caption={getDatePickerAgeCaption(values.date, dbUser.dob)}
      >
        <DatePicker
          smartDate={pick(values, ["smartDateReason", "isSmartDate"])}
          error={errors.date}
          date={values.date}
          handleChange={(newDate) => {
            setFieldValue("date", newDate.toISOString().replace(/T.*/, ""));
          }}
        />
      </FormField>
    </>
  );
}
