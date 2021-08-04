import * as Yup from "yup";
import { v4 as uuid } from "uuid";

export const AccessTokenPrivateSchema = Yup.object().shape({
  id: Yup.number(),
  email: Yup.string().ensure().email(),
});

export const PrivacySettingsForm = Yup.object().shape({
  privacyStatus: Yup.string().default("PRIVATE"),
  tokens: Yup.array().of(AccessTokenPrivateSchema).default([]),
  newToken: AccessTokenPrivateSchema,
});

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
    .test("content", "Add your memory", function (value) {
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
  id: Yup.string().default(() => uuid()),
  size: Yup.number().default(5),
  content: Yup.string().default("My new element"),
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
  imagePlacement: Yup.string().default("cover"),
  bgColor: Yup.string().default("#f8f8f8"),
  elements: Yup.array().of(CoverElementSchema).default([]),
});

export const ThemeSchema = Yup.object().shape({
  fontFamily: Yup.string().default("Libre Baskerville"),
  fontSize: Yup.string().default("14pt"),
  chapterFontSize: Yup.string().default("21pt"),
  lineHeight: Yup.string().default("1.4"),
  cover: CoverSchema,
});

export const VersionSchema = Yup.object().shape({
  id: Yup.number(),
  edited: Yup.boolean().default(false),
  theme: ThemeSchema,
  title: Yup.string().required(),
  author: Yup.string().required(),
  publishedAt: Yup.string().required("Publication date is required"),
  privacyStatus: Yup.string().default("PRIVATE"),
  // TODO - do we want this part of the version form?
  // tokens: Yup.array().of(AccessTokenPrivateSchema).default([]),
});

export const UserSettingsSchema = Yup.object()
  .shape({
    dob: Yup.string().required("Set your date of birth").default(""),
    location: Yup.string().required("Set your location"),
  })
  .noUnknown();
