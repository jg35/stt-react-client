import DatePicker from "~/components/capture/datepicker";
import FormError from "~/components/formError";
import FormInput from "~/components/formInput";

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
        <div className="form-control">
          <FormInput
            name="content"
            placeholder="Enter chapter name"
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.content}
            error={errors.content}
          />
          <FormError error={errors.content} />
        </div>
      )}

      <div className="form-control">
        <label>Date</label>
        <DatePicker
          date={values.date}
          error={errors.date}
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
