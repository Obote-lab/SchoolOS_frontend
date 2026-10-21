import api from "./client";

/*  Types                                                              */
export type SchoolType =
    | "primary"
    | "secondary"
    | "mixed"
    | "special_needs"
    | "tvet";

export type SchoolCategory =
    | "public"
    | "private"
    | "mission"
    | "international"
    | "community";

export type BoardingStatus = "day" | "boarding" | "mixed";

export type OnboardingStatus =
    | "pending"
    | "principal_created"
    | "structures_setup"
    | "active"
    | "suspended"
    | "archived";

/** List / search row */
export interface SchoolListItem {
    id: string;
    school_name: string | null;
    school_code: string | null;
    county: string | null;
    school_type: SchoolType;
    school_category: SchoolCategory;
    is_active: boolean;
}

export interface OnboardingChecklist {
    has_principal: boolean;
    has_academic_year: boolean;
    has_classrooms: boolean;
    onboarding_status: string;
}

/** Full detail (retrieve) */
export interface SchoolDetail {
    id: string;
    school_name: string | null;
    school_code: string | null;
    school_type: SchoolType;
    school_category: SchoolCategory;
    county: string | null;
    sub_county: string | null;
    ward: string | null;
    address: string | null;
    gps_coordinates: string | null;
    phone: string | null;
    email: string | null;
    principal: string | null;
    principal_name: string | null;
    deputy_academic: string | null;
    deputy_academic_name: string | null;
    deputy_admin: string | null;
    deputy_admin_name: string | null;
    boarding_status: BoardingStatus;
    capacity: number;
    current_enrollment: number;
    establishment_year: number | null;
    registration_number: string | null;
    nemis_code: string | null;
    tsc_code: string | null;
    knec_center_number: string | null;
    bank_account: Record<string, unknown> | null;
    school_motto: string | null;
    vision: string | null;
    mission: string | null;
    logo: string | null;
    banner: string | null;
    is_active: boolean;
    enrollment_percentage?: number;
    vacancy_count?: number;
    onboarding_status: OnboardingStatus;
    onboarding_progress: number;
    onboarded_by_name: string | null;
    onboarded_date: string | null;
    first_principal_name: string | null;
    trial_start_date: string | null;
    trial_end_date: string | null;
    subscription_tier: string | null;
    is_in_trial: boolean;
    trial_days_remaining: number | null;
    needs_onboarding_attention: boolean;
    onboarding_checklist: OnboardingChecklist | null;
    created_at: string;
    updated_at: string;
}

export const ONBOARDING_STATUS_LABELS: Record<OnboardingStatus, string> = {
    pending: "Pending Setup",
    principal_created: "Principal Created",
    structures_setup: "Structures Setup",
    active: "Active & Operational",
    suspended: "Suspended",
    archived: "Archived",
};

export const BOARDING_LABELS: Record<BoardingStatus, string> = {
    day: "Day School",
    boarding: "Boarding School",
    mixed: "Day & Boarding",
};

export interface PrincipalData {
    first_name: string;
    last_name: string;
    middle_name?: string;
    email?: string;
    phone?: string;
}

export interface SchoolCreatePayload {
    school_name: string;
    school_code?: string;
    school_type: SchoolType;
    school_category: SchoolCategory;
    county: string;
    sub_county?: string;
    ward?: string;
    address?: string;
    phone?: string;
    email?: string;
    boarding_status?: BoardingStatus;
    capacity?: number;
    establishment_year?: number;
    registration_number?: string;
    nemis_code?: string;
    principal_data: PrincipalData;
    auto_setup_structures?: boolean;
}

export interface SchoolUpdatePayload {
    school_name?: string;
    school_type?: SchoolType;
    school_category?: SchoolCategory;
    county?: string;
    sub_county?: string;
    ward?: string;
    address?: string;
    phone?: string;
    email?: string;
    boarding_status?: BoardingStatus;
    capacity?: number;
    is_active?: boolean;
    establishment_year?: number | null;
    school_motto?: string | null;
    vision?: string | null;
    mission?: string | null;
}
export interface SchoolListParams {
    page?: number;
    page_size?: number;
    search?: string;
    county?: string;
    school_type?: SchoolType | "";
    category?: SchoolCategory | "";
}

/** DRF pagination shape */
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

/*  Label maps (for selects & table cells)                             */
export const SCHOOL_TYPE_OPTIONS: { value: SchoolType; label: string }[] = [
    { value: "primary", label: "Primary School" },
    { value: "secondary", label: "Secondary School" },
    { value: "mixed", label: "Mixed (Primary & Secondary)" },
    { value: "special_needs", label: "Special Needs School" },
    { value: "tvet", label: "TVET Institute" },
];

export const SCHOOL_CATEGORY_OPTIONS: {
    value: SchoolCategory;
    label: string;
    }[] = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "mission", label: "Mission" },
    { value: "international", label: "International" },
    { value: "community", label: "Community" },
    ];

export const BOARDING_STATUS_OPTIONS: {
    value: BoardingStatus;
    label: string;
    }[] = [
    { value: "day", label: "Day School" },
    { value: "boarding", label: "Boarding School" },
    { value: "mixed", label: "Day & Boarding" },
    ];

export function schoolTypeLabel(value: string): string {
    return SCHOOL_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function schoolCategoryLabel(value: string): string {
    return SCHOOL_CATEGORY_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

/*  API                                                                */
const BASE = "/api/v1/schools/schools";

export const schoolsAPI = {
    /** Paginated list */
    list: (params?: SchoolListParams) =>
        api.get<PaginatedResponse<SchoolListItem> | SchoolListItem[]>(BASE + "/", {
        params,
        }),

    /** Search action (q, county, school_type, category) */
        search: (params?: SchoolListParams) =>
        api.get<PaginatedResponse<SchoolListItem> | SchoolListItem[]>(
        `${BASE}/search/`,
        {
            params: {
            q: params?.search,
            county: params?.county,
            school_type: params?.school_type || undefined,
            category: params?.category || undefined,
            page: params?.page,
            page_size: params?.page_size,
            },
        },
        ),

    get: (id: string) => api.get<SchoolDetail>(`${BASE}/${id}/`),

    create: (data: SchoolCreatePayload) =>
        api.post<SchoolDetail>(BASE + "/", data),

    update: (id: string, data: SchoolUpdatePayload) =>
    api.patch<SchoolDetail>(`${BASE}/${id}/`, data),
};

export default schoolsAPI;
