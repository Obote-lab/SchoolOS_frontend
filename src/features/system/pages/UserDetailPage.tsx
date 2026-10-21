// src/features/system/pages/UserDetailPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  LockOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import { Badge, Button, Spinner, useToast } from "../../../components/ui";
import usersAPI, { type User, type UserRole } from "../../../api/users";
import { normalizeError } from "../../../api/client";
import { cn } from "../../../lib/cn";

export default function UserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    async function load() {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
        const { data } = await usersAPI.get(id);
        setUser(data);
        } catch (err) {
        setError(normalizeError(err).message);
        } finally {
        setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleLockToggle() {
        if (!user) return;
        setActionLoading(true);
        try {
        if (user.is_locked) {
            await usersAPI.unlock(user.id);
            success("Account unlocked");
        } else {
            await usersAPI.lock(user.id, { hours: 24 });
            success("Account locked for 24 hours");
        }
        await load();
        } catch (err) {
        toastError(normalizeError(err).message);
        } finally {
        setActionLoading(false);
        }
    }

    if (loading) {
        return (
        <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner size="lg" className="text-blue-600" />
        </div>
        );
    }

    if (error || !user) {
        return (
        <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
            <ExclamationTriangleIcon className="mx-auto h-10 w-10 text-amber-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Couldn’t load user
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
            {error || "User not found."}
            </p>
            <Button variant="outline" onClick={() => navigate("/system/users")}>
            <ArrowLeftIcon className="h-4 w-4" />
            Back to users
            </Button>
        </div>
        );
    }

    const roles = (user.roles ?? []).filter((r) => r.is_active);
    const primaryRole = roles.find((r) => r.is_primary_role) || roles[0] || null;

    return (
        <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm">
            <Link
            to="/system/users"
            className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
            <ArrowLeftIcon className="h-4 w-4" />
            Users
            </Link>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="truncate font-medium text-slate-700 dark:text-slate-200">
            {user.full_name || user.login_id}
            </span>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
            <div className="h-24 bg-linear-to-r from-blue-600 via-sky-500 to-cyan-600 sm:h-28" />
            <div className="relative px-5 pb-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4">
                <div className="-mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg dark:border-slate-800 dark:bg-slate-700 sm:h-24 sm:w-24">
                    {user.profile_picture ? (
                    <img
                        src={user.profile_picture}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                    ) : (
                    <div className="flex h-full w-full items-center justify-center bg-blue-600 text-2xl font-bold text-white">
                        {(user.first_name || user.login_id || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    )}
                </div>
                <div className="pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                        {user.full_name ||
                        `${user.first_name} ${user.last_name}`.trim() ||
                        "Unnamed"}
                    </h1>
                    {user.is_locked ? (
                        <Badge variant="danger" dot>
                        Locked
                        </Badge>
                    ) : user.is_active ? (
                        <Badge variant="success" dot>
                        Active
                        </Badge>
                    ) : (
                        <Badge variant="neutral" dot>
                        Inactive
                        </Badge>
                    )}
                    {primaryRole && (
                        <Badge variant="info">{primaryRole.role_name}</Badge>
                    )}
                    </div>
                    <p className="mt-1 font-mono text-sm text-slate-500 dark:text-slate-400">
                    {user.login_id}
                    </p>
                </div>
                </div>

                <div className="flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/system/users")}
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back
                </Button>
                <Button
                    size="sm"
                    variant={user.is_locked ? "primary" : "outline"}
                    loading={actionLoading}
                    onClick={handleLockToggle}
                >
                    {user.is_locked ? (
                    <>
                        <LockOpenIcon className="h-4 w-4" />
                        Unlock
                    </>
                    ) : (
                    <>
                        <LockClosedIcon className="h-4 w-4" />
                        Lock account
                    </>
                    )}
                </Button>
                </div>
            </div>
            </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
            icon={ShieldCheckIcon}
            label="Primary role"
            value={primaryRole?.role_name || "—"}
            color="blue"
            />
            <StatCard
            icon={CheckCircleIcon}
            label="Verified"
            value={user.is_verified ? "Yes" : "No"}
            color="emerald"
            />
            <StatCard
            icon={ClockIcon}
            label="Last login"
            value={formatDateTime(user.last_login) || "Never"}
            color="violet"
            />
            <StatCard
            icon={UserIcon}
            label="Can login"
            value={user.can_login ? "Yes" : "No"}
            color="amber"
            />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
            <Card title="Contact">
                <div className="space-y-3">
                <InfoRow
                    icon={EnvelopeIcon}
                    label="Email"
                    value={user.email}
                    href={user.email ? `mailto:${user.email}` : undefined}
                />
                <InfoRow
                    icon={PhoneIcon}
                    label="Phone"
                    value={user.phone}
                    href={user.phone ? `tel:${user.phone}` : undefined}
                />
                <InfoRow
                    icon={EnvelopeIcon}
                    label="Recovery email"
                    value={user.recovery_email}
                />
                </div>
            </Card>

            <Card title="Location">
                <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                <p className="text-sm text-slate-800 dark:text-slate-200">
                    {[user.address, user.ward, user.sub_county, user.county]
                    .filter(Boolean)
                    .join(", ") || "No location on file"}
                </p>
                </div>
            </Card>

            <Card title="Roles">
                {roles.length === 0 ? (
                <p className="text-sm text-slate-500">No active roles</p>
                ) : (
                <div className="space-y-3">
                    {roles.map((r) => (
                    <RoleRow key={r.id} role={r} />
                    ))}
                </div>
                )}
            </Card>
            </div>

            <div className="space-y-6">
            <Card title="Account">
                <dl className="space-y-3">
                <Field label="Login ID" value={user.login_id} mono />
                <Field label="Permanent ID" value={user.permanent_id} mono />
                <Field label="Gender" value={user.user_gender} />
                <Field label="Language" value={user.preferred_language} />
                <Field label="Joined" value={formatDate(user.date_joined)} />
                <Field
                    label="Last password change"
                    value={formatDate(user.last_password_change)}
                />
                <Field label="Created" value={formatDateTime(user.created_at)} />
                <Field label="Updated" value={formatDateTime(user.updated_at)} />
                </dl>
            </Card>

            <Card title="Security">
                <ul className="space-y-2 text-sm">
                <SecurityItem
                    ok={user.is_active}
                    label={user.is_active ? "Account active" : "Account inactive"}
                />
                <SecurityItem
                    ok={!user.is_locked}
                    label={user.is_locked ? "Account locked" : "Not locked"}
                />
                <SecurityItem
                    ok={user.is_verified}
                    label={user.is_verified ? "Verified" : "Not verified"}
                />
                <SecurityItem
                    ok={user.can_login}
                    label={user.can_login ? "Login allowed" : "Login blocked"}
                />
                </ul>
            </Card>
            </div>
        </div>
        </div>
    );
    }

function Card({
    title,
    children,
    }: {
    title: string;
    children: React.ReactNode;
    }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 sm:p-6">
        <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">
            {title}
        </h2>
        {children}
        </section>
    );
    }

function StatCard({
    icon: Icon,
    label,
    value,
    color,
    }: {
    icon: typeof UserIcon;
    label: string;
    value: string;
    color: "blue" | "emerald" | "violet" | "amber";
    }) {
    const styles = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        emerald:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
        violet:
        "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
        amber:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    };
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
            <div className={cn("rounded-xl p-2.5", styles[color])}>
            <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {label}
            </p>
            <p className="truncate text-lg font-bold text-slate-900 dark:text-white">
                {value}
            </p>
            </div>
        </div>
        </div>
    );
}

function Field({
    label,
    value,
    mono,
    }: {
    label: string;
    value?: string | null;
    mono?: boolean;
    }) {
    return (
        <div>
        <dt className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {label}
        </dt>
        <dd
            className={cn(
            "mt-0.5 text-sm text-slate-800 dark:text-slate-200",
            mono && "font-mono text-xs",
            !value && "text-slate-400",
            )}
        >
            {value || "—"}
        </dd>
        </div>
    );
    }

function InfoRow({
    icon: Icon,
    label,
    value,
    href,
    }: {
    icon: typeof EnvelopeIcon;
    label: string;
    value?: string | null;
    href?: string;
    }) {
    const content = (
        <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
        <div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-sm text-slate-800 dark:text-slate-200">
            {value || "—"}
            </p>
        </div>
        </div>
    );
    if (href && value) {
        return (
        <a
            href={href}
            className="block rounded-lg transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
            {content}
        </a>
        );
    }
    return content;
}

function RoleRow({ role }: { role: UserRole }) {
    return (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
        <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
            {role.role_name}
            {role.is_primary_role && (
                <span className="ml-2 text-xs font-normal text-blue-600 dark:text-blue-400">
                Primary
                </span>
            )}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {[role.role_category, role.school_name].filter(Boolean).join(" · ") ||
                "Platform scope"}
            </p>
        </div>
        <Badge variant={role.is_active ? "success" : "neutral"}>
            {role.is_active ? "Active" : "Inactive"}
        </Badge>
        </div>
    );
}

function SecurityItem({ ok, label }: { ok: boolean; label: string }) {
    return (
        <li className="flex items-center gap-2">
        {ok ? (
            <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
        ) : (
            <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
        )}
        <span className="text-slate-700 dark:text-slate-300">{label}</span>
        </li>
    );
}

function formatDate(value?: string | null) {
    if (!value) return undefined;
    try {
        return new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        });
    } catch {
        return value;
    }
}

function formatDateTime(value?: string | null) {
    if (!value) return undefined;
    try {
        return new Date(value).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        });
    } catch {
        return value;
    }
}
