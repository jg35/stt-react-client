import * as Yup from "yup";
import { v4 as uuid } from "uuid";

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
  title: Yup.string().ensure(),
  type: Yup.string().required(),
});

export const OnboardingSchema = Yup.object().shape({
  location: Yup.string().default("").required("Location is required"),
  dob: Yup.string().default("").required("Date of birth is required"),
});

const Position = Yup.object().shape({
  x: Yup.number().default(0),
  y: Yup.number().default(0),
});

export const CoverElementSchema = Yup.object().shape({
  id: Yup.string().default(uuid()),
  size: Yup.number().default(5),
  content: Yup.string().default("My new element"),
  label: Yup.string().default("Custom element"),
  color: Yup.string().default("#000000"),
  font: Yup.string().default("Libre Baskerville"),
  originalContent: Yup.string().ensure(),
  relativePosition: Position,
  position: Position,
  textAlign: Yup.string().default("left"),
});

export const CoverSchema = Yup.object().shape({
  image: Yup.string().default(""),
  imagePosition: Position,
  imageRelativePosition: Position,
  bgColor: Yup.string().default("#000000"),
  elements: Yup.array().of(CoverElementSchema).default([]),
});

export const ThemeSchema = Yup.object().shape({
  fontFamily: Yup.string().default("theme-family-baskerville"),
  fontSize: Yup.string().default("md"),
  chapterFontSize: Yup.string().default("md"),
  lineHeight: Yup.string().default("md"),
  cover: CoverSchema,
});
