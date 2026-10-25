// src/features/system/pages/settings/platform/useSystemBranding.ts
import { useCallback, useEffect, useState } from "react";
import brandingAPI, {
  type SystemBranding,
  type SystemBrandingUpdate,
} from "../../../../../api/branding";
import { normalizeError } from "../../../../../api/client";

export function useSystemBranding(enabled: boolean) {
  const [branding, setBranding] = useState<SystemBranding | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await brandingAPI.getSystem();
      setBranding(data);
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(
    async (patch: SystemBrandingUpdate) => {
      if (!branding) throw new Error("Branding not loaded");
      setSaving(true);
      setError(null);
      try {
        const { data } = await brandingAPI.updateSystem(branding.id, patch);
        setBranding(data);
        return data;
      } catch (err) {
        const msg = normalizeError(err).message;
        setError(msg);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [branding],
  );

  const upload = useCallback(
    async (files: Record<string, File>) => {
      if (!branding) throw new Error("Branding not loaded");
      setSaving(true);
      setError(null);
      try {
        const { data } = await brandingAPI.uploadSystemAssets(
          branding.id,
          files,
        );
        setBranding(data);
        return data;
      } catch (err) {
        const msg = normalizeError(err).message;
        setError(msg);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [branding],
  );

  return { branding, loading, saving, error, reload, save, upload };
}
