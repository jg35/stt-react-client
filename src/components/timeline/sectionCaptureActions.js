import React from "react";
import Button from "~/components/button";
import { showCreateFragmentForm, showCreateUserEventForm } from "~/lib/apollo";

export default function SectionCaptureActions({ show, date, index }) {
  return (
    <div className={`flex ${!show ? "opacity-0" : "animate-fade-in"}`}>
      <div
        data-tutorial-callout={index === 0 && [3, 4]}
        data-tutorial-callout-before
      >
        <Button css="mr-3" onClick={() => showCreateUserEventForm({ date })}>
          Add event
        </Button>
      </div>
      <div
        data-tutorial-callout={index === 0 && [7]}
        data-tutorial-callout-before
      >
        <Button
          css="mr-3"
          onClick={() =>
            showCreateFragmentForm({ type: "TEXT", date, dateType: "AUTO" })
          }
        >
          Add memory
        </Button>
      </div>
      <Button
        css="mr-3"
        onClick={() =>
          showCreateFragmentForm({ type: "PHOTO", date, dateType: "AUTO" })
        }
      >
        Add photo
      </Button>
      <Button
        css="mr-3"
        onClick={() =>
          showCreateFragmentForm({ type: "CHAPTER", date, dateType: "AUTO" })
        }
      >
        Add chapter
      </Button>
    </div>
  );

  return null;
}
