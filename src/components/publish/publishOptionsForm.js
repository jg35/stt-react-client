import FormInput from "@src/components/formInput";
import DatePicker from "@src/components/capture/datepicker";
import FormError from "@src/components/formError";

export default function PublishOptionsForm({
  values,
  setFieldValue,
  handleBlur,
  handleChange,
  errors,
}) {
  return (
    <div
      className="flex flex-col justify-center pt-20 w-6/12 mx-auto"
      style={{ maxWidth: "600px" }}
    >
      <p className="font-medium mb-6 text-xl">
        Lets start with a few bits of information to help eReaders and other
        devices understand your book
      </p>

      <div className="form-control w-full">
        <label>Title</label>
        <FormInput
          name="title"
          placeholder="The all important title - no pressure! 😊"
          handleChange={handleChange}
          handleBlur={handleBlur}
          value={values.title}
          error={errors.title}
        />
        <FormError error={errors.title} />
      </div>
      <div className="form-control w-full">
        <label>Author</label>
        <FormInput
          name="author"
          placeholder="Author name (probably you!)"
          handleChange={handleChange}
          handleBlur={handleBlur}
          value={values.author}
          error={errors.author}
        />
        <FormError error={errors.author} />
      </div>
      <div className="form-control w-full">
        <label>Publication date</label>
        <DatePicker
          date={values.publishedAt}
          error={errors.publishedAt}
          handleChange={(newDate) => {
            setFieldValue(
              "publishedAt",
              newDate.toISOString().replace(/T.*/, "")
            );
          }}
        />
        <FormError error={errors.publishedAt} />
      </div>
    </div>
  );
}
