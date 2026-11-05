import { useState } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Button, Input, useToast } from "../../../../../components/ui";
import { SettingsSection } from "../SettingsSection";
import { useBrandingOptional } from "../../../../../context/BrandingContext";
import { cn } from "../../../../../lib/cn";

    export function SecurityPolicySection() {
    const primary = useBrandingOptional()?.primary ?? "#0B5FFF";
    const { success } = useToast();
    const [minPassword, setMinPassword] = useState(8);
    const [sessionHours, setSessionHours] = useState(12);
    const [maxAttempts, setMaxAttempts] = useState(5);
    const [requireMixed, setRequireMixed] = useState(true);
    const [forceResetDays, setForceResetDays] = useState(90);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    async function save() {
        setSaving(true);
        try {
        await new Promise((r) => setTimeout(r, 400));
        success("Security policy saved (local preview)");
        setDirty(false);
        } finally {
        setSaving(false);
        }
    }

    return (
        <SettingsSection
        icon={ShieldCheckIcon}
        title="Security policy"
        description="Baseline rules for every account on the platform."
        >
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
            <Input
                label="Min password length"
                type="number"
                value={String(minPassword)}
                onChange={(e) => {
                setMinPassword(Number(e.target.value) || 0);
                setDirty(true);
                }}
            />
            <Input
                label="Max login attempts"
                type="number"
                value={String(maxAttempts)}
                onChange={(e) => {
                setMaxAttempts(Number(e.target.value) || 0);
                setDirty(true);
                }}
            />
            <Input
                label="Session length (hours)"
                type="number"
                value={String(sessionHours)}
                onChange={(e) => {
                setSessionHours(Number(e.target.value) || 0);
                setDirty(true);
                }}
            />
            <Input
                label="Force password reset (days)"
                type="number"
                value={String(forceResetDays)}
                onChange={(e) => {
                setForceResetDays(Number(e.target.value) || 0);
                setDirty(true);
                }}
            />
            </div>

            <button
            type="button"
            onClick={() => {
                setRequireMixed((v) => !v);
                setDirty(true);
            }}
            className={cn(
                "flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition",
                requireMixed
                ? "border-emerald-300 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/30"
                : "border-slate-200 dark:border-slate-700",
            )}
            >
            <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                Require mixed characters
                </p>
                <p className="text-xs text-slate-500">
                Letters, numbers, and a symbol
                </p>
            </div>
            <span
                className={cn(
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition",
                requireMixed
                    ? "bg-emerald-600"
                    : "bg-slate-300 dark:bg-slate-600",
                )}
            >
                <span
                className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white shadow transition",
                    requireMixed ? "translate-x-6" : "translate-x-1",
                )}
                />
            </span>
            </button>

            <div className="flex justify-end pt-1">
            <Button
                size="sm"
                loading={saving}
                disabled={!dirty}
                onClick={save}
                style={dirty ? { backgroundColor: primary } : undefined}
            >
                Save policy
            </Button>
            </div>
        </div>
        </SettingsSection>
    );
}
