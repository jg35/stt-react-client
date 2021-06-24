import { isEqual } from "lodash";
import { DateTime } from "luxon";

function getHemisphere(countryCode) {
  // TODO get lib to calculate this
  return countryCode === "GB" ? "NORTH" : "SOUTH";
}

function getDateOfBirthSeason(day, month, currentYear) {
  if (month <= 2 || (month === 3 && day <= 20)) {
    return DateTime.utc(currentYear - 1, 12, 21);
  } else if (month <= 5 || (month === 6 && day <= 20)) {
    return DateTime.utc(currentYear, 3, 21);
  } else if (month <= 8 || (month === 9 && day <= 20)) {
    return DateTime.utc(currentYear, 6, 21);
  } else {
    return DateTime.utc(currentYear, 9, 21);
  }
}

function getFirstPeriod(dateOfBirth, timespan) {
  switch (timespan) {
    case "MONTH":
      return dateOfBirth.startOf("day");
    case "YEAR":
      return DateTime.utc(dateOfBirth.year);
    case "SEASON":
      return getDateOfBirthSeason(
        dateOfBirth.day,
        dateOfBirth.month,
        dateOfBirth.year
      );
  }
}

function getNextPeriod(currentPeriod, timespan) {
  switch (timespan) {
    case "MONTH":
      return currentPeriod.plus({ months: 1 });
    case "YEAR":
      return currentPeriod.plus({ years: 1 });
    case "SEASON":
      return currentPeriod.plus({ months: 3 });
  }
}

function getSeasonTitle(
  location,
  seasonStartMonth,
  seasonStartYear,
  seasonNextYear
) {
  const hemisphere = getHemisphere(location);
  let seasonName;
  switch (seasonStartMonth) {
    case "March":
      seasonName = hemisphere === "SOUTH" ? "Autumn" : "Spring";
      break;
    case "June":
      seasonName = hemisphere === "SOUTH" ? "Winter" : "Summer";
      break;
    case "September":
      seasonName = hemisphere === "SOUTH" ? "Spring" : "Autumn";
      break;
    case "December":
      seasonName = hemisphere === "SOUTH" ? "Summer" : "Winter";
      break;
    default:
      break;
  }
  if (seasonStartMonth === "December") {
    return `${seasonName} ${seasonStartYear}/${seasonNextYear}`;
  }
  return `${seasonName} ${seasonStartYear}`;
}

function getPeriodTitle(location, currentPeriod, timespan) {
  const currentMonth = currentPeriod.toFormat("MMMM");
  const currentYear = currentPeriod.toFormat("yyyy");
  const nextYear = currentPeriod.plus({ years: 1 }).toFormat("yy");

  switch (timespan) {
    case "YEAR":
      return currentYear;
    case "MONTH":
      return `${currentMonth} ${currentYear}`;
    case "SEASON":
      return getSeasonTitle(location, currentMonth, currentYear, nextYear);
  }
}

function getPeriodAge(dateOfBirth, currentPeriod) {
  const diff = currentPeriod.diff(dateOfBirth, ["years", "months"]);
  const { years, months } = diff.toObject();
  const ageMonths = Math.floor(months);
  let ageYears = Math.floor(years);
  if (ageYears <= 0 && ageMonths <= 0) {
    return "Newborn";
  } else if (ageYears <= 0) {
    return `${ageMonths} ${ageMonths === 1 ? "month" : "months"} old`;
  } else {
    return `${ageYears} ${ageYears === 1 ? "year" : "years"} old`;
  }
}

export function generateTimeline(
  user,
  userEvents,
  worldEvents,
  fragments,
  timespan = "YEAR"
) {
  console.time("generateTimeline");
  const fragmentOrder = user.versions[0].fragmentOrder;
  const now = DateTime.utc().toISODate();
  const dateOfBirth = DateTime.fromISO(user.dob);
  // let currentSeason = getCurrentSeason(dob.day, dob.month, dob.year);
  let currentPeriod = getFirstPeriod(dateOfBirth, timespan);
  const timeline = [];

  while (currentPeriod.toISODate() < now) {
    const nextPeriod = getNextPeriod(currentPeriod, timespan);
    const timePeriod = {
      startDate: currentPeriod.toISODate(),
      endDate: nextPeriod.minus({ seconds: 1 }).toISODate(),
      year:
        timespan === "SEASON" && currentPeriod.month === 12
          ? currentPeriod.year + 1
          : currentPeriod.year,
      title: getPeriodTitle(user.location, currentPeriod, timespan),
      age: getPeriodAge(dateOfBirth, currentPeriod, timespan),
    };
    timePeriod.fragments = fragments.filter((fragment) => {
      return (
        fragment.date >= timePeriod.startDate &&
        fragment.date <= timePeriod.endDate
      );
    });
    const dateOrder = timePeriod.fragments.map((f) => f.id);
    timePeriod.fragments.sort((a, b) => {
      return fragmentOrder[a.id] < fragmentOrder[b.id] ? -1 : 1;
    });
    const sortOrder = timePeriod.fragments.map((f) => f.id);
    timePeriod.orderType = "AUTO";
    if (dateOrder.length && sortOrder.length) {
      const diff = !isEqual(dateOrder, sortOrder);
      if (diff) {
        timePeriod.orderType = "MANUAL";
      }
    }

    timePeriod.firstFragmentId = timePeriod.fragments[0]
      ? timePeriod.fragments[0].id
      : null;
    timePeriod.events = userEvents.filter((event) => {
      return (
        event.date >= timePeriod.startDate && event.date <= timePeriod.endDate
      );
    });
    timePeriod.worldEvents = worldEvents.filter((event) => {
      return (
        event.date >= timePeriod.startDate && event.date <= timePeriod.endDate
      );
    });
    timeline.push(timePeriod);

    currentPeriod = nextPeriod;
  }

  const sortedFragments = [...fragments].sort((a, b) => {
    return fragmentOrder[a.id] < fragmentOrder[b.id] ? -1 : 1;
  });
  console.timeEnd("generateTimeline");
  return [sortedFragments, timeline];
}
