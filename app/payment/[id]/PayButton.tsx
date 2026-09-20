// components/PayButton.tsx
"use client";

import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import packagePayment from "@/backend/actions/package/packagePayment.action";

export default function PayButton({ packageId }: { packageId: string }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const handlePayment = () => {
        startTransition(async () => {
            const { ok, message } = await packagePayment({ packageId });

            if (!ok) {
                toast.error(message);
                return;
            }

            toast.success(message || "پرداخت با موفقیت انجام شد");
            router.push("/dashboard");
            router.refresh();
        });
    };

    return (
        <Button onClick={handlePayment} loading={pending} fullWidth>
            پرداخت
        </Button>
    );
}
