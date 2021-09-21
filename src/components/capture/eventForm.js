import FormError from "~/components/formError";
import { FormInput, FormLabel } from "~/components/_styled";
import DatePicker from "~/components/capture/datepicker";

export default function EventForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
  tutorialInProgress,
}) {
  return (
    <>
      <div className="form-control">
        <FormInput
          autoFocus={!tutorialInProgress}
          name="title"
          placeholder="Enter event title"
          handleChange={handleChange}
          handleBlur={handleBlur}
          value={values.title}
          error={errors.title}
        />
        <FormError error={errors.title} />
      </div>

      <div className="form-control">
        <FormLabel>Date</FormLabel>
        <DatePicker
          error={errors.date}
          date={values.date}
          handleChange={(newDate) => {
            setFieldValue("date", newDate.toISOString().replace(/T.*/, ""));
          }}
        />
        <FormError error={errors.date} />
      </div>
    </>
  );
}
