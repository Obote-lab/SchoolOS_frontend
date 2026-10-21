import { Link } from "react-router-dom";
import type { User } from "../../../../api/users";
import { ChartCard } from "./ChartCard";

export function RecentActivityFeed({ users }: { users: User[] }) {
  return (
    <ChartCard title="Recent users" subtitle="Latest accounts on the platform">
      {users.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          No recent users
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-700">
          {users.slice(0, 8).map((u) => (
            <li key={u.id} className="flex items-center gap-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                {(u.first_name || u.login_id || "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {u.full_name || `${u.first_name} ${u.last_name}`.trim()}
                </p>
                <p className="truncate text-xs text-slate-500">{u.login_id}</p>
              </div>
              <Link
                to={`/system/users/${u.id}`}
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}
