import { useContext, useState } from "react";
import { FormInput } from "~/components/_styled";
import FormField from "~/components/formField";
import DatePicker from "~/components/dateInput";
import { AuthContext } from "~/components/authWrap";
import { getDatePickerAgeCaption } from "~/lib/util";
import { pick } from "lodash";

export default function EventForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
}) {
  const [showCaption, setShowCaption] = useState(false);
  const {
    authState: { dbUser },
  } = useContext(AuthContext);
  return (
    <>
      <FormField error={errors.title}>
        <FormInput
          autoFocus
          name="title"
          placeholder="Enter event title"
          handleChange={handleChange}
          handleBlur={handleBlur}
          value={values.title}
          error={errors.title}
        />
      </FormField>

      {/* <FormField
        label="Date"
        error={errors.date}
        caption={
          showCaption && getDatePickerAgeCaption(values.date, dbUser.dob)
        }
      > */}
      <DatePicker
        label="Date"
        smartDate={pick(values, ["smartDateReason", "isSmartDate"])}
        error={errors.date}
        setShowCaption={setShowCaption}
        date={values.date}
        handleChange={(newDate) => {
          setFieldValue("date", newDate);
          setFieldValue("isSmartDate", false);
        }}
      />
      {/* </FormField> */}
    </>
  );
}
