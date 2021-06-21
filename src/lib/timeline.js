import { DateTime } from "luxon";

function getHemisphere(countryCode) {
  // TODO get lib to calculate this
  return countryCode === "GB" ? "NORTH" : "SOUTH";
}

function getCurrentSeason(day, month, currentYear) {
  if (month <= 2 || (month === 3 && day <= 20)) {
    return DateTime.local(currentYear - 1, 12, 21);
  } else if (month <= 5 || (month === 6 && day <= 20)) {
    return DateTime.local(currentYear, 3, 21);
  } else if (month <= 8 || (month === 9 && day <= 20)) {
    return DateTime.local(currentYear, 6, 21);
  } else {
    return DateTime.local(currentYear, 9, 21);
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

export function generateTimeline(user, worldEvents) {
  console.time("generateTimeline");
  const fragmentOrder = user.versions[0].fragmentOrder;
  const nowMs = DateTime.now().valueOf();
  const dob = DateTime.fromISO(user.dob);
  let currentSeason = getCurrentSeason(dob.day, dob.month, dob.year);
  const seasonTimeline = [];
  // TODO - this is effin slow
  const fragments = [...user.fragments].sort((a, b) =>
    fragmentOrder[a.id] < fragmentOrder[b.id] ? -1 : 1
  );
  while (currentSeason.valueOf() < nowMs) {
    const season = {
      startDate: currentSeason.valueOf(),
      endDate: currentSeason
        .plus({ months: 3 })
        .minus({ seconds: 1 })
        .valueOf(),
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
      const fragmentMs = DateTime.fromISO(fragment.date).valueOf();
      return fragmentMs >= season.startDate && fragmentMs <= season.endDate;
    });
    season.firstFragmentId = season.fragments[0]
      ? season.fragments[0].id
      : null;
    season.events = user.events.filter((event) => {
      const eventMs = DateTime.fromISO(event.date).valueOf();
      return eventMs >= season.startDate && eventMs <= season.endDate;
    });
    season.worldEvents = worldEvents.filter((event) => {
      const eventMs = DateTime.fromISO(event.date).valueOf();
      return eventMs >= season.startDate && eventMs <= season.endDate;
    });
    seasonTimeline.push(season);
    currentSeason = currentSeason.plus({ months: 3 });
  }
  console.timeEnd("generateTimeline");
  return [fragments, seasonTimeline];
}
