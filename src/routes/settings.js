import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import { Card, TabLink } from "~/components/_styled";

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
      <Page minimal>
        <div className="flex h-full" style={{ maxWidth: "1024px" }}>
          <div
            className="w-3/12 pr-2"
            style={{ height: "fit-content", maxWidth: "275px" }}
          >
            <Card css="p-2">
              <TabLink
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tab="SETTINGS"
                title="General"
                description="The way things work and feel"
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
            </Card>
          </div>
          <div className="pl-2 w-9/12">
            <Card>{renderActiveTab()}</Card>
          </div>
        </div>
      </Page>
    )
  );
  return null;
}
