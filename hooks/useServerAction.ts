"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

interface UseServerActionResult<T> {
    data: T | null;
    status: Status;
    error: string | null;
    refetch: () => void;
}

export function useServerAction<T>(
    action: () => Promise<T>
): UseServerActionResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setStatus("loading");
            setError(null);
            try {
                const result = await action();
                if (!cancelled) {
                    setData(result);
                    setStatus("success");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "خطای ناشناخته");
                    setStatus("error");
                }
            }
        }

        run();
        return () => { cancelled = true; };
    }, [trigger]);

    return {
        data,
        status,
        error,
        refetch: () => setTrigger(t => t + 1),
    };
}
