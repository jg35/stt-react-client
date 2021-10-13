import { FormInput } from "~/components/_styled";
import FormField from "~/components/formField";
import DatePicker from "~/components/dateInput";
import { pick } from "lodash";

export default function EventForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
}) {
  return (
    <>
      <FormField error={errors.title} label="Name">
        <FormInput
          autoFocus
          name="Name"
          placeholder="Your event name..."
          handleChange={handleChange}
          handleBlur={handleBlur}
          value={values.title}
          error={errors.title}
        />
      </FormField>

      <DatePicker
        label="Date"
        smartDate={pick(values, ["smartDateReason", "isSmartDate"])}
        error={errors.date}
        date={values.date}
        handleChange={(newDate) => {
          setFieldValue("date", newDate);
          setFieldValue("isSmartDate", false);
        }}
      />
    </>
  );
}
