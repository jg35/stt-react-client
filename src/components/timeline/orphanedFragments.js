import React from "react";

import FragmentList from "@src/components/timeline/fragmentList";
import InfoMessage from "@src/components/infoMessage";

export default function OrphanedFragments({ fragments }) {
  const numWords = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
  ];
  return (
    <section className="py-8 pr-6 js-undated-fragment-container">
      <header className="flex justify-between h-10 pl-2">
        <div className=" items-center">
          <h1 className="text-lg font-medium">Outside timeline</h1>
        </div>
      </header>

      <InfoMessage name="ORPHANED_FRAGMENTS" />

      {fragments.length > 0 && (
        <div className="flex flex-wrap mt-4">
          <FragmentList fragments={fragments} />
        </div>
      )}
    </section>
  );
}
