import { FormInput } from "~/components/_styled";
import FormField from "~/components/formField";
import DatePicker from "~/components/dateInput";

export default function EventForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
  setFieldError,
}) {
  return (
    <>
      <FormField error={errors.title} label="Name">
        <FormInput
          autoFocus
          name="title"
          placeholder="Event name..."
          handleChange={(e) => {
            handleChange(e);
            const length = e.target.value.replace(/\s/g, "").length;

            setFieldError(
              "title",
              length > 50
                ? "Your event name cannot be more than 50 characters long"
                : null
            );
          }}
          handleBlur={handleBlur}
          value={values.title}
          error={errors.title}
        />
      </FormField>

      <DatePicker
        smartDate={values.smartDate}
        error={errors.date}
        date={values.date}
        handleChange={(newDate) => {
          setFieldValue("date", newDate);
          setFieldValue("smartDate.isSmartDate", false);
        }}
      />
    </>
  );
}
