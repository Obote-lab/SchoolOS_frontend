import { PageHeader } from "../../../components/ui";
import { AccountSection } from "../../system/pages/settings/AccountSection";
import { AppearanceSection } from "../../system/pages/settings/AppearanceSection";
import { SecuritySection } from "../../system/pages/settings/SecuritySection";
import { NotificationSection } from "../../system/pages/settings/NotificationSection";

export default function RegionalSettingsPage() {
    return (
        <div className="space-y-6">
        <PageHeader
            title="Settings"
            description="Personal preferences for your Regional Admin account."
        />
        <div className="grid gap-5 xl:grid-cols-2">
            <AccountSection />
            <AppearanceSection />
            <SecuritySection />
            <NotificationSection />
        </div>
        </div>
    );
}
