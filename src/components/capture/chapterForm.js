import DatePicker from "~/components/dateInput";
import FormField from "~/components/formField";
import { FormInput } from "~/components/_styled";
import { pick } from "lodash";

export default function ChapterForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
  editContent = true,
}) {
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
      <DatePicker
        smartDate={values.smartDate}
        date={values.date}
        error={errors.date}
        handleChange={(newDate) => {
          setFieldValue("date", newDate);
          setFieldValue("smartDate.isSmartDate", false);
        }}
      />
    </>
  );
}
