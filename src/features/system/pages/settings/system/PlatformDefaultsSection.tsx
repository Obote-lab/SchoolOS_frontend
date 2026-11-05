import { useState } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Button, Input, Select, useToast } from "../../../../../components/ui";
import { SettingsSection } from "../SettingsSection";
import { useBrandingOptional } from "../../../../../context/BrandingContext";

const TIMEZONES = [
    { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT)" },
    { value: "UTC", label: "UTC" },
    ];

const DATE_FORMATS = [
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
    ];

const LANGUAGES = [
    { value: "en", label: "English" },
    { value: "sw", label: "Kiswahili" },
];

export function PlatformDefaultsSection() {
    const primary = useBrandingOptional()?.primary ?? "#0B5FFF";
    const { success } = useToast();
    const [timezone, setTimezone] = useState("Africa/Nairobi");
    const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
    const [language, setLanguage] = useState("en");
    const [academicYearLabel, setAcademicYearLabel] = useState("2026");
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    async function save() {
        setSaving(true);
        try {
        await new Promise((r) => setTimeout(r, 400));
        success("Platform defaults saved (local preview)");
        setDirty(false);
        } finally {
        setSaving(false);
        }
    }

    return (
        <SettingsSection
        icon={GlobeAltIcon}
        title="Platform defaults"
        description="Kenya-first defaults applied when a school has not overridden them."
        >
        <div className="space-y-3">
            <Select
            label="Timezone"
            options={TIMEZONES}
            value={timezone}
            onChange={(e) => {
                setTimezone(e.target.value);
                setDirty(true);
            }}
            />
            <Select
            label="Date format"
            options={DATE_FORMATS}
            value={dateFormat}
            onChange={(e) => {
                setDateFormat(e.target.value);
                setDirty(true);
            }}
            />
            <Select
            label="Default language"
            options={LANGUAGES}
            value={language}
            onChange={(e) => {
                setLanguage(e.target.value);
                setDirty(true);
            }}
            />
            <Input
            label="Current academic year label"
            value={academicYearLabel}
            onChange={(e) => {
                setAcademicYearLabel(e.target.value);
                setDirty(true);
            }}
            hint="Shown on reports and dashboards when schools use platform default"
            />
            <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-400">
                Wire to platform settings API when ready
            </p>
            <Button
                size="sm"
                loading={saving}
                disabled={!dirty}
                onClick={save}
                style={dirty ? { backgroundColor: primary } : undefined}
            >
                Save defaults
            </Button>
            </div>
        </div>
        </SettingsSection>
    );
}
