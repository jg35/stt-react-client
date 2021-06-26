import React from "react";
import Button from "../button";
import { showCreateFragmentForm, showCreateUserEventForm } from "~/lib/apollo";

export default function SectionCaptureActions({ show, date }) {
  if (show) {
    return (
      <div className="flex animate-fade-in">
        <Button css="mr-3" onClick={() => showCreateUserEventForm({ date })}>
          Add memorable event
        </Button>
        <Button
          css="mr-3"
          onClick={() => showCreateFragmentForm({ type: "TEXT", date })}
        >
          Add memory
        </Button>
        <Button
          css="mr-3"
          onClick={() => showCreateFragmentForm({ type: "PHOTO", date })}
        >
          Add photo
        </Button>
        <Button
          css="mr-3"
          onClick={() => showCreateFragmentForm({ type: "CHAPTER", date })}
        >
          Add chapter
        </Button>
      </div>
    );
  }
  return null;
}
