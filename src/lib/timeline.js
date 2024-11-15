import { DateTime } from "luxon";
import sortBy from "lodash/sortBy";

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
      return dateOfBirth.startOf("month");
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

export function getPeriodAge(dateOfBirth, currentPeriod) {
  const diff = currentPeriod.diff(dateOfBirth, ["years", "months"]);
  const { years, months } = diff.toObject();
  const ageMonths = Math.floor(months);
  let ageYears = Math.floor(years);
  if (ageYears <= 0 && ageMonths <= 0) {
    return "Newborn";
  } else if (ageYears <= 0) {
    return `${ageMonths} ${ageMonths === 1 ? "month" : "months"}`;
  } else {
    return `${ageYears} ${ageYears === 1 ? "year" : "years"}`;
  }
}

export function generateTimeline(
  {
    stt_user_by_pk: user,
    stt_userEvent: userEvents,
    stt_worldEvent: worldEvents,
    stt_fragment: fragments,
  },
  timespan = "YEAR"
) {
  const sortedFragments = sortBy(fragments, ["date", "order", "id"]);

  const now = DateTime.utc().toISODate();
  const dateOfBirth = DateTime.fromISO(user.dob || "1970-01-01");
  let currentPeriod = getFirstPeriod(dateOfBirth, timespan);
  const timeline = [];
  const inTimeline = [];

  while (currentPeriod.toISODate() < now) {
    const nextPeriod = getNextPeriod(currentPeriod, timespan);
    const timePeriod = {
      startDate: !timeline.length
        ? dateOfBirth.toISODate()
        : currentPeriod.toISODate(),
      endDate: nextPeriod.minus({ seconds: 1 }).toISODate(),
      year: currentPeriod.year,
      title: getPeriodTitle(user.location, currentPeriod, timespan),
      age: getPeriodAge(dateOfBirth, currentPeriod, timespan),
    };
    timePeriod.fragments = sortedFragments.filter((fragment, i) => {
      if (
        fragment.date >= timePeriod.startDate &&
        fragment.date <= timePeriod.endDate
      ) {
        inTimeline.push(fragment.id);
        return true;
      }
      return false;
    });

    timePeriod.userEvents = sortBy(
      userEvents.filter((event) => {
        return (
          event.date >= timePeriod.startDate && event.date <= timePeriod.endDate
        );
      }),
      ["date"]
    );

    timePeriod.worldEvents = sortBy(
      worldEvents.filter((event) => {
        return (
          event.date >= currentPeriod.toISODate() &&
          event.date <= timePeriod.endDate
        );
      }),
      ["date"]
    );
    timeline.push(timePeriod);

    currentPeriod = nextPeriod;
  }

  // Also includes any with dates out of bounds of date of birth
  const undatedMemories = sortedFragments.filter(
    (f) => !inTimeline.includes(f.id)
  );

  return [
    timeline,
    sortedFragments.filter((f) => inTimeline.includes(f.id)),
    undatedMemories,
  ];
}

export function scrollToEditFragment(fragmentId = null, smooth = true) {
  let timelineFragment;

  if (fragmentId) {
    timelineFragment = document.querySelector(
      `div[data-preview-fragment-id="${fragmentId}"]`
    );
  } else {
    timelineFragment = document.querySelector(`div[data-preview-fragment-id]`);
  }

  const previewContainer = document.querySelector(
    ".js-preview-scroll-container"
  );

  const previewFragment = document.querySelector(
    `[data-preview-fragment-id="${fragmentId}"]`
  );

  if (previewFragment && previewContainer) {
    previewContainer.scrollTo({
      top: previewFragment.offsetTop - previewContainer.offsetTop - 10,
      behavior: smooth ? "smooth" : "auto",
    });
  }
}

export function scrollToFragment(fragmentId = null, smooth = true) {
  let timelineFragment;

  if (fragmentId) {
    timelineFragment = document.querySelector(
      `div[data-fragment-id="${fragmentId}"]`
    );
  } else {
    timelineFragment = document.querySelector(`div[data-fragment-id]`);
  }

  const timelineSection = timelineFragment.closest(
    "section[data-section-index]"
  );

  const timelineContainer = document.querySelector(
    ".js-timeline-scroll-container"
  );

  const previewContainer = document.querySelector(
    ".js-preview-scroll-container"
  );

  const previewFragment = document.querySelector(
    `[data-preview-fragment-id="${fragmentId}"]`
  );
  if (timelineSection && timelineContainer) {
    timelineContainer.scrollTo({
      top: timelineSection.offsetTop - timelineContainer.offsetTop + 10,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  if (previewFragment && previewContainer) {
    previewContainer.scrollTo({
      top: previewFragment.offsetTop - previewContainer.offsetTop - 10,
      behavior: smooth ? "smooth" : "auto",
    });
  }
}

export function scrollToEvent(eventId = null, smooth = true) {
  let timelineEvent;
  if (eventId) {
    timelineEvent = document.querySelector(
      `button[data-user-event-id="${eventId}"]`
    );
  } else {
    timelineEvent = document.querySelector(`button[data-user-event-id]`);
  }

  const timelineSection = timelineEvent.closest("section[data-section-index]");

  const timelineContainer = document.querySelector(
    ".js-timeline-scroll-container"
  );
  if (timelineSection && timelineContainer) {
    timelineContainer.scrollTo({
      top: timelineSection.offsetTop - timelineContainer.offsetTop + 10,
      behavior: smooth ? "smooth" : "auto",
    });
  }
}

export function scrollToTimelineTop(smooth = true) {
  const timelineContainer = document.querySelector(
    ".js-timeline-scroll-container"
  );
  if (timelineContainer) {
    timelineContainer.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "auto",
    });
  }
}

export function scrollToYear(year, smooth = true) {
  const match = document.querySelector(`section[data-season-year='${year}']`);
  if (match) {
    match.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }
}

export function scrollToUndated() {
  const timelineContainer = document.querySelector(
    ".js-timeline-scroll-container"
  );

  const undatedContainer = document.querySelector(
    ".js-undated-fragment-container"
  );

  if (undatedContainer && timelineContainer) {
    timelineContainer.scrollTo({
      top: undatedContainer.offsetTop - timelineContainer.offsetTop - 10,
      behavior: "smooth",
    });
  }
}

// function scrollToFragment(fragmentId) {
//   const match = document.querySelector(
//     `div[data-fragment-id="${fragmentId}"]`
//   );
//   if (match) {
//     match.scrollIntoView({ behavior: "smooth" });
//   }
// }

export function scrollToFirstFragment() {}

export function scrollToFirstEvent() {}
