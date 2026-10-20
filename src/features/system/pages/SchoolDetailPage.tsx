import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeftIcon,
    BuildingLibraryIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    UserIcon,
    AcademicCapIcon,
    UsersIcon,
    // CalendarDaysIcon,
    ShieldCheckIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import {
    Badge,
    Button,
    Spinner,
    Modal,
    Input,
    Select,
    useToast,
} from "../../../components/ui";
import schoolsAPI, {
    schoolTypeLabel,
    schoolCategoryLabel,
    ONBOARDING_STATUS_LABELS,
    BOARDING_LABELS,
    SCHOOL_TYPE_OPTIONS,
    SCHOOL_CATEGORY_OPTIONS,
    BOARDING_STATUS_OPTIONS,
    type SchoolDetail,
    type OnboardingStatus,
    type SchoolUpdatePayload,
    type SchoolType,
    type SchoolCategory,
    type BoardingStatus,
} from "../../../api/schools";
import { normalizeError } from "../../../api/client";
import { cn } from "../../../lib/cn";

export default function SchoolDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [school, setSchool] = useState<SchoolDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const { success, error: toastError } = useToast();
    const [editOpen, setEditOpen] = useState(false);

    const reload = async () => {
        if (!id) return;
        try {
            const { data } = await schoolsAPI.get(id);
            setSchool(data);
        } catch (err) {
            toastError(normalizeError(err).message);
        }
        };

    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        (async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await schoolsAPI.get(id);
            if (!cancelled) setSchool(data);
        } catch (err) {
            if (!cancelled) setError(normalizeError(err).message);
        } finally {
            if (!cancelled) setLoading(false);
        }
        })();

        return () => {
        cancelled = true;
        };
    }, [id]);

    if (loading) {
        return (
        <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner size="lg" className="text-blue-600" />
        </div>
        );
    }

    if (error || !school) {
        return (
        <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
            <ExclamationTriangleIcon className="mx-auto h-10 w-10 text-amber-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Couldn’t load school
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
            {error || "School not found."}
            </p>
            <Button variant="outline" onClick={() => navigate("/system/schools")}>
            <ArrowLeftIcon className="h-4 w-4" />
            Back to schools
            </Button>
        </div>
        );
    }

    const progress = school.onboarding_progress ?? 0;
    const enrollmentPct =
        school.enrollment_percentage ??
        (school.capacity > 0
        ? Math.round((school.current_enrollment / school.capacity) * 100)
        : 0);
    const vacancy =
        school.vacancy_count ??
        Math.max(0, (school.capacity || 0) - (school.current_enrollment || 0));

    const checklist = school.onboarding_checklist;

    return (
      <div className="space-y-6">
        {/* Breadcrumb + back */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            to="/system/schools"
            className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Schools
          </Link>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="truncate font-medium text-slate-700 dark:text-slate-200">
            {school.school_name}
          </span>
        </div>

        {/* Hero */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          {/* Banner strip */}
          <div className="relative h-28 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 sm:h-36">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoNDB2MUgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==')] opacity-80" />
            {school.banner && (
              <img
                src={school.banner}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
            )}
          </div>

          <div className="relative px-5 pb-5 sm:px-6">
            {/* Logo + title row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="-mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg dark:border-slate-800 dark:bg-slate-700 sm:h-24 sm:w-24">
                  {school.logo ? (
                    <img
                      src={school.logo}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BuildingLibraryIcon className="h-10 w-10 text-blue-500" />
                  )}
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                      {school.school_name || "Unnamed school"}
                    </h1>
                    <Badge
                      variant={school.is_active ? "success" : "neutral"}
                      dot
                    >
                      {school.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <OnboardingBadge status={school.onboarding_status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {[
                      school.school_code,
                      schoolTypeLabel(school.school_type),
                      schoolCategoryLabel(school.school_category),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/system/schools")}
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back
                </Button>
                <Button size="sm" onClick={() => setEditOpen(true)}>
                  Edit school
                </Button>
              </div>
            </div>

            {school.school_motto && (
              <p className="mt-4 border-l-2 border-blue-500 pl-3 text-sm italic text-slate-600 dark:text-slate-300">
                “{school.school_motto}”
              </p>
            )}
          </div>
        </section>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={UsersIcon}
            label="Enrollment"
            value={`${school.current_enrollment ?? 0}`}
            hint={`${enrollmentPct}% of capacity`}
            color="blue"
          />
          <StatCard
            icon={AcademicCapIcon}
            label="Capacity"
            value={`${school.capacity ?? 0}`}
            hint={`${vacancy} vacancies`}
            color="violet"
          />
          <StatCard
            icon={ShieldCheckIcon}
            label="Onboarding"
            value={`${progress}%`}
            hint={
              ONBOARDING_STATUS_LABELS[school.onboarding_status] ??
              school.onboarding_status
            }
            color="emerald"
          />
          <StatCard
            icon={ClockIcon}
            label="Subscription"
            value={school.subscription_tier?.replace(/_/g, " ") || "—"}
            hint={
              school.is_in_trial
                ? `Trial · ${school.trial_days_remaining ?? 0} days left`
                : "Live plan"
            }
            color="amber"
          />
        </div>

        {/* Onboarding progress */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Onboarding progress
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Track how ready this school is to operate fully
              </p>
            </div>
            {school.needs_onboarding_attention && (
              <Badge variant="warning" dot>
                Needs attention
              </Badge>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Progress
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {progress}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  progress >= 100
                    ? "bg-emerald-500"
                    : progress >= 50
                      ? "bg-blue-500"
                      : "bg-amber-500",
                )}
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ChecklistItem
              done={!!checklist?.has_principal}
              label="Principal assigned"
              detail={
                school.principal_name ||
                school.first_principal_name ||
                undefined
              }
            />
            <ChecklistItem
              done={!!checklist?.has_academic_year}
              label="Academic year"
              detail="Year structure configured"
            />
            <ChecklistItem
              done={!!checklist?.has_classrooms}
              label="Classrooms"
              detail="Basic classes created"
            />
          </div>
        </section>

        {/* Main grid */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Left column — 2/3 */}
          <div className="space-y-6 xl:col-span-2">
            {/* About */}
            <Card title="About">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Type"
                  value={schoolTypeLabel(school.school_type)}
                />
                <Field
                  label="Category"
                  value={schoolCategoryLabel(school.school_category)}
                />
                <Field
                  label="Boarding"
                  value={
                    BOARDING_LABELS[school.boarding_status] ??
                    school.boarding_status
                  }
                />
                <Field
                  label="Established"
                  value={school.establishment_year?.toString()}
                />
              </dl>
              {(school.vision || school.mission) && (
                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-700">
                  {school.vision && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Vision
                      </p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                        {school.vision}
                      </p>
                    </div>
                  )}
                  {school.mission && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Mission
                      </p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                        {school.mission}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Location & contact */}
            <Card title="Location & contact">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-800 dark:text-slate-200">
                      {[
                        school.address,
                        school.ward,
                        school.sub_county,
                        school.county,
                      ]
                        .filter(Boolean)
                        .join(", ") || "No address on file"}
                    </p>
                    {school.gps_coordinates && (
                      <p className="mt-0.5 font-mono text-xs text-slate-400">
                        {school.gps_coordinates}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {school.phone && (
                    <a
                      href={`tel:${school.phone}`}
                      className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                    >
                      <PhoneIcon className="h-4 w-4 text-slate-400" />
                      {school.phone}
                    </a>
                  )}
                  {school.email && (
                    <a
                      href={`mailto:${school.email}`}
                      className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                    >
                      <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                      {school.email}
                    </a>
                  )}
                </div>
              </div>
            </Card>

            {/* Government codes */}
            <Card title="Registration & codes">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Registration number"
                  value={school.registration_number}
                />
                <Field label="NEMIS code" value={school.nemis_code} />
                <Field label="TSC code" value={school.tsc_code} />
                <Field label="KNEC centre" value={school.knec_center_number} />
                <Field label="System code" value={school.school_code} mono />
              </dl>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Leadership */}
            <Card title="Leadership">
              <div className="space-y-3">
                <PersonRow
                  role="Principal"
                  name={school.principal_name || school.first_principal_name}
                />
                <PersonRow
                  role="Deputy (Academic)"
                  name={school.deputy_academic_name}
                />
                <PersonRow
                  role="Deputy (Admin)"
                  name={school.deputy_admin_name}
                />
              </div>
            </Card>

            {/* Trial / meta */}
            <Card title="Account">
              <dl className="space-y-3">
                <Field
                  label="Subscription"
                  value={school.subscription_tier?.replace(/_/g, " ")}
                />
                {school.is_in_trial && (
                  <>
                    <Field
                      label="Trial starts"
                      value={formatDate(school.trial_start_date)}
                    />
                    <Field
                      label="Trial ends"
                      value={formatDate(school.trial_end_date)}
                    />
                    <Field
                      label="Days remaining"
                      value={
                        school.trial_days_remaining != null
                          ? String(school.trial_days_remaining)
                          : undefined
                      }
                    />
                  </>
                )}
                <Field label="Onboarded by" value={school.onboarded_by_name} />
                <Field
                  label="Onboarded"
                  value={formatDate(school.onboarded_date)}
                />
                <Field label="Created" value={formatDate(school.created_at)} />
                <Field label="Updated" value={formatDate(school.updated_at)} />
              </dl>
            </Card>
          </div>
        </div>

        <EditSchoolModal
          open={editOpen}
          school={school}
          onClose={() => setEditOpen(false)}
          onSaved={async () => {
            setEditOpen(false);
            await reload();
            success("School updated successfully");
          }}
          onError={(msg) => toastError(msg)}
        />
      </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function OnboardingBadge({ status }: { status: OnboardingStatus }) {
    const variant =
        status === "active"
        ? "success"
        : status === "suspended" || status === "archived"
            ? "danger"
            : status === "pending"
            ? "warning"
            : "info";

    return (
        <Badge variant={variant}>
        {ONBOARDING_STATUS_LABELS[status] ?? status}
        </Badge>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    hint,
    color,
}: {
    icon: typeof UsersIcon;
    label: string;
    value: string;
    hint: string;
    color: "blue" | "violet" | "emerald" | "amber";
}) {
    const styles = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        violet:
        "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
        emerald:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
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
            <p className="truncate text-xl font-bold text-slate-900 dark:text-white">
                {value}
            </p>
            <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                {hint}
            </p>
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
            !value && "text-slate-400 dark:text-slate-500",
            )}
        >
            {value || "—"}
        </dd>
        </div>
    );
}

function ChecklistItem({
    done,
    label,
    detail,
    }: {
    done: boolean;
    label: string;
    detail?: string;
    }) {
    return (
        <div
        className={cn(
            "flex items-start gap-3 rounded-xl border p-3",
            done
            ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/40 dark:bg-emerald-900/10"
            : "border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/30",
        )}
        >
        {done ? (
            <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-500" />
        ) : (
            <XCircleIcon className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
        )}
        <div>
            <p
            className={cn(
                "text-sm font-medium",
                done
                ? "text-emerald-800 dark:text-emerald-300"
                : "text-slate-600 dark:text-slate-300",
            )}
            >
            {label}
            </p>
            {detail && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {detail}
            </p>
            )}
        </div>
        </div>
    );
    }

    function PersonRow({ role, name }: { role: string; name?: string | null }) {
    return (
        <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
            <UserIcon className="h-4 w-4 text-slate-400" />
        </div>
        <div className="min-w-0">
            <p className="text-xs text-slate-400">{role}</p>
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
            {name || "Not assigned"}
            </p>
        </div>
        </div>
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



/*  Edit School Modal                                                   */
function EditSchoolModal({
    open,
    school,
    onClose,
    onSaved,
    onError,
    }: {
    open: boolean;
    school: SchoolDetail;
    onClose: () => void;
    onSaved: () => void;
    onError: (msg: string) => void;
    }) {
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [schoolName, setSchoolName] = useState("");
    const [schoolType, setSchoolType] = useState<SchoolType>("secondary");
    const [schoolCategory, setSchoolCategory] =
        useState<SchoolCategory>("public");
    const [county, setCounty] = useState("");
    const [subCounty, setSubCounty] = useState("");
    const [ward, setWard] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [boardingStatus, setBoardingStatus] =
        useState<BoardingStatus>("day");
    const [capacity, setCapacity] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Prefill when opened / school changes
    useEffect(() => {
        if (!open) return;
        setSchoolName(school.school_name || "");
        setSchoolType(school.school_type);
        setSchoolCategory(school.school_category);
        setCounty(school.county || "");
        setSubCounty(school.sub_county || "");
        setWard(school.ward || "");
        setAddress(school.address || "");
        setPhone(school.phone || "");
        setEmail(school.email || "");
        setBoardingStatus(school.boarding_status || "day");
        setCapacity(
        school.capacity != null ? String(school.capacity) : "",
        );
        setIsActive(school.is_active);
        setFormError(null);
    }, [open, school]);

    function handleClose() {
        if (submitting) return;
        onClose();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);

        if (!schoolName.trim() || !county.trim()) {
        setFormError("School name and county are required.");
        return;
        }

        const payload: SchoolUpdatePayload = {
        school_name: schoolName.trim(),
        school_type: schoolType,
        school_category: schoolCategory,
        county: county.trim(),
        sub_county: subCounty.trim() || undefined,
        ward: ward.trim() || undefined,
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        boarding_status: boardingStatus,
        capacity: capacity ? Number(capacity) : undefined,
        is_active: isActive,
        };

        setSubmitting(true);
        try {
        await schoolsAPI.update(school.id, payload);
        onSaved();
        } catch (err) {
        const msg = normalizeError(err).message;
        setFormError(msg);
        onError(msg);
        } finally {
        setSubmitting(false);
        }
    }

    return (
        <Modal
        open={open}
        onClose={handleClose}
        title="Edit school"
        description="Update school profile and status."
        size="lg"
        footer={
            <>
            <Button variant="outline" onClick={handleClose} disabled={submitting}>
                Cancel
            </Button>
            <Button
                type="submit"
                form="edit-school-form"
                loading={submitting}
                disabled={!schoolName.trim() || !county.trim()}
            >
                Save changes
            </Button>
            </>
        }
        >
        <form
            id="edit-school-form"
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            {formError && (
            <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
            >
                {formError}
            </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
            <Input
                label="School name"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                disabled={submitting}
            />
            <Input
                label="County"
                required
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                disabled={submitting}
            />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
            <Select
                label="Type"
                required
                options={SCHOOL_TYPE_OPTIONS}
                value={schoolType}
                onChange={(e) => setSchoolType(e.target.value as SchoolType)}
                disabled={submitting}
            />
            <Select
                label="Category"
                required
                options={SCHOOL_CATEGORY_OPTIONS}
                value={schoolCategory}
                onChange={(e) =>
                setSchoolCategory(e.target.value as SchoolCategory)
                }
                disabled={submitting}
            />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
            <Input
                label="Sub-county"
                value={subCounty}
                onChange={(e) => setSubCounty(e.target.value)}
                disabled={submitting}
            />
            <Input
                label="Ward"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                disabled={submitting}
            />
            </div>

            <Input
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={submitting}
            />

            <div className="grid gap-4 sm:grid-cols-2">
            <Select
                label="Boarding status"
                options={BOARDING_STATUS_OPTIONS}
                value={boardingStatus}
                onChange={(e) =>
                setBoardingStatus(e.target.value as BoardingStatus)
                }
                disabled={submitting}
            />
            <Input
                label="Capacity"
                type="number"
                min={0}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                disabled={submitting}
            />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
            <Input
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={submitting}
            />
            <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
            />
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={submitting}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>
                <span className="block text-sm font-medium text-slate-900 dark:text-white">
                Active
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                Inactive schools are hidden from normal operations.
                </span>
            </span>
            </label>
        </form>
        </Modal>
    );
    }
