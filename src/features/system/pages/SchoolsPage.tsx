// src/features/system/pages/SchoolsPage.tsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { BuildingLibraryIcon, PlusIcon } from "@heroicons/react/24/outline";

import {
  PageHeader,
  Button,
  Input,
  Select,
  Badge,
  DataTable,
  Modal,
  useToast,
  type Column,
} from "../../../components/ui";
import schoolsAPI, {
  SCHOOL_TYPE_OPTIONS,
  SCHOOL_CATEGORY_OPTIONS,
  BOARDING_STATUS_OPTIONS,
  schoolTypeLabel,
  schoolCategoryLabel,
  type SchoolListItem,
  type SchoolCreatePayload,
  type SchoolType,
  type SchoolCategory,
  type BoardingStatus,
} from "../../../api/schools";
import { normalizeError } from "../../../api/client";

export default function SchoolsPage() {
  const { success, error: toastError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [schools, setSchools] = useState<SchoolListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [county, setCounty] = useState(() => searchParams.get("county") || "");
  const [schoolType, setSchoolType] = useState<SchoolType | "">("");
  const [category, setCategory] = useState<SchoolCategory | "">("");

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const hasFilters = Boolean(
        search.trim() || schoolType || category || county.trim(),
      );
      const { data } = hasFilters
        ? await schoolsAPI.search({
            search: search.trim() || undefined,
            school_type: schoolType || undefined,
            category: category || undefined,
            county: county.trim() || undefined,
          })
        : await schoolsAPI.list();

      const rows = Array.isArray(data) ? data : (data.results ?? []);
      setSchools(rows);
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  }, [search, schoolType, category, county]);

  // Keep local county in sync if URL changes (e.g. from Regions)
  useEffect(() => {
    const fromUrl = searchParams.get("county") || "";
    setCounty(fromUrl);
  }, [searchParams]);

  // Debounced fetch when filters change
  useEffect(() => {
    const t = setTimeout(() => {
      fetchSchools();
    }, 350);
    return () => clearTimeout(t);
  }, [search, schoolType, category, county, fetchSchools]);

  function clearFilters() {
    setSearch("");
    setCounty("");
    setSchoolType("");
    setCategory("");
    setSearchParams({});
  }

  const columns: Column<SchoolListItem>[] = [
    {
      key: "name",
      header: "School",
      cell: (s) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            {s.school_name || "—"}
          </p>
          {s.school_code && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {s.school_code}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "county",
      header: "County",
      cell: (s) => s.county || "—",
      hideOnMobile: true,
    },
    {
      key: "type",
      header: "Type",
      cell: (s) => schoolTypeLabel(s.school_type),
      hideOnMobile: true,
    },
    {
      key: "category",
      header: "Category",
      cell: (s) => schoolCategoryLabel(s.school_category),
      hideOnMobile: true,
    },
    {
      key: "status",
      header: "Status",
      cell: (s) => (
        <Badge variant={s.is_active ? "success" : "neutral"} dot>
          {s.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const hasFilters = Boolean(search || county || schoolType || category);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schools"
        description="Manage schools registered on SchoolOS."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Add School
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search by name, code, or county…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            options={[
              { value: "", label: "All types" },
              ...SCHOOL_TYPE_OPTIONS,
            ]}
            value={schoolType}
            onChange={(e) => setSchoolType(e.target.value as SchoolType | "")}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            options={[
              { value: "", label: "All categories" },
              ...SCHOOL_CATEGORY_OPTIONS,
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value as SchoolCategory | "")}
          />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="md" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      {county && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            County filter:
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {county}
            <button
              type="button"
              className="text-blue-400 hover:text-blue-700 dark:hover:text-blue-200"
              onClick={() => {
                setCounty("");
                setSearchParams({});
              }}
              aria-label="Clear county filter"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={schools}
        rowKey={(s) => s.id}
        loading={loading}
        error={error}
        onRowClick={(s) => navigate(`/system/schools/${s.id}`)}
        emptyTitle="No schools yet"
        emptyDescription="Register your first school to get started."
        emptyIcon={<BuildingLibraryIcon className="h-6 w-6" />}
        emptyAction={
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Add School
          </Button>
        }
      />

      <CreateSchoolModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          fetchSchools();
          success("School created successfully");
        }}
        onError={(msg) => toastError(msg)}
      />
    </div>
  );
}

/* ================================================================== */
/*  Create School Modal                                                */
/* ================================================================== */

function CreateSchoolModal({
  open,
  onClose,
  onCreated,
  onError,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  onError: (msg: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolType, setSchoolType] = useState<SchoolType>("secondary");
  const [schoolCategory, setSchoolCategory] =
    useState<SchoolCategory>("public");
  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [boardingStatus, setBoardingStatus] = useState<BoardingStatus>("day");
  const [capacity, setCapacity] = useState("");
  const [autoSetup, setAutoSetup] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [principalEmail, setPrincipalEmail] = useState("");
  const [principalPhone, setPrincipalPhone] = useState("");

  function reset() {
    setSchoolName("");
    setSchoolCode("");
    setSchoolType("secondary");
    setSchoolCategory("public");
    setCounty("");
    setSubCounty("");
    setPhone("");
    setEmail("");
    setBoardingStatus("day");
    setCapacity("");
    setAutoSetup(true);
    setFirstName("");
    setLastName("");
    setPrincipalEmail("");
    setPrincipalPhone("");
    setFormError(null);
  }

  function handleClose() {
    if (submitting) return;
    reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!principalEmail.trim() && !principalPhone.trim()) {
      setFormError("Principal needs either an email or a phone number.");
      return;
    }

    const payload: SchoolCreatePayload = {
      school_name: schoolName.trim(),
      school_code: schoolCode.trim() || undefined,
      school_type: schoolType,
      school_category: schoolCategory,
      county: county.trim(),
      sub_county: subCounty.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      boarding_status: boardingStatus,
      capacity: capacity ? Number(capacity) : undefined,
      auto_setup_structures: autoSetup,
      principal_data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: principalEmail.trim() || undefined,
        phone: principalPhone.trim() || undefined,
      },
    };

    setSubmitting(true);
    try {
      await schoolsAPI.create(payload);
      reset();
      onCreated();
    } catch (err) {
      const apiErr = normalizeError(err);
      setFormError(apiErr.message);
      onError(apiErr.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Register School"
      description="Create a school and its first principal in one step."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-school-form"
            loading={submitting}
            disabled={
              !schoolName.trim() ||
              !county.trim() ||
              !firstName.trim() ||
              !lastName.trim()
            }
          >
            Create School
          </Button>
        </>
      }
    >
      <form
        id="create-school-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {formError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
          >
            {formError}
          </div>
        )}

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-slate-900 dark:text-white">
            School details
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="School name"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              disabled={submitting}
              placeholder="e.g. Nairobi Academy"
            />
            <Input
              label="School code"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              disabled={submitting}
              placeholder="Ministry code (optional)"
              hint="Leave blank to auto-generate later"
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
              label="County"
              required
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              disabled={submitting}
              placeholder="e.g. Nairobi"
            />
            <Input
              label="Sub-county"
              value={subCounty}
              onChange={(e) => setSubCounty(e.target.value)}
              disabled={submitting}
            />
          </div>

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
              placeholder="Max students"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="School phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting}
              placeholder="07XX XXX XXX"
            />
            <Input
              label="School email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-slate-200 pt-5 dark:border-slate-700">
          <legend className="text-sm font-semibold text-slate-900 dark:text-white">
            First principal
          </legend>
          <p className="-mt-2 text-xs text-slate-500 dark:text-slate-400">
            A login will be created for this person. Provide email or phone (or
            both).
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={submitting}
            />
            <Input
              label="Last name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              value={principalEmail}
              onChange={(e) => setPrincipalEmail(e.target.value)}
              disabled={submitting}
            />
            <Input
              label="Phone"
              value={principalPhone}
              onChange={(e) => setPrincipalPhone(e.target.value)}
              disabled={submitting}
              placeholder="07XX XXX XXX"
            />
          </div>
        </fieldset>

        <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <input
            type="checkbox"
            checked={autoSetup}
            onChange={(e) => setAutoSetup(e.target.checked)}
            disabled={submitting}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>
            <span className="block text-sm font-medium text-slate-900 dark:text-white">
              Auto-setup basic structures
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              Creates academic year, terms, and sample classrooms automatically.
            </span>
          </span>
        </label>
      </form>
    </Modal>
  );
}
