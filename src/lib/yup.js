import * as Yup from "yup";

export const EventSchema = Yup.object().shape({
  id: Yup.number(),
  title: Yup.string().required(),
  date: Yup.string().required(),
  type: Yup.string().default("EVENT"),
});

export const FragmentSchema = Yup.object().shape({
  id: Yup.number(),
  content: Yup.string()
    .default("")
    .test("content", "Content is required", function (value) {
      if (this.parent.type !== "PHOTO") {
        return !!value;
      }
      return true;
    }),
  date: Yup.string().default(null).nullable(),
  dateType: Yup.string().default(null).nullable(),
  mediaCaption: Yup.string().default(null).nullable(),
  mediaUrl: Yup.string()
    .test("mediaUrl", "Media url is required", function (value) {
      if (this.parent.type === "PHOTO") {
        return !!value;
      }
      return true;
    })
    .default(null)
    .nullable(),
  questionId: Yup.number().default(null).nullable(),
  tag: Yup.string().default(null).nullable(),
  type: Yup.string().required(),
});
