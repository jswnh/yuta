import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function useAgreements() {
    const [processingAction, setProcessingAction] = useState<string | null>(null);

    const acceptAgreement = (agreementId: string) => {
        setProcessingAction(`accept_${agreementId}`);
        router.post(
            `/agreements/${agreementId}/accept`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Agreement accepted! The deal is now active.');
                },
                onError: (errors) => {
                    const firstErr = Object.values(errors)[0] as string;
                    toast.error(firstErr || 'Failed to accept agreement.');
                },
                onFinish: () => setProcessingAction(null),
            }
        );
    };

    const rejectAgreement = (agreementId: string, reason?: string) => {
        setProcessingAction(`reject_${agreementId}`);
        router.post(
            `/agreements/${agreementId}/reject`,
            { reason: reason || 'Offer declined by seller.' },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.info('Agreement proposal declined.');
                },
                onError: () => {
                    toast.error('Failed to reject agreement.');
                },
                onFinish: () => setProcessingAction(null),
            }
        );
    };

    const cancelAgreement = (agreementId: string, reason?: string) => {
        setProcessingAction(`cancel_${agreementId}`);
        router.post(
            `/agreements/${agreementId}/cancel`,
            { reason: reason || 'Agreement cancelled by user.' },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.info('Agreement has been cancelled.');
                },
                onError: () => {
                    toast.error('Failed to cancel agreement.');
                },
                onFinish: () => setProcessingAction(null),
            }
        );
    };

    const completeAgreement = (agreementId: string) => {
        setProcessingAction(`complete_${agreementId}`);
        router.post(
            `/agreements/${agreementId}/complete`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Agreement marked as completed!');
                },
                onError: () => {
                    toast.error('Failed to mark agreement complete.');
                },
                onFinish: () => setProcessingAction(null),
            }
        );
    };

    const proposeAgreement = (data: {
        listing_id: string;
        agreed_price: number;
        payment_type?: string;
        down_payment?: number;
        installment_months?: number;
        closing_date?: string;
        special_terms?: string;
    }) => {
        setProcessingAction('propose');
        router.post('/agreements', data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Deal agreement proposed to seller!');
            },
            onError: (errors) => {
                const firstErr = Object.values(errors)[0] as string;
                toast.error(firstErr || 'Failed to propose agreement.');
            },
            onFinish: () => setProcessingAction(null),
        });
    };

    return {
        processingAction,
        proposeAgreement,
        acceptAgreement,
        rejectAgreement,
        cancelAgreement,
        completeAgreement,
    };
}
