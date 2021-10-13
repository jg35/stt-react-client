import { DateTime } from "luxon";
import { getPeriodAge } from "~/lib/timeline";
import { getAgeBetweenDates } from "~/lib/util";

function getDtDecadeFromYear(dt) {
  const yearOffset = parseInt(dt.year.toString().split("").pop());
  return dt.minus({ years: yearOffset }).startOf("year");
}

export function getMonthItems(monthDt, data) {
  let items = [];
  let month = monthDt.startOf("month");
  const dobDt = DateTime.fromISO(data.stt_user_by_pk.dob);
  const nowDt = DateTime.utc();

  for (let i = month.weekday; i > 1; i--) {
    items.push({
      type: "DAY",
      title: "",
      date: null,
      worldEvents: [],
      userEvents: [],
      fragments: [],
    });
  }

  while (month.month === monthDt.month) {
    const monthIso = month.toISODate();
    const BORN_BEFORE_DATE = dobDt.toISODate() <= monthIso;
    const IS_NOT_FUTURE = nowDt.toISODate() >= monthIso;
    if (BORN_BEFORE_DATE && IS_NOT_FUTURE) {
      items.push({
        type: "DAY",
        title: month.day,
        date: monthIso,
        worldEvents: data.stt_worldEvent.filter((ev) => ev.date === monthIso),
        userEvents: data.stt_userEvent.filter((ev) => ev.date === monthIso),
        fragments: data.stt_fragment.filter(
          (ev) =>
            ev.type !== "CHAPTER" && ev.type !== "PHOTO" && ev.date === monthIso
        ),
        // items: [],
      });
    }
    month = month.plus({ days: 1 });
  }
  return items;
}

export function getYearItems(
  yearDt,
  worldEvents,
  userEvents,
  fragments,
  dobDt
) {
  let yr = yearDt.startOf("year");
  const nowDt = DateTime.utc();

  const items = [];
  while (yr.year === yearDt.year) {
    const monthWorldEvents = worldEvents.filter(
      (ev) => DateTime.fromISO(ev.date).month === yr.month
    );
    const monthUserEvents = userEvents.filter(
      (ev) => DateTime.fromISO(ev.date).month === yr.month
    );
    const monthFragments = fragments.filter(
      (ev) =>
        ev.type !== "CHAPTER" &&
        ev.type !== "PHOTO" &&
        DateTime.fromISO(ev.date).month === yr.month
    );
    const yrIso = yr.toISODate();
    const BORN_BEFORE_DATE = dobDt.toISODate().slice(0, 7) <= yrIso.slice(0, 7);
    const IS_NOT_FUTURE = nowDt.toISODate().slice(0, 7) >= yrIso.slice(0, 7);
    if (BORN_BEFORE_DATE && IS_NOT_FUTURE) {
      items.push({
        type: "MONTH",
        title: yr.toFormat("MMMM"),
        date: yrIso,
        ageOnDate: getPeriodAge(dobDt, yr),
        worldEvents: monthWorldEvents,
        userEvents: monthUserEvents,
        fragments: monthFragments,
        items: [],
      });
    }
    yr = yr.plus({ months: 1 });
    yr = yr.startOf("month");
  }
  return items;
}

export function getDecadeItems(decadeDt, data) {
  let yr = decadeDt;
  const nowDt = DateTime.utc();
  const dobDt = DateTime.fromISO(data.stt_user_by_pk.dob);
  const items = [];

  while (yr.year < decadeDt.year + 10) {
    const yearWorldEvents = data.stt_worldEvent.filter(
      (ev) => DateTime.fromISO(ev.date).year === yr.year
    );
    const yearUserEvents = data.stt_userEvent.filter(
      (ev) => DateTime.fromISO(ev.date).year === yr.year
    );
    const yearUserFragments = data.stt_fragment.filter(
      (ev) =>
        ev.type !== "PHOTO" &&
        ev.type !== "CHAPTER" &&
        DateTime.fromISO(ev.date).year === yr.year
    );

    const yrIso = yr.toISODate();
    const BORN_BEFORE_DATE = dobDt.toISODate().slice(0, 4) <= yrIso.slice(0, 4);
    const IS_NOT_FUTURE = nowDt.toISODate().slice(0, 4) >= yrIso.slice(0, 4);

    if (BORN_BEFORE_DATE && IS_NOT_FUTURE) {
      items.push({
        type: "YEAR",
        title: yr.year.toString(),
        date: yrIso,
        ageOnDate: getPeriodAge(dobDt, yr),
        worldEvents: yearWorldEvents,
        fragments: yearUserFragments,
        userEvents: yearUserEvents,
        items: getYearItems(
          yr,
          yearWorldEvents,
          yearUserEvents,
          yearUserFragments,
          dobDt
        ),
      });
    }
    yr = yr.plus({ years: 1 }).startOf("year");
  }
  return items;
}

export const filterFinderData = (data) => {
  const dob = data.stt_user_by_pk.dob;
  const dobDt = DateTime.fromISO(dob);

  //   Decades
  let startDecade = getDtDecadeFromYear(dobDt);

  let endDecade = getDtDecadeFromYear(DateTime.utc());

  let filteredData = {
    title: "Select decade",
    date: null,
    items: [],
    type: "",
    worldEvents: [],
    userEvents: [],
    fragments: [],
  };

  let i = 0;
  while (startDecade.year <= endDecade.year) {
    const nextDecade = startDecade.plus({ years: 10 }).startOf("year");
    filteredData.items.push({
      type: "DECADE",
      title: `${startDecade.year}s`,
      ageOnDate: getAgeBetweenDates(dobDt, startDecade, nextDecade),
      date: startDecade.toISODate(),
      items: getDecadeItems(startDecade, data),
      worldEvents: [],
      userEvents: [],
      fragments: [],
    });
    // For second decade we need to reset the year
    i++;
    startDecade = nextDecade;
  }
  return filteredData;
};

export function getDateFinderFormat(val) {
  if (val.length >= 4 && val.length < 7) {
    return "yyyy";
  } else if (val.length >= 7 && val.length < 10) {
    return `yyyy/MM`;
  } else if (val.length >= 10) {
    return `yyyy/MM/dd`;
  }
}

export function getInputFormat(val) {
  if (val.length === 4) {
    return "yyyy";
  } else if (val.length === 7) {
    return `yyyy/MM`;
  } else if (val.length === 10) {
    return `yyyy/MM/dd`;
  } else {
    return "";
  }
}
