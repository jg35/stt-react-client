import { useContext } from "react";
import DatePicker from "~/components/dateInput";
import FormField from "~/components/formField";
import { FormInput, FormLabel } from "~/components/_styled";
import { AuthContext } from "~/components/authWrap";
import { getDatePickerAgeCaption } from "~/lib/util";
import { pick } from "lodash";

export default function ChapterForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
  setFieldError,
  editContent = true,
}) {
  const {
    authState: { dbUser },
  } = useContext(AuthContext);
  return (
    <>
      {editContent && (
        <FormField label="Chapter name" error={errors.content}>
          <FormInput
            autoFocus
            name="content"
            placeholder="Enter chapter name"
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.content}
            error={errors.content}
          />
        </FormField>
      )}

      {/* <FormField
        label="Date"
        error={errors.date}
        caption={getDatePickerAgeCaption(values.date, dbUser.dob)}
      > */}
      <DatePicker
        label="Date"
        smartDate={pick(values, ["smartDateReason", "isSmartDate"])}
        date={values.date}
        error={errors.date}
        handleChange={(newDate) => {
          setFieldValue("date", newDate);
          setFieldValue("isSmartDate", false);
        }}
      />
      {/* </FormField> */}
    </>
  );
}
