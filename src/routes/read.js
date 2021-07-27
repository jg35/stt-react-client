import { useEffect, useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { FETCH_VERSION, S3_GET_SIGNED_URL } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import { NavLink, useParams } from "react-router-dom";
import Page from "~/components/page";

function getBookHtml(version, getSignedUrls) {
  // TODO - remove s3 bucket (poggle/) from stored publishedPath
  const objectPath = `${version.publishedPath.replace("poggl/", "")}.html`;
  return getSignedUrls({ variables: { paths: objectPath } })
    .then(({ data }) => {
      console.log(data.s3_signed_get_url[0]);
    })
    .catch((err) => console.log(err));
}

export default function ReaderView() {
  const [getSignedUrls] = useMutation(S3_GET_SIGNED_URL);
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
      getBookHtml(version, getSignedUrls);
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
