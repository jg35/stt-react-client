import { FormInput, FormLabel, Title } from "~/components/_styled";
import DatePicker from "~/components/dateInput";
import FormError from "~/components/formError";
import { getHTMLTranslation } from "~/lib/util";

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
        {getHTMLTranslation("components.publish.publishOptionsForm.details")}
      </Title>

      <div className="form-control w-full">
        <FormLabel>Title</FormLabel>
        <FormInput
          name="title"
          placeholder="The all important title - no pressure!"
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

      <DatePicker
        label="Publication date"
        popperPlacement="top-start"
        insideModal={false}
        useDateFinder={false}
        date={values.publishedAt}
        error={errors.publishedAt}
        handleChange={(newDate) => {
          setFieldValue("publishedAt", newDate);
        }}
      />
    </div>
  );
}
