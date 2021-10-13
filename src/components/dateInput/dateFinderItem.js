import Svg from "~/components/svg";
import DateFinderEvent from "~/components/dateInput/dateFinderEvent";
import DateFinderFragment from "~/components/dateInput/dateFinderFragment";

export default function DateFinderItem({ item, selectItem }) {
  return (
    <div
      className="rounded-md shadow-md flex w-full mb-2 overflow-hidden cursor-pointer bg-lightBlack hover:bg-black duration-200 transition ease-in"
      style={{ minHeight: "100px" }}
      onClick={() => selectItem(item)}
    >
      <div className="p-2 w-11/12 bg-white">
        {item.type === "DECADE" ? (
          <div className="flex flex-col items-center justify-center h-full w-full ml-3">
            <p className="font-bold text-2xl text-lightBlack">{item.title}</p>
            <p className="text-gray">
              {item.ageOnDate === "0-0" ? "Newborn" : `${item.ageOnDate} years`}
            </p>
          </div>
        ) : (
          <>
            <p className="font-medium">
              {item.title}
              <span className="text-gray"> &middot; {item.ageOnDate}</span>
            </p>
            <div className="flex whitespace-nowrap overflow-x-scroll">
              {item.userEvents.map((e, i) => (
                <DateFinderEvent key={i} event={e} isUserEvent />
              ))}
            </div>
            <div className="flex whitespace-nowrap overflow-x-scroll">
              {item.worldEvents.map((e, i) => (
                <DateFinderEvent key={i} event={e} isUserEvent={false} />
              ))}
            </div>
            <div className="flex whitespace-nowrap overflow-x-scroll">
              {item.fragments.map((e, i) => (
                <DateFinderFragment key={i} fragment={e} isUserEvent={false} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="w-1/12 flex justify-center">
        <Svg name="chevronRight" color="white" size={16} />
      </div>
    </div>
  );
}
