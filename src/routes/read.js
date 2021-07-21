import axios from "axios";
import { useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import { FETCH_VERSION } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import { NavLink, useParams } from "react-router-dom";
import Page from "~/components/page";

function getBookHtml(version) {
  // TODO - remove s3 bucket (poggle/) from stored publishedPath
  const objectPath = `${version.publishedPath.replace("poggl/", "")}.html`;
  return axios
    .get(
      `${process.env.REACT_APP_NETLIFY_FUNCTIONS_URL}/actions/s3/signGetObject?objectPath=${objectPath}`
    )
    .then(({ data }) => {
      console.log(data.signedRequest);
    })
    .catch((err) => console.log(err));
}

export default function ReaderView() {
  const params = useParams();
  const { user } = useContext(AuthContext);
  const { data } = useQuery(FETCH_VERSION, {
    variables: {
      versionId: params.versionId,
    },
  });

  useEffect(() => {
    if (data && data.stt_version_by_pk) {
      const version = data.stt_version_by_pk;
      getBookHtml(version);
    }
  }, [data]);
  return (
    <Page>
      <div className="flex">
        <NavLink to="/">Return to app</NavLink>
      </div>
    </Page>
  );
}
