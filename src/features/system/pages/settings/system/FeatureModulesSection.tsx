import { useState } from "react";
import {
    Squares2X2Icon,
    AcademicCapIcon,
    BanknotesIcon,
    ClipboardDocumentCheckIcon,
    HomeModernIcon,
    MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { Button, useToast } from "../../../../../components/ui";
import { SettingsSection } from "../SettingsSection";
import { useBrandingOptional } from "../../../../../context/BrandingContext";
import { cn } from "../../../../../lib/cn";

const MODULES = [
    {
        key: "academics",
        label: "Academics",
        hint: "Classes, subjects, CBC structure",
        icon: AcademicCapIcon,
    },
    {
        key: "finance",
        label: "Finance",
        hint: "Fees, receipts, expenses",
        icon: BanknotesIcon,
    },
    {
        key: "attendance",
        label: "Attendance",
        hint: "Daily and period tracking",
        icon: ClipboardDocumentCheckIcon,
    },
    {
        key: "dormitory",
        label: "Dormitory",
        hint: "Boarding houses and beds",
        icon: HomeModernIcon,
    },
    {
        key: "comms",
        label: "Communications",
        hint: "Notices and SMS / WhatsApp",
        icon: MegaphoneIcon,
    },
    ] as const;

    type ModKey = (typeof MODULES)[number]["key"];

    export function FeatureModulesSection() {
    const primary = useBrandingOptional()?.primary ?? "#0B5FFF";
    const { success } = useToast();
    const [enabled, setEnabled] = useState<Record<ModKey, boolean>>({
        academics: true,
        finance: true,
        attendance: true,
        dormitory: false,
        comms: true,
    });
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    function toggle(key: ModKey) {
        setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
        setDirty(true);
    }

    async function save() {
        setSaving(true);
        try {
        await new Promise((r) => setTimeout(r, 400));
        success("Module switches saved (local preview)");
        setDirty(false);
        } finally {
        setSaving(false);
        }
    }

    return (
        <SettingsSection
        icon={Squares2X2Icon}
        title="Feature modules"
        description="Turn platform capabilities on or off for new schools by default."
        >
        <ul className="space-y-2">
            {MODULES.map((m) => {
            const Icon = m.icon;
            const on = enabled[m.key];
            return (
                <li key={m.key}>
                <button
                    type="button"
                    onClick={() => toggle(m.key)}
                    className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                    on
                        ? "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900/40"
                        : "border-dashed border-slate-200 bg-slate-50/80 opacity-80 dark:border-slate-700 dark:bg-slate-900/20",
                    )}
                >
                    <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                        backgroundColor: on ? `${primary}18` : undefined,
                        color: on ? primary : undefined,
                    }}
                    >
                    <Icon className={cn("h-5 w-5", !on && "text-slate-400")} />
                    </span>
                    <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-slate-900 dark:text-white">
                        {m.label}
                    </span>
                    <span className="block text-xs text-slate-500">{m.hint}</span>
                    </span>
                    <span
                    className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        on
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                    )}
                    >
                    {on ? "On" : "Off"}
                    </span>
                </button>
                </li>
            );
            })}
        </ul>
        <div className="mt-3 flex justify-end">
            <Button
            size="sm"
            loading={saving}
            disabled={!dirty}
            onClick={save}
            style={dirty ? { backgroundColor: primary } : undefined}
            >
            Save modules
            </Button>
        </div>
        </SettingsSection>
    );
}
