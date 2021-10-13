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
  setFieldError,
}) {
  return (
    <>
      <FormField error={errors.title} label="Name">
        <FormInput
          autoFocus
          name="title"
          placeholder="Your event name..."
          handleChange={(e) => {
            handleChange(e);
            const length = e.target.value.replace(/\s/g, "").length;

            setFieldError(
              "title",
              length > 30
                ? "Your event name cannot be more than 30 characters long"
                : null
            );
          }}
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
