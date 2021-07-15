import LoadingSpinner from "~/components/loadingSpinner";

export default function SaveStatus({ saving }) {
  return (
    <div className="h-12 font-medium absolute top-4 left-4">
      {saving && (
        <div className="flex">
          {" "}
          <LoadingSpinner loading={saving} css="h-4 w-4 mr-2" /> Saving...
        </div>
      )}
    </div>
  );
}
