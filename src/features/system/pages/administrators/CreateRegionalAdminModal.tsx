// src/features/system/pages/administrators/CreateRegionalAdminModal.tsx
import { useState } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

import { Modal, Button, Input } from "../../../../components/ui";
import systemAPI from "../../../../api/system";
import { normalizeError } from "../../../../api/client";
import { KENYA_COUNTIES } from "./counties";
import { cn } from "../../../../lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  onError: (msg: string) => void;
};

export default function CreateRegionalAdminModal({
  open,
  onClose,
  onCreated,
  onError,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [counties, setCounties] = useState<string[]>([]);
  const [countyQuery, setCountyQuery] = useState("");

  // Success state
  const [createdLoginId, setCreatedLoginId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function reset() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCounties([]);
    setCountyQuery("");
    setFormError(null);
    setCreatedLoginId(null);
    setCopied(false);
  }

  function handleClose() {
    if (submitting) return;
    const hadSuccess = !!createdLoginId;
    reset();
    onClose();
    if (hadSuccess) onCreated();
  }

  function toggleCounty(name: string) {
    setCounties((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  }

  const filteredCounties = KENYA_COUNTIES.filter((c) =>
    c.toLowerCase().includes(countyQuery.trim().toLowerCase()),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (counties.length === 0) {
      setFormError("Select at least one managed county.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await systemAPI.createRegionalAdmin({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        managed_counties: counties,
      });
      setCreatedLoginId(data.login_id);
    } catch (err) {
      const msg = normalizeError(err).message;
      setFormError(msg);
      onError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function copyLoginId() {
    if (!createdLoginId) return;
    try {
      await navigator.clipboard.writeText(createdLoginId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  // Success screen
  if (createdLoginId) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        title="Regional admin created"
        description="Share the login ID with the new administrator."
        size="md"
        footer={
          <Button onClick={handleClose} fullWidth>
            Done
          </Button>
        }
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <CheckIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Account created for{" "}
            <span className="font-medium text-slate-900 dark:text-white">
              {firstName} {lastName}
            </span>
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-900/50">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Login ID
            </p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <code className="text-lg font-semibold tracking-wide text-slate-900 dark:text-white">
                {createdLoginId}
              </code>
              <button
                type="button"
                onClick={copyLoginId}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-white"
                title="Copy"
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ClipboardDocumentIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            They should sign in with this ID and the temporary password sent by
            email (if configured).
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Regional Admin"
      description="Create a platform administrator for one or more counties."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-regional-admin-form"
            loading={submitting}
            disabled={
              !firstName.trim() ||
              !lastName.trim() ||
              !email.trim() ||
              !phone.trim() ||
              counties.length === 0
            }
          >
            Create admin
          </Button>
        </>
      }
    >
      <form
        id="create-regional-admin-form"
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
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            placeholder="admin@example.com"
          />
          <Input
            label="Phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={submitting}
            placeholder="07XX XXX XXX"
          />
        </div>

        {/* Counties multi-select */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Managed counties
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <span className="text-xs text-slate-400">
              {counties.length} selected
            </span>
          </div>

          {/* Selected chips */}
          {counties.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {counties.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCounty(c)}
                  disabled={submitting}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
                >
                  {c}
                  <span className="text-blue-400">×</span>
                </button>
              ))}
            </div>
          )}

          <Input
            placeholder="Search counties…"
            value={countyQuery}
            onChange={(e) => setCountyQuery(e.target.value)}
            disabled={submitting}
          />

          <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-600">
            {filteredCounties.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-slate-400">
                No counties match
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredCounties.map((c) => {
                  const selected = counties.includes(c);
                  return (
                    <li key={c}>
                      <button
                        type="button"
                        onClick={() => toggleCounty(c)}
                        disabled={submitting}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition",
                          selected
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded border text-[10px]",
                            selected
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-slate-300 dark:border-slate-500",
                          )}
                        >
                          {selected ? "✓" : ""}
                        </span>
                        {c}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
