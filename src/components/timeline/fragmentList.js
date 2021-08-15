import React from "react";
import Fragment from "~/components/timeline/fragment";
import { Grid } from "~/components/_styled";

export default function FragmentList({ fragments, editView = false }) {
  return (
    <div className="pt-4">
      <Grid
        colSpan={["col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3"]}
        gap="gap-x-3 gap-y-4"
      >
        {fragments.map((fragment) => (
          <div className="p-0.5" style={{ height: "250px" }} key={fragment.id}>
            <Fragment fragment={fragment} editView={editView} />
          </div>
        ))}
      </Grid>
    </div>
  );
  // return (
  //   <div
  //     className="pl-1 -mx-2 overflow-x-scroll whitespace-nowrap w-auto flex lg:flex-wrap"
  //     ref={container}
  //   >
  //     {fragments.map((fragment) => (
  //       <div
  //         className="py-2 px-2 w-full md:w-1/2 lg:w-1/3"
  //         style={{ height: "250px" }}
  //         key={fragment.id}
  //       >
  //         <Fragment fragment={fragment} editView={editView} />
  //       </div>
  //     ))}
  //   </div>
  // );
}
