    import {
    HomeIcon,
    BuildingLibraryIcon,
    UsersIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface NavItem {
    label: string;
    path: string;
    icon: NavIcon;
    }

export interface NavSection {
    section: string;
    items: NavItem[];
    }

    export const regionalNavigation: NavSection[] = [
    {
        section: "Overview",
        items: [
        { label: "Dashboard", path: "/regional/dashboard", icon: HomeIcon },
        { label: "Analytics", path: "/regional/analytics", icon: ChartBarIcon },
        ],
    },
    {
        section: "Schools",
        items: [
        {
            label: "Schools",
            path: "/regional/schools",
            icon: BuildingLibraryIcon,
        },
        { label: "Principals", path: "/regional/principals", icon: UsersIcon },
        ],
    },
    {
        section: "Account",
        items: [
        { label: "Settings", path: "/regional/settings", icon: Cog6ToothIcon },
        {
            label: "Help",
            path: "/regional/help",
            icon: QuestionMarkCircleIcon,
        },
        ],
    },
];
