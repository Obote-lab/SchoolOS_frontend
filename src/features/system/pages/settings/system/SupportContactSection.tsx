import { useState } from "react";
import { LifebuoyIcon } from "@heroicons/react/24/outline";
import {
    Button,
    Input,
    Textarea,
    useToast,
} from "../../../../../components/ui";
import { SettingsSection } from "../SettingsSection";
import { useBrandingOptional } from "../../../../../context/BrandingContext";

export function SupportContactSection() {
    const primary = useBrandingOptional()?.primary ?? "#0B5FFF";
    const { success } = useToast();
    const [supportEmail, setSupportEmail] = useState("support@schoolos.ke");
    const [supportPhone, setSupportPhone] = useState("+254 798 618 570");
    const [helpUrl, setHelpUrl] = useState("https://docs.schoolos.ke");
    const [footerNote, setFooterNote] = useState(
        "SchoolOS — built for Kenyan schools.",
    );
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    async function save() {
        setSaving(true);
        try {
        await new Promise((r) => setTimeout(r, 400));
        success("Support contacts saved (local preview)");
        setDirty(false);
        } finally {
        setSaving(false);
        }
    }

    return (
        <SettingsSection
        icon={LifebuoyIcon}
        title="Support & contacts"
        description="Shown to schools in help surfaces and system emails."
        >
        <div className="space-y-3">
            <Input
            label="Support email"
            value={supportEmail}
            onChange={(e) => {
                setSupportEmail(e.target.value);
                setDirty(true);
            }}
            />
            <Input
            label="Support phone"
            value={supportPhone}
            onChange={(e) => {
                setSupportPhone(e.target.value);
                setDirty(true);
            }}
            />
            <Input
            label="Help centre URL"
            value={helpUrl}
            onChange={(e) => {
                setHelpUrl(e.target.value);
                setDirty(true);
            }}
            />
            <Textarea
            label="Footer note"
            value={footerNote}
            onChange={(e) => {
                setFooterNote(e.target.value);
                setDirty(true);
            }}
            rows={2}
            />
            <div className="flex justify-end pt-1">
            <Button
                size="sm"
                loading={saving}
                disabled={!dirty}
                onClick={save}
                style={dirty ? { backgroundColor: primary } : undefined}
            >
                Save contacts
            </Button>
            </div>
        </div>
        </SettingsSection>
    );
}
