import * as Yup from "yup";
import { capitalize, startCase } from "lodash";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";

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
  publicHandle: Yup.string().ensure().required(),
  privacyStatus: Yup.string().default("PRIVATE"),
});

export const EventSchema = (dobIso) =>
  Yup.object().shape({
    id: Yup.number(),
    title: Yup.string()
      .ensure()
      .required("Give your event a name")
      .max(30, "Your event name cannot be more than 30 characters long"),
    date: Yup.string()
      .ensure()
      .required("Add a date")
      .test("is-valid", "Date is not valid", function (value) {
        return DateTime.fromISO(value).isValid;
      })
      .test(
        "is-after-dob",
        `Date cannot be before date of birth`,
        (value) => value >= dobIso
      )
      .test(
        "is-not-in-future",
        "Date cannot be in the future",
        (value) => value <= DateTime.utc().toISODate()
      ),
    type: Yup.string().default("EVENT"),
    isSmartDate: Yup.boolean().default(false),
    smartDateReason: Yup.object()
      .shape({
        ageOnDate: Yup.number().nullable(),
        confidence: Yup.number().nullable(),
        date: Yup.string().nullable(),
        startDate: Yup.string().nullable(),
        endDate: Yup.string().nullable(),
        reason: Yup.string().nullable(),
      })
      .nullable(),
  });

export const FragmentSchema = (dobIso) =>
  Yup.object().shape({
    id: Yup.number(),
    content: Yup.string()
      .ensure()
      .test("content", "Add your memory", function (value) {
        if (this.parent.type !== "PHOTO") {
          return !!value;
        }
        return true;
      }),
    date: Yup.string()
      .ensure()
      .required()
      .test("is-valid", "Date is not valid", function (value) {
        return DateTime.fromISO(value).isValid;
      })
      .test(
        "is-after-dob",
        `Date cannot be before date of birth`,
        (value) => value >= dobIso
      )
      .test(
        "is-not-in-future",
        "Date cannot be in the future",
        (value) => value <= DateTime.utc().toISODate()
      ),
    isSmartDate: Yup.boolean().default(false),
    smartDateReason: Yup.object()
      .shape({
        ageOnDate: Yup.number().nullable(),
        confidence: Yup.number().nullable(),
        date: Yup.string().nullable(),
        startDate: Yup.string().nullable(),
        endDate: Yup.string().nullable(),
        reason: Yup.string().nullable(),
      })
      .nullable(),
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
  location: Yup.string().label("Country").ensure().required(),
  dob: Yup.string()
    .label("Date of birth")
    .ensure()
    .required()
    .test("is-valid", "Date is not valid", function (value) {
      return DateTime.fromISO(value).isValid;
    })
    .test(
      "is-real-age",
      `Year of birth must be on or after 1900`,
      (value) => value >= "1900-01-01"
    )
    .test(
      "is-18",
      "You must be 18 or over to use Stories To Tell",
      (value) => value <= DateTime.utc().minus({ years: 18 }).toISODate()
    ),
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
  bgColor: Yup.string().default("#c1c1c1"),
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
    publishedAt: Yup.string()
      .label("Publication date")
      .ensure()
      .required()
      .test("is-valid", "Date is not valid", function (value) {
        return DateTime.fromISO(value).isValid;
      }),
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
    dob: Yup.string()
      .ensure()
      .required("Set your date of birth")
      .test("is-valid", "Date is not valid", function (value) {
        console.log(value);
        return DateTime.fromFormat(value, "yyyy-MM-dd").isValid;
      })
      .test(
        "is-real-age",
        `Year of birth must be on or after 1900`,
        (value) => value >= "1900-01-01"
      )
      .test(
        "is-18",
        "You must be 18 or over to use Stories To Tell",
        (value) => value <= DateTime.utc().minus({ years: 18 }).toISODate()
      ),
    location: Yup.string().ensure().required("Set your location"),
    hiddenQuestions: Yup.object().shape({
      ids: Yup.array().of(Yup.number()),
      tags: Yup.array().of(Yup.string()),
    }),
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
  email: Yup.string().email().ensure().required(),
  password: Yup.string().ensure().min(8).required(),
  confirmPassword: Yup.string().test(
    "matches-password",
    "Does not match your password",
    function (value) {
      return value === this.parent.password;
    }
  ),
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
