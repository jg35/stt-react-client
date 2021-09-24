import { DateTime } from "luxon";
import React from "react";
import tailwindProperties from "~/tailwindProperties.json";
import translations from "~/translations.json";
import { overrideTailwindClasses } from "tailwind-override";

export const getTrialDaysRemaining = (trialExpireDate) => {
  const now = DateTime.utc();
  const expiresDate = DateTime.fromISO(trialExpireDate);
  const daysReamaining = expiresDate.diff(now, "days");

  // Return min days, i.e. 2.2 days left displays as 3 days
  const minDays = Math.ceil(daysReamaining.toObject().days);
  return minDays;
};

export const getAge = (dob) => {
  const now = DateTime.utc();
  const dobDate = DateTime.fromISO(dob);
  const dobYears = now.diff(dobDate, "years");
  return Math.floor(dobYears.toObject().years);
};

export const getAgeFromDate = (dob, startDate, endDate) => {
  const start = DateTime.fromISO(dob);
  const end = DateTime.fromISO(
    startDate && endDate ? getMedianDate(startDate, endDate) : startDate
  );
  return Math.floor(end.diff(start, "years").toObject().years);
};

export const getDatePickerAgeCaption = (date, dob) =>
  date ? `You were ${getAgeFromDate(dob, date)} years old on this date` : null;

export const getDateOnAge = (dob, ageYears) => {
  const ageDate = DateTime.fromISO(dob).plus({ years: ageYears });
  return ageDate.toISODate();
};

export const getMedianDate = (startDate, endDate) => {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);
  const dayDiff = Math.floor(end.diff(start, "days").toObject().days / 2);
  return start.plus({ days: dayDiff }).toISODate();
};

export const getDateDiff = (startDate, endDate, diffUnit) => {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);
  return end.diff(start, diffUnit).toObject()[diffUnit];
};

export const getNumAsWord = (num) => {
  if (num <= 10) {
    return {
      _1: "One",
      _2: "Two",
      _3: "Three",
      _4: "Four",
      _5: "Five",
      _6: "Six",
      _7: "Seven",
      _8: "Eight",
      _9: "Nine",
      _10: "Ten",
    }[`_${num}`];
  }
  return num;
};

export const renderFragmentDate = (date) => {
  return DateTime.fromISO(date).toFormat("ccc d MMM yyyy");
};

export const renderVersionDate = (date) => {
  return DateTime.fromISO(date).toFormat("d MMM yyyy");
};

export const renderInformalDate = (date) => {
  return DateTime.fromISO(date).toFormat("cccc d MMMM");
};

export const buildGoogleFontFaceString = (selectedFonts) => {
  return selectedFonts
    .map((font) => {
      return `@import url('https://fonts.googleapis.com/css2?family=${font.family.replace(
        /\s/g,
        "+"
      )}&display=swap');`;
    })
    .join("\n");
};

export const joinTailwindClasses = (classes) => {
  return overrideTailwindClasses(classes.join(" ").trim(), {
    tailwindProperties,
  });
};

export const getTranslationString = (key, params = []) => {
  const translationRaw = translations[key];
  if (!key) {
    console.error(`No translation key found for key: ${key}`);
    return "";
  } else {
    let translation = translationRaw;
    params.forEach(({ key, value }) => {
      translation = translation.replace(`{{${key}}}`, value);
    });
    return translation;
  }
};

export const getHTMLTranslation = (key, params = []) => {
  const translationRaw = translations[key];
  if (!key) {
    console.error(`No translation key found for key: ${key}`);
    return "";
  } else {
    let translation = translationRaw;
    params.forEach(({ key, value }) => {
      translation = translation.replace(`{{${key}}}`, value);
    });
    return <span dangerouslySetInnerHTML={{ __html: translation }} />;
  }
};

export const getSmartDate = (
  { startAge, endAge, startDate, endDate },
  userDob,
  isQuestion = false
) => {
  let date = "";
  let smartDateReason = {
    confidence: 10,
    date: "",
    reason: "",
    startDate: null,
    endDate: null,
    ageOnDate: null,
  };
  // TODO if a question is in all category (no start age || end age, date is 100%)
  // TODO if something is in last senior age cateogry (start age with no max age) date is again 100% accurate

  function getConfidence(startDate, endDate) {
    const smartDateConfidence = [
      // Offset the index
      0,
      // 1 week
      1,
      // 2 weeks
      2,
      // 4 weeks
      4,
      // 10 weeks
      10,
      // 1 year
      52,
      // 2 years
      104,
      // 3 years
      156,
      // 4 years
      208,
    ];

    const diffWeeks = getDateDiff(startDate, endDate, "weeks");

    const confidenceIndex = smartDateConfidence.findIndex(
      (endWeek) => diffWeeks <= endWeek
    );
    const accuracyFactor =
      1 - (confidenceIndex !== -1 ? confidenceIndex / 10 : 1);
    return Math.floor(100 * accuracyFactor);
  }

  if (endAge === null && startDate === null) {
    smartDateReason.confidence = 0;
  } else if (startDate && !endDate) {
    smartDateReason.startDate = startDate;
    date = startDate;
    smartDateReason.confidence = 100;
    smartDateReason.reason = isQuestion
      ? "QUESTION_SPECIFIC_DATE"
      : "FRAGMENT_SPECIFIC_DATE";
  } else if (startDate && endDate) {
    smartDateReason.startDate = startDate;
    smartDateReason.endDate = endDate;
    date = getMedianDate(startDate, endDate);
    smartDateReason.confidence = getConfidence(startDate, endDate);
    smartDateReason.reason = isQuestion
      ? "QUESTION_RANGE_DATE"
      : "FRAGMENT_RANGE_DATE";
  } else if (!isNaN(startAge) && (isNaN(endAge) || endAge === -1)) {
    date = getDateOnAge(userDob, startAge);
    smartDateReason.startDate = date;
    smartDateReason.reason = isQuestion
      ? "QUESTION_SPECIFIC_AGE_DATE"
      : "FRAGMENT_SPECIFIC_AGE_DATE";
    smartDateReason.confidence = 100;
  } else if (!isNaN(startAge) && !isNaN(endAge)) {
    const startDate = getDateOnAge(userDob, startAge);
    const endDate = getDateOnAge(userDob, endAge);
    smartDateReason.startDate = startDate;
    smartDateReason.endDate = endDate;
    date = getDateOnAge(
      userDob,
      startAge + Math.floor((endAge - startAge) / 2)
    );
    smartDateReason.reason = isQuestion
      ? "QUESTION_SPECIFIC_AGE_RANGE_DATE"
      : "FRAGMENT_SPECIFIC_AGE_RANGE_DATE";
    smartDateReason.confidence = getConfidence(startDate, endDate);
  }

  if (date) {
    smartDateReason.date = date;
    smartDateReason.ageOnDate = getAgeFromDate(userDob, smartDateReason.date);
  }

  return {
    date,
    isSmartDate: date !== "",
    smartDateReason,
  };
};

export const closeHandler = (setIsOpen, closeModal) => {
  const ANIMATE_CLOSE_TIME = 200;
  setIsOpen(false);
  setTimeout(() => {
    closeModal();
  }, ANIMATE_CLOSE_TIME);
};
