import LoadingSpinner from "~/components/loadingSpinner";

export default function SaveStatus({ saving }) {
  return (
    <div className="h-6 font-medium">
      {saving && (
        <div className="flex items-center">
          {" "}
          <LoadingSpinner loading={saving} css="h-4 w-4" />
          <span className="ml-2">Saving...</span>
        </div>
      )}
    </div>
  );
}
