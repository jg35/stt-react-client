import * as Yup from "yup";

export const EventSchema = Yup.object().shape({
  id: Yup.number(),
  title: Yup.string().required("Give your event a name").default(""),
  date: Yup.string().required("Add a date"),
  type: Yup.string().default("EVENT"),
});

export const FragmentSchema = Yup.object().shape({
  id: Yup.number(),
  content: Yup.string()
    .default("")
    .test("content", "Add some text", function (value) {
      if (this.parent.type !== "PHOTO") {
        return !!value;
      }
      return true;
    }),
  date: Yup.string().ensure().required(),
  dateType: Yup.string().default(null).nullable(),
  mediaCaption: Yup.string().default(null).nullable(),
  mediaUrl: Yup.string()
    .test("mediaUrl", "Upload a photo to continue", function (value) {
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

export const OnboardingSchema = Yup.object().shape({
  location: Yup.string().default("").required("Location is required"),
  dob: Yup.string().default("").required("Date of birth is required"),
});
