import { isEqual } from "lodash";
import { DateTime } from "luxon";

function getHemisphere(countryCode) {
  // TODO get lib to calculate this
  return countryCode === "GB" ? "NORTH" : "SOUTH";
}

function getCurrentSeason(day, month, currentYear) {
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

function getSeasonTitle(
  location,
  seasonStartMonth,
  seasonStartYear,
  seasonNextYear
) {
  const hemisphere = getHemisphere(location);
  let seasonName;
  switch (seasonStartMonth) {
    case 3:
      seasonName = hemisphere === "SOUTH" ? "Autumn" : "Spring";
      break;
    case 6:
      seasonName = hemisphere === "SOUTH" ? "Winter" : "Summer";
      break;
    case 9:
      seasonName = hemisphere === "SOUTH" ? "Spring" : "Autumn";
      break;
    case 12:
      seasonName = hemisphere === "SOUTH" ? "Summer" : "Winter";
      break;
    default:
      break;
  }
  if (seasonStartMonth === 12) {
    return `${seasonName} ${seasonStartYear}/${seasonNextYear}`;
  }
  return `${seasonName} ${seasonStartYear}`;
}

function getAgeInSeason(dob, season) {
  const diff = season.diff(dob, ["years", "months"]);
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

export function generateTimeline(user, userEvents, worldEvents, fragments) {
  console.time("generateTimeline");
  const fragmentOrder = user.versions[0].fragmentOrder;
  const now = DateTime.utc().toISODate();
  const dob = DateTime.fromISO(user.dob);
  let currentSeason = getCurrentSeason(dob.day, dob.month, dob.year);
  const seasonTimeline = [];

  while (currentSeason.toISODate() < now) {
    const season = {
      startDate: currentSeason.toISODate(),
      endDate: currentSeason
        .plus({ months: 3 })
        .minus({ seconds: 1 })
        .toISODate(),
      year:
        currentSeason.month === 12
          ? currentSeason.year + 1
          : currentSeason.year,
      title: getSeasonTitle(
        user.location,
        currentSeason.month,
        currentSeason.toFormat("yy"),
        currentSeason.plus({ years: 1 }).toFormat("yy")
      ),
      age: getAgeInSeason(dob, currentSeason),
    };
    season.fragments = fragments.filter((fragment) => {
      return (
        fragment.date >= season.startDate && fragment.date <= season.endDate
      );
    });
    const dateOrder = season.fragments.map((f) => f.id);
    season.fragments.sort((a, b) => {
      return fragmentOrder[a.id] < fragmentOrder[b.id] ? -1 : 1;
    });
    const sortOrder = season.fragments.map((f) => f.id);
    season.orderType = "AUTO";
    if (dateOrder.length && sortOrder.length) {
      const diff = !isEqual(dateOrder, sortOrder);
      if (diff) {
        season.orderType = "MANUAL";
      }
    }

    season.firstFragmentId = season.fragments[0]
      ? season.fragments[0].id
      : null;
    season.events = userEvents.filter((event) => {
      return event.date >= season.startDate && event.date <= season.endDate;
    });
    season.worldEvents = worldEvents.filter((event) => {
      return event.date >= season.startDate && event.date <= season.endDate;
    });
    seasonTimeline.push(season);
    currentSeason = currentSeason.plus({ months: 3 });
  }

  const sortedFragments = [...fragments].sort((a, b) => {
    return fragmentOrder[a.id] < fragmentOrder[b.id] ? -1 : 1;
  });
  console.timeEnd("generateTimeline");
  return [sortedFragments, seasonTimeline];
}
