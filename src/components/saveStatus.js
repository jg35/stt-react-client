import LoadingSpinner from "~/components/loadingSpinner";

export default function SaveStatus({ saving }) {
  return (
    <div className="h-6 font-medium">
      {saving && (
        <div className="flex">
          {" "}
          <LoadingSpinner loading={saving} css="h-4 w-4 mr-2" /> Saving...
        </div>
      )}
    </div>
  );
}
