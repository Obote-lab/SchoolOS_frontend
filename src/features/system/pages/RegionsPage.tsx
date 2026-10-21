// src/features/system/pages/RegionsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapIcon,
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import {
  PageHeader,
  Input,
  Badge,
  DataTable,
  type Column,
} from "../../../components/ui";
import schoolsAPI, { type SchoolListItem } from "../../../api/schools";
import { normalizeError } from "../../../api/client";

interface CountyRow {
  county: string;
  total: number;
  active: number;
  inactive: number;
}

export default function RegionsPage() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<SchoolListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await schoolsAPI.list({ page_size: 500 });
        const rows = Array.isArray(data) ? data : (data.results ?? []);
        setSchools(rows);
      } catch (err) {
        setError(normalizeError(err).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counties = useMemo(() => {
    const map = new Map<string, CountyRow>();
    for (const s of schools) {
      const key = (s.county || "Unknown").trim() || "Unknown";
      const row = map.get(key) || {
        county: key,
        total: 0,
        active: 0,
        inactive: 0,
      };
      row.total += 1;
      if (s.is_active) row.active += 1;
      else row.inactive += 1;
      map.set(key, row);
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [schools]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return counties;
    return counties.filter((c) => c.county.toLowerCase().includes(q));
  }, [counties, search]);

  const columns: Column<CountyRow>[] = [
    {
      key: "county",
      header: "County",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <MapIcon className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-900 dark:text-white">
            {r.county}
          </span>
        </div>
      ),
    },
    {
      key: "total",
      header: "Schools",
      cell: (r) => (
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {r.total}
        </span>
      ),
    },
    {
      key: "active",
      header: "Active",
      cell: (r) => (
        <Badge variant="success" dot>
          {r.active}
        </Badge>
      ),
    },
    {
      key: "inactive",
      header: "Inactive",
      hideOnMobile: true,
      cell: (r) => (
        <Badge variant="neutral" dot>
          {r.inactive}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regions"
        description="School distribution by county across Kenya."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-xs font-medium text-slate-500">Counties covered</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {counties.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-xs font-medium text-slate-500">Total schools</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {schools.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-xs font-medium text-slate-500">Active schools</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {schools.filter((s) => s.is_active).length}
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="pl-9"
          placeholder="Filter by county…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(r) => r.county}
        loading={loading}
        error={error}
        onRowClick={(r) =>
          navigate(`/system/schools?county=${encodeURIComponent(r.county)}`)
        }
        emptyTitle="No regional data"
        emptyDescription="Register schools to see county distribution."
        emptyIcon={<BuildingLibraryIcon className="h-6 w-6" />}
      />
    </div>
  );
}
