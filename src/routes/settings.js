import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import { Card, TabLink, Grid } from "~/components/_styled";

import ManageUser from "~/components/settings/manageUser";
import ManageAccount from "~/components/settings/manageAccount";
import ManagePrivacy from "~/components/settings/managePrivacy";
import usePageTitle from "~/hooks/usePageTitle";

export default function Settings() {
  usePageTitle("Settings");
  const TABS = ["SETTINGS", "BILLING", "ACCOUNT", "PRIVACY"];
  const history = useHistory();
  const urlTab =
    history.location.hash &&
    history.location.hash.replace("#", "").toUpperCase();

  if (urlTab && !TABS.includes(urlTab)) {
    window.location.hash = "";
    urlTab = null;
  }
  const [activeTab, setActiveTab] = useState(urlTab || "SETTINGS");
  const {
    authState: { dbUser },
  } = useContext(AuthContext);

  function renderActiveTab() {
    switch (activeTab) {
      case "SETTINGS":
        return <ManageUser dbUser={dbUser} />;
      case "ACCOUNT":
        return <ManageAccount dbUser={dbUser} />;
      case "PRIVACY":
        if (dbUser.versions.length === 1) {
          window.location.hash = "";
          return <ManageUser dbUser={dbUser} />;
        }
        return <ManagePrivacy dbUser={dbUser} />;
    }
  }

  return (
    dbUser && (
      <Page scrollable>
        <Grid
          height="h-full"
          gap="gap-y-2 lg:gap-4"
          autoRows="auto-rows-min"
          colSpan={["col-span-12 lg:col-span-3", "col-span-12 lg:col-span-9"]}
        >
          <Card css="p-2">
            <Grid
              gap="gap-x-2"
              colSpan={[
                `${
                  dbUser && dbUser.versions.length > 1
                    ? "col-span-4"
                    : "col-span-6"
                } lg:col-span-12`,
              ]}
            >
              <TabLink
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tab="SETTINGS"
                title="Settings"
                description="Manage the way things work and feel"
              />
              {dbUser.versions.length > 1 && (
                <TabLink
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  tab="PRIVACY"
                  title="Privacy"
                  description="Manage access to your book"
                />
              )}
              <TabLink
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tab="ACCOUNT"
                title="Account"
                description="Manage your account"
              />
            </Grid>
          </Card>
          <Card css="min-h-full p-0 pt-8 px-4 pb-4 max-w-2xl mx-auto lg:mx-0">
            {renderActiveTab()}
          </Card>
        </Grid>
      </Page>
    )
  );
  return null;
}
