import {
    HomeIcon,
    BuildingLibraryIcon,
    UsersIcon,
    UserGroupIcon,
    MapIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    BellAlertIcon,
    SwatchIcon,
    ServerStackIcon,
    DocumentTextIcon,
    KeyIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface NavItem {
    label: string;
    path: string;
    icon: NavIcon;
    accent?: "default" | "warning" | "success" | "danger";
    badge?: string | number;
    }

    export interface NavSection {
    section: string;
    items: NavItem[];
    }

    export const navigation: NavSection[] = [
        {
        section: "Overview",
        items: [
        { label: "Dashboard", path: "/system/dashboard", icon: HomeIcon },
        { label: "Analytics", path: "/system/analytics", icon: ChartBarIcon },
        ],
    },
        {
        section: "Management",
            items: [
            { label: "Schools",path: "/system/schools",icon: BuildingLibraryIcon,},
            { label: "Users", path: "/system/users", icon: UsersIcon },
            { label: "Administrators",path: "/system/administrators",icon: UserGroupIcon,},
            { label: "Regions", path: "/system/regions", icon: MapIcon },
            ],
            },
        {
            section: "Compliance",
            items: [
            { label: "Audit Logs",path: "/system/audit-logs",icon: ClipboardDocumentListIcon,},
            { label: "Roles & access",path: "/system/roles",icon: ShieldCheckIcon,},
            { label: "Notifications",path: "/system/notifications",icon: BellAlertIcon,},
            ],
        },
        {
        section: "Platform",
        items: [
            { label: "System health",path: "/system/health",icon: ServerStackIcon,},
            { label: "API & keys", path: "/system/api-keys", icon: KeyIcon },
            { label: "Documentation",path: "/system/docs",icon: DocumentTextIcon,},
            { label: "Help center", path: "/system/help",icon: QuestionMarkCircleIcon,},
            { label: "Branding", path: "/system/branding", icon: SwatchIcon },
            { label: "Settings", path: "/system/settings", icon: Cog6ToothIcon },
            ],
        },
    ];
