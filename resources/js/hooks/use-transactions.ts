import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function useTransactions() {
    const [isProcessing, setIsProcessing] = useState(false);

    const confirmManualPayment = (transactionId: string, referenceNumber?: string, notes?: string) => {
        setIsProcessing(true);
        router.post(
            `/transactions/${transactionId}/manual-confirm`,
            {
                reference_number: referenceNumber,
                notes: notes,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Payment receipt confirmed and transaction marked complete.');
                },
                onError: () => {
                    toast.error('Failed to confirm manual payment.');
                },
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    return {
        isProcessing,
        confirmManualPayment,
    };
}
