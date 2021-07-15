import { DateTime } from "luxon";

export const getImgIxSrc = (s3Path) => {
  return s3Path.replace(
    "https://poggl.s3.eu-west-2.amazonaws.com",
    process.env.REACT_APP_IMGIX_BASE_URL
  );
};

export const getTrialDaysRemaining = (trialExpireDate) => {
  const now = DateTime.utc();
  const expiresDate = DateTime.fromISO(trialExpireDate);
  const daysReamaining = expiresDate.diff(now, "days");

  // Return min days, i.e. 2.2 days left displays as 3 days
  const minDays = Math.ceil(daysReamaining.toObject().days);
  return minDays;
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
