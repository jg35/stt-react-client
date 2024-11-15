import { NavLink, useParams } from "react-router-dom";
import Page from "~/components/page";
import usePageTitle from "~/hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Nothing found");
  return (
    <Page>
      <div className="flex flex-col items-center justify-center items-center h-full">
        <NavLink className="font-medium text-2xl" to="/">
          404 not found. Head back home
        </NavLink>
      </div>
    </Page>
  );
}
