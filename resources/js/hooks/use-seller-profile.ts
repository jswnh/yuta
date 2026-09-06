import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import type { SellerDocument, SellerProfile } from '@/types/seller';

export function useSellerProfile(initialProfile?: SellerProfile | null) {
    const [submittingVerification, setSubmittingVerification] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

    const submitForVerification = () => {
        setSubmittingVerification(true);
        router.post(
            '/settings/seller-profile/verify',
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Your seller profile and documents have been submitted for review!');
                },
                onError: (errors) => {
                    const firstErr = Object.values(errors)[0] as string;
                    toast.error(firstErr || 'Failed to submit verification request.');
                },
                onFinish: () => setSubmittingVerification(false),
            }
        );
    };

    const uploadDocument = (formData: FormData, onSuccessCallback?: () => void) => {
        setUploadingDoc(true);
        router.post('/settings/seller-documents', formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Verification document uploaded successfully.');
                onSuccessCallback?.();
            },
            onError: (errors) => {
                const firstErr = Object.values(errors)[0] as string;
                toast.error(firstErr || 'Failed to upload document.');
            },
            onFinish: () => setUploadingDoc(false),
        });
    };

    const deleteDocument = (documentId: string) => {
        setDeletingDocId(documentId);
        router.delete(`/settings/seller-documents/${documentId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Document removed.');
            },
            onError: () => {
                toast.error('Failed to remove document.');
            },
            onFinish: () => setDeletingDocId(null),
        });
    };

    return {
        submittingVerification,
        uploadingDoc,
        deletingDocId,
        submitForVerification,
        uploadDocument,
        deleteDocument,
    };
}
