import FormError from "@src/components/formError";
import FormInput from "@src/components/formInput";
import DatePicker from "@src/components/capture/datepicker";

export default function EventForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
}) {
  return (
    <>
      <div className="form-control">
        <FormInput
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
        <label>Date</label>
        <DatePicker
          error={errors.date}
          date={values.date}
          handleChange={(newDate) => {
            setFieldValue("date", newDate.toISOString().replace(/T.*/, ""));
            setFieldValue("dateType", "MANUAL");
          }}
        />
        <FormError error={errors.date} />
      </div>
    </>
  );
}
