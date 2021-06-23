import React from "react";
import Button from "../button";
import {
  showCreateFragmentForm,
  showCreateUserEventForm,
} from "../../lib/apollo";

export default function SectionCaptureActions({ show, startDate }) {
  if (show) {
    return (
      <div className="flex animate-fade-in">
        <Button
          css="mr-3"
          onClick={() => showCreateFragmentForm("TEXT", startDate)}
        >
          Add memory
        </Button>
        <Button css="mr-3" onClick={() => showCreateUserEventForm(startDate)}>
          Add event
        </Button>
        <Button
          css="mr-3"
          onClick={() => showCreateFragmentForm("PHOTO", startDate)}
        >
          Add photo
        </Button>
        <Button
          css="mr-3"
          onClick={() => showCreateFragmentForm("CHAPTER", startDate)}
        >
          Add chapter
        </Button>
      </div>
    );
  }
  return null;
}
