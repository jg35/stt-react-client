import * as Yup from "yup";
import { capitalize, startCase } from "lodash";
import { v4 as uuid } from "uuid";

import { setLocale } from "yup";

setLocale({
  mixed: {
    required: ({ path, label }) => {
      return capitalize(`${label || startCase(path)} is required`);
    },
  },
});

export const AccessTokenPrivateSchema = Yup.object().shape({
  id: Yup.number(),
  email: Yup.string().ensure().email().required(),
  type: Yup.string().ensure().default("PRIVATE"),
});

export const PrivacySettingsForm = Yup.object().shape({
  publicHandle: Yup.string().ensure(),
  privacyStatus: Yup.string().default("PRIVATE"),
  tokens: Yup.array().of(AccessTokenPrivateSchema).default([]),
  newToken: AccessTokenPrivateSchema,
});

export const EventSchema = Yup.object().shape({
  id: Yup.number(),
  title: Yup.string().ensure().required("Give your event a name"),
  date: Yup.string().ensure().required("Add a date"),
  type: Yup.string().default("EVENT"),
});

export const FragmentSchema = Yup.object().shape({
  id: Yup.number(),
  content: Yup.string()
    .ensure()
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
  type: Yup.string().ensure().required(),
});

export const OnboardingSchema = Yup.object().shape({
  location: Yup.string().ensure().required(),
  dob: Yup.string().label("Date of birth").ensure().required(),
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
  image: Yup.string().ensure(),
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
    publishedAt: Yup.string().label("Publication date").ensure().required(),
    privacyStatus: Yup.string().default("PRIVATE"),
    // Saved on user, but within version flow
    publicHandle: Yup.string()
      .ensure()
      .test("handle-required", "The handle is required", function (value) {
        return publishStep !== 3 || !!value;
      }),
  });

export const UserSettingsSchema = Yup.object()
  .shape({
    dob: Yup.string().required("Set your date of birth").ensure(),
    location: Yup.string().ensure().required("Set your location"),
  })
  .noUnknown();

export const EmailForgotSchema = Yup.object().shape({
  email: Yup.string().email().ensure().required(),
});

export const EmailLoginSchema = Yup.object().shape({
  email: Yup.string().email().ensure().required(),
  password: Yup.string().ensure().required(),
});

export const EmailCreateSchema = Yup.object().shape({
  firstName: Yup.string().ensure().required(),
  lastName: Yup.string().ensure().required(),
  email: Yup.string().email().ensure().required(),
  password: Yup.string()
    .ensure()
    .min(8)
    .matches(
      "^(?=.*[A-Z])(?=.*[a-z])(?=.*[\\d])([A-Za-z\\d]{8,})$",
      "You should have a mix of upper and lowercase numbers & letters"
    )
    .required(),
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
