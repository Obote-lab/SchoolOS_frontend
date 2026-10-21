import api from "./client";

export interface AuditLog {
    id: string;
    user: string | null;
    user_name: string | null;
    user_role: string;
    user_ip: string | null;
    user_device: string;
    action_type: string;
    model_name: string;
    field_changed: string;
    old_value: string;
    new_value: string;
    reason: string;
    record_id: string;
    school: string | null;
    school_name: string | null;
    approved_by_name: string | null;
    timestamp: string;
    location: string;
    session_id: string;
}

export interface AuditListParams {
    page?: number;
    page_size?: number;
    search?: string;
    action_type?: string;
    model_name?: string;
    ordering?: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface AuditSummary {
    total_actions: number;
    today_actions: number;
    by_action_type: Record<string, number>;
    by_user: Record<string, number>;
    by_model: Record<string, number>;
}

const BASE = "/api/v1/compliance/audit_logs";

export const complianceAPI = {
    listAuditLogs: (params?: AuditListParams) =>
        api.get<PaginatedResponse<AuditLog> | AuditLog[]>(`${BASE}/`, { params }),

    getAuditSummary: () => api.get<AuditSummary>(`${BASE}/summary/`),
};

export default complianceAPI;
