import { Link } from "react-router-dom";
import {
    BuildingLibraryIcon,
    MapPinIcon,
    UserGroupIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";
import { useBrandingOptional } from "../../../context/BrandingContext";
import { getManagedCounties } from "../lib/getManagedCounties";
import { PageHeader } from "../../../components/ui";

export default function RegionalDashboard() {
    const { currentUser } = useAuth();
    const primary = useBrandingOptional()?.primary ?? "#0B5FFF";
    const counties = getManagedCounties(currentUser);

    return (
        <div className="space-y-6">
        <PageHeader
            title="Regional dashboard"
            description={
            currentUser?.first_name
                ? `Welcome back, ${currentUser.first_name}. County-scoped overview for your assignment.`
                : "County-scoped overview for your assignment."
            }
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
                <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${primary}18`, color: primary }}
                >
                <MapPinIcon className="h-5 w-5" />
                </span>
                <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Managed counties
                </p>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                    {counties.length
                    ? counties.join(" · ")
                    : "No counties assigned yet. Ask System Root to set managed_counties on your role."}
                </p>
                </div>
            </div>
            <Link
                to="/regional/schools"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:opacity-80"
                style={{ color: primary }}
            >
                View schools
                <ArrowRightIcon className="h-4 w-4" />
            </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Kpi
            icon={BuildingLibraryIcon}
            label="Schools in scope"
            value="—"
            hint="Connects when schools API is filtered"
            primary={primary}
            />
            <Kpi
            icon={UserGroupIcon}
            label="Principals"
            value="—"
            hint="School admins in your counties"
            primary={primary}
            />
            <Kpi
            icon={MapPinIcon}
            label="Counties"
            value={String(counties.length || "—")}
            hint="From your role metadata"
            primary={primary}
            />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
            <Link
            to="/regional/schools"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
            >
            <BuildingLibraryIcon className="h-6 w-6" style={{ color: primary }} />
            <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                Schools
            </p>
            <p className="mt-1 text-sm text-slate-500">
                Browse and manage schools in your counties.
            </p>
            </Link>
            <Link
            to="/regional/settings"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
            >
            <UserGroupIcon className="h-6 w-6" style={{ color: primary }} />
            <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                Account settings
            </p>
            <p className="mt-1 text-sm text-slate-500">
                Theme, security, and profile for this device.
            </p>
            </Link>
        </div>

        <p className="text-center text-xs text-slate-400">
            Regional portal R0 shell — live school metrics land in R1.
        </p>
        </div>
    );
    }

    function Kpi({
    icon: Icon,
    label,
    value,
    hint,
    primary,
    }: {
    icon: typeof BuildingLibraryIcon;
    label: string;
    value: string;
    hint: string;
    primary: string;
    }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
            <span
            className="rounded-xl p-2.5"
            style={{ backgroundColor: `${primary}18`, color: primary }}
            >
            <Icon className="h-5 w-5" />
            </span>
            <div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
                {value}
            </p>
            <p className="text-[11px] text-slate-400">{hint}</p>
            </div>
        </div>
        </div>
    );
}
