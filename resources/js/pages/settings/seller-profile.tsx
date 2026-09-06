import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useSellerProfile } from '@/hooks/use-seller-profile';
import type { SellerProfile, SellerDocument } from '@/types/seller';
import { 
    ShieldCheck, 
    Upload, 
    Trash2, 
    FileText, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    Send,
    Building2
} from 'lucide-react';

interface SellerProfileProps {
    profile?: SellerProfile | null;
    documents?: SellerDocument[];
    isSeller?: boolean;
}

export default function SellerProfileSettings({ profile, documents = [], isSeller = false }: SellerProfileProps) {
    const { uploadDocument, deleteDocument, submitForVerification, submittingVerification, uploadingDoc, deletingDocId } = useSellerProfile();

    // Profile form state
    const [businessName, setBusinessName] = useState(profile?.business_name || '');
    const [sellerType, setSellerType] = useState(profile?.seller_type || 'owner');
    const [licenseNumber, setLicenseNumber] = useState(profile?.license_number || '');
    const [taxIdNumber, setTaxIdNumber] = useState(profile?.tax_id_number || '');
    const [description, setDescription] = useState(profile?.description || '');
    const [contactPhone, setContactPhone] = useState(profile?.contact_phone || '');
    const [addressLine, setAddressLine] = useState(profile?.address_line || '');
    const [yearsExperience, setYearsExperience] = useState(String(profile?.years_of_experience || ''));

    // Document upload state
    const [docType, setDocType] = useState('government_id');
    const [docNumber, setDocNumber] = useState('');
    const [docFile, setDocFile] = useState<File | null>(null);

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put('/settings/seller-profile', {
            business_name: businessName,
            seller_type: sellerType,
            license_number: licenseNumber,
            tax_id_number: taxIdNumber,
            description,
            contact_phone: contactPhone,
            address_line: addressLine,
            years_of_experience: yearsExperience ? Number(yearsExperience) : null,
        }, {
            preserveScroll: true,
        });
    };

    const handleDocSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!docFile) return;
        const formData = new FormData();
        formData.append('document_type', docType);
        if (docNumber) formData.append('document_name', docNumber);
        formData.append('file', docFile);

        uploadDocument(formData, () => {
            setDocFile(null);
            setDocNumber('');
        });
    };

    const status = profile?.verification_status || 'unverified';

    return (
        <>
            <Head title="Seller Profile & Verification" />

            <div className="space-y-8 max-w-4xl">
                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Seller Profile & Verification</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                        Build buyer confidence with verified credentials (PRC license, government IDs, and DHSUD registration).
                    </p>
                </div>

                {/* VERIFICATION STATUS BANNER */}
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    status === 'verified' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300' :
                    status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300' :
                    status === 'rejected' ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300' :
                    'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                    <div className="flex items-center gap-3">
                        {status === 'verified' && <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                        {status === 'pending' && <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />}
                        {status === 'rejected' && <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />}
                        {status === 'unverified' && <ShieldCheck className="w-6 h-6 text-slate-500 dark:text-slate-400 shrink-0" />}
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm capitalize">Status: {status.replace('_', ' ')}</span>
                                {status === 'verified' && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 text-[10px] font-black uppercase">
                                        Verified Badge Active
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                {status === 'verified' && 'Your listings display the official Verified Seller badge.'}
                                {status === 'pending' && 'Your documents are currently under review by our compliance team.'}
                                {status === 'rejected' && (profile?.rejection_reason || 'Verification was rejected. Please re-upload clear credentials.')}
                                {status === 'unverified' && 'Upload proof documents below and submit for review to earn your badge.'}
                            </p>
                        </div>
                    </div>

                    {status !== 'verified' && status !== 'pending' && (
                        <button
                            type="button"
                            onClick={() => submitForVerification()}
                            disabled={submittingVerification || documents.length === 0}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit for Review</span>
                        </button>
                    )}
                </div>

                {/* PROFILE INFORMATION FORM */}
                <form onSubmit={handleProfileSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Seller Information</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Seller Type</label>
                            <select
                                value={sellerType}
                                onChange={(e) => setSellerType(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            >
                                <option value="owner">Individual Property Owner</option>
                                <option value="broker">Licensed Real Estate Broker</option>
                                <option value="agent">Real Estate Agent / Salesperson</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Business / Agency Name</label>
                            <input
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="e.g. Prime Land Realty (Optional)"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">PRC License Number</label>
                            <input
                                type="text"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                placeholder="PRC REB # (if broker/agent)"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tax ID Number (TIN)</label>
                            <input
                                type="text"
                                value={taxIdNumber}
                                onChange={(e) => setTaxIdNumber(e.target.value)}
                                placeholder="000-000-000-000"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Contact Phone</label>
                            <input
                                type="text"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                placeholder="+63 912 345 6789"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Years of Real Estate Experience</label>
                            <input
                                type="number"
                                value={yearsExperience}
                                onChange={(e) => setYearsExperience(e.target.value)}
                                placeholder="e.g. 5"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Business / Office Address</label>
                        <input
                            type="text"
                            value={addressLine}
                            onChange={(e) => setAddressLine(e.target.value)}
                            placeholder="Complete City, Province"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Seller Bio / Description</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Share your specialization (agricultural land, commercial subdivisions, titles, etc.)..."
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                        >
                            Save Profile
                        </button>
                    </div>
                </form>

                {/* VERIFICATION DOCUMENTS MANAGEMENT */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Verification Documents</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                            Upload government-issued IDs, PRC broker licenses, or DHSUD registration for compliance.
                        </p>
                    </div>

                    {/* UPLOAD FORM */}
                    <form onSubmit={handleDocSubmit} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 block mb-1">Document Type</label>
                                <select
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <option value="government_id">Government ID (Passport / UMID / Driver's)</option>
                                    <option value="prc_license">PRC Real Estate License</option>
                                    <option value="dhsud_registration">DHSUD Registration</option>
                                    <option value="tin_proof">TIN Proof / BIR 2303</option>
                                    <option value="business_permit">Mayor's / Business Permit</option>
                                    <option value="proof_of_billing">Proof of Billing</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 block mb-1">Document / ID Number</label>
                                <input
                                    type="text"
                                    value={docNumber}
                                    onChange={(e) => setDocNumber(e.target.value)}
                                    placeholder="Optional reference #"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 block mb-1">File (PDF, JPG, PNG)</label>
                                <input
                                    type="file"
                                    onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-1.5 text-xs text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={uploadingDoc || !docFile}
                                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm transition-all"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Document</span>
                            </button>
                        </div>
                    </form>

                    {/* UPLOADED DOCUMENTS LIST */}
                    <div className="space-y-3">
                        <h3 className="text-xs uppercase font-bold text-slate-600 dark:text-slate-400">Uploaded Credentials</h3>
                        {documents.length > 0 ? (
                            <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="p-4 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/40">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            <div>
                                                <span className="font-bold text-sm text-slate-900 dark:text-white capitalize block">
                                                    {doc.document_type.replace('_', ' ')}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {doc.document_name ? `#${doc.document_name} • ` : ''}Uploaded {new Date(doc.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                doc.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                                doc.status === 'rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                                                'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                            }`}>
                                                {doc.status}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => deleteDocument(doc.id)}
                                                disabled={deletingDocId === doc.id}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                No verification documents uploaded yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}