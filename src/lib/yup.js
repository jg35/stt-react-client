import * as Yup from "yup";
import { v4 as uuid } from "uuid";

export const AccessTokenPrivateSchema = Yup.object().shape({
  id: Yup.number(),
  email: Yup.string().ensure().email(),
  type: Yup.string().default("PRIVATE"),
});

export const PrivacySettingsForm = Yup.object().shape({
  publicHandle: Yup.string(),
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
  init: Yup.boolean().default(false),
});

export const ThemeSchema = Yup.object().shape({
  cover: CoverSchema,
});

export const VersionSchema = (publishStep, token = "") =>
  Yup.object().shape({
    id: Yup.number(),
    theme: ThemeSchema,
    title: Yup.string().ensure().required(),
    author: Yup.string().ensure().required(),
    publishedAt: Yup.string().ensure().required("Publication date is required"),
    privacyStatus: Yup.string().default("PRIVATE"),
    // Saved on user, but within version flow
    publicHandle: Yup.string().test(
      "handle-required",
      "The handle is required",
      function (value) {
        return publishStep !== 3 || !!value;
      }
    ),
  });

export const UserSettingsSchema = Yup.object()
  .shape({
    dob: Yup.string().required("Set your date of birth").default(""),
    location: Yup.string().required("Set your location"),
  })
  .noUnknown();

export const EmailForgotSchema = Yup.object().shape({
  email: Yup.string().email().ensure().required(),
});

export const EmailLoginSchema = Yup.object().shape({
  email: Yup.string().email().ensure().required(),
  password: Yup.string().ensure().required(),
  // .matches(
  //   "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$",
  //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
  // ),
});

export const EmailCreateSchema = Yup.object().shape({
  firstName: Yup.string().ensure().required(),
  lastName: Yup.string().ensure().required(),
  email: Yup.string().email().ensure().required(),
  password: Yup.string().ensure().required(),
});

export const DeleteAccountSchema = Yup.object().shape({
  confirm: Yup.string()
    .ensure()
    .required("Does not match above expression")
    .matches(
      /Delete my account and all of my data/,
      "Does not match above expression"
    ),
});
