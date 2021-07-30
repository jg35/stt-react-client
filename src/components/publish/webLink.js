import { NavLink } from "react-router-dom";

export default function WebLink({ versionId }) {
  return <NavLink to={`/read/${versionId}`}>WEB</NavLink>;
}
