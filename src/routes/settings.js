import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import { Card, TabLink, Grid } from "~/components/_styled";

import ManageUser from "~/components/settings/manageUser";
import ManageBilling from "~/components/settings/manageBilling";
import ManageAccount from "~/components/settings/manageAccount";
import ManagePrivacy from "~/components/settings/managePrivacy";

export default function Settings() {
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
      case "BILLING":
        return <ManageBilling dbUser={dbUser} />;
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
      <Page minimal scrollable>
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
                    ? "col-span-3"
                    : "col-span-4"
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
                tab="BILLING"
                title="Billing"
                description="Manage your subscription"
              />
              <TabLink
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tab="ACCOUNT"
                title="Account"
                description="Manage your account"
              />
            </Grid>
          </Card>

          <Card>{renderActiveTab()}</Card>
        </Grid>
      </Page>
    )
  );
  return null;
}
