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
