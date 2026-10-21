// src/features/system/pages/settings/NotificationSection.tsx
import { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../../context/AuthContext";
import { SettingsSection } from "./SettingsSection";
import { cn } from "../../../../lib/cn";

type PrefKey = "email" | "sms" | "in_app";

const PREFS: { key: PrefKey; label: string; hint: string }[] = [
  {
    key: "email",
    label: "Email alerts",
    hint: "Security and system notices",
  },
  {
    key: "sms",
    label: "SMS alerts",
    hint: "Critical account events",
  },
  {
    key: "in_app",
    label: "In-app notifications",
    hint: "Dashboard and activity feed",
  },
];

function readPref(
  prefs: Record<string, unknown> | null | undefined,
  key: PrefKey,
): boolean {
  if (!prefs) return key !== "sms";
  const v = prefs[key];
  if (typeof v === "boolean") return v;
  return key !== "sms";
}

export function NotificationSection() {
  const { currentUser } = useAuth();
  const [local, setLocal] = useState<Record<PrefKey, boolean>>(() => ({
    email: readPref(currentUser?.notification_prefs, "email"),
    sms: readPref(currentUser?.notification_prefs, "sms"),
    in_app: readPref(currentUser?.notification_prefs, "in_app"),
  }));

  function toggle(key: PrefKey) {
    setLocal((prev) => ({ ...prev, [key]: !prev[key] }));
    // Persistence via usersAPI.updateMe can be wired when product wants it.
  }

  return (
    <SettingsSection
      icon={BellIcon}
      title="Notifications"
      description="How you want to be reached. Saved on this device for now."
    >
      <ul className="space-y-3">
        {PREFS.map((p) => (
          <li
            key={p.key}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-3 dark:border-slate-700"
          >
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {p.label}
              </p>
              <p className="text-xs text-slate-500">{p.hint}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={local[p.key]}
              onClick={() => toggle(p.key)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition",
                local[p.key] ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-600",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                  local[p.key] && "translate-x-5",
                )}
              />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-400">
        Backend sync for notification preferences can be enabled next.
      </p>
    </SettingsSection>
  );
}
