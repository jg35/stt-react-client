import DatePicker from "~/components/capture/datepicker";
import FormField from "~/components/formField";
import { FormInput, FormLabel } from "~/components/_styled";

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
            name="content"
            placeholder="Enter chapter name"
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.content}
            error={errors.content}
          />
        </FormField>
      )}

      <FormField label="Date" error={errors.date}>
        <DatePicker
          date={values.date}
          error={errors.date}
          handleChange={(newDate) => {
            setFieldValue("date", newDate.toISOString().replace(/T.*/, ""));
            setFieldValue("dateType", "MANUAL");
          }}
        />
      </FormField>
    </>
  );
}
