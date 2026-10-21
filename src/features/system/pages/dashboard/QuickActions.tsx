import { Link } from "react-router-dom";
import {
  PlusIcon,
  UserPlusIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { ChartCard } from "./ChartCard";

const ACTIONS = [
  {
    to: "/system/schools",
    label: "Add school",
    hint: "Register a new institution",
    icon: BuildingLibraryIcon,
  },
  {
    to: "/system/administrators",
    label: "Add regional admin",
    hint: "Expand county coverage",
    icon: UserPlusIcon,
  },
  {
    to: "/system/users",
    label: "Browse users",
    hint: "Accounts & access",
    icon: PlusIcon,
  },
  {
    to: "/system/audit-logs",
    label: "Audit logs",
    hint: "Review recent actions",
    icon: ClipboardDocumentListIcon,
  },
];

export function QuickActions() {
  return (
    <ChartCard title="Quick actions" subtitle="Jump into common system tasks">
      <div className="grid gap-2 sm:grid-cols-2">
        {ACTIONS.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
          >
            <a.icon className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>
              <span className="block text-sm font-medium text-slate-900 dark:text-white">
                {a.label}
              </span>
              <span className="block text-xs text-slate-500">{a.hint}</span>
            </span>
          </Link>
        ))}
      </div>
    </ChartCard>
  );
}
