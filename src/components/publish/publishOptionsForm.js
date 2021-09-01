import { FormInput, FormLabel, Title } from "~/components/_styled";
import DatePicker from "~/components/capture/datepicker";
import FormError from "~/components/formError";
import { getTranslation } from "~/lib/util";

export default function PublishOptionsForm({
  values,
  setFieldValue,
  handleBlur,
  handleChange,
  errors,
}) {
  return (
    <div
      className="pt-10 md:pt-20 md:w-6/12 mx-auto px-4"
      style={{ maxWidth: "768px" }}
    >
      <Title>
        {getTranslation("components.publish.publishOptionsForm.details")}
      </Title>

      <div className="form-control w-full">
        <FormLabel>Title</FormLabel>
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
        <FormLabel>Author</FormLabel>
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
        <FormLabel>Publication date</FormLabel>
        <DatePicker
          popperPlacement="top-start"
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
