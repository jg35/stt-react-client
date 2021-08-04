import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import Card from "~/components/card";

import ManageUser from "~/components/settings/manageUser";
import ManageBilling from "~/components/settings/manageBilling";
import ManageAccount from "~/components/settings/manageAccount";
import ManagePrivacy from "~/components/settings/managePrivacy";
import TabLink from "~/components/settings/tabLink";

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
  const { dbUser } = useContext(AuthContext);

  function renderActiveTab() {
    switch (activeTab) {
      case "SETTINGS":
        return <ManageUser dbUser={dbUser} />;
      case "BILLING":
        return <ManageBilling dbUser={dbUser} />;
      case "ACCOUNT":
        return <ManageAccount dbUser={dbUser} />;
      case "PRIVACY":
        return <ManagePrivacy dbUser={dbUser} />;
    }
  }
  return (
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

            <TabLink
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tab="PRIVACY"
              title="Privacy"
              description="Manage access to your book"
            />

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
          {dbUser && <Card>{renderActiveTab()}</Card>}
        </div>
      </div>
    </Page>
  );
}
