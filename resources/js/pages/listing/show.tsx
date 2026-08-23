import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import ListingCard from '@/components/listing-card';
import ListingMap from '@/components/map/listing-map';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { useSavedListings } from '@/hooks/use-saved-listings';
import { useAgreements } from '@/hooks/use-agreements';
import { useInbox } from '@/hooks/use-inbox';
import type { Listing } from '@/types/listing';
import { 
    MapPin, 
    Heart, 
    MessageSquare, 
    FileText, 
    ShieldCheck, 
    Share2, 
    Check, 
    X,
    Maximize2,
    Calendar,
    ArrowLeft
} from 'lucide-react';

interface ListingShowProps {
    listing: Listing;
    similarListings?: Listing[];
}

export default function ListingShow({ listing, similarListings = [] }: ListingShowProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const getInitials = useInitials();
    const { toggleFavorite, isToggling } = useSavedListings();
    const { proposeAgreement, processingAction } = useAgreements();
    const { startInquiry, startingInquiry } = useInbox();

    const isSaved = Boolean(listing.is_favorited);
    const saveLoading = Boolean(isToggling[listing.listing_id]);
    const agreementLoading = processingAction === 'propose';
    const inquiryLoading = startingInquiry;

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const [inquiryMessage, setInquiryMessage] = useState('');
    const [agreementModalOpen, setAgreementModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Deal proposal form state
    const [agreedPrice, setAgreedPrice] = useState(String(listing.price || ''));
    const [paymentType, setPaymentType] = useState('full_cash');
    const [downPayment, setDownPayment] = useState('');
    const [installmentMonths, setInstallmentMonths] = useState('12');
    const [closingDate, setClosingDate] = useState('');
    const [specialTerms, setSpecialTerms] = useState('');

    const images = listing.images && listing.images.length > 0
        ? listing.images
        : [{ image_id: 'default', listing_id: listing.listing_id, file_path: '/images/aerial_land_plot.jpg', caption: null, sort_order: 0, is_primary: true }];

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendInquiry = (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth?.user) {
            router.get('/login');
            return;
        }
        startInquiry(listing.listing_id, inquiryMessage || 'Hi, I am interested in this property listing.', () => {
            setInquiryModalOpen(false);
            setInquiryMessage('');
        });
    };

    const handleProposeAgreement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth?.user) {
            router.get('/login');
            return;
        }
        proposeAgreement({
            listing_id: listing.listing_id,
            agreed_price: Number(agreedPrice),
            payment_type: paymentType,
            down_payment: downPayment ? Number(downPayment) : undefined,
            installment_months: paymentType === 'installment' ? Number(installmentMonths) : undefined,
            closing_date: closingDate || undefined,
            special_terms: specialTerms || undefined,
        });
        setAgreementModalOpen(false);
    };

    const pricePerSqm = listing.area && Number(listing.area) > 0
        ? Math.round(Number(listing.price) / Number(listing.area))
        : null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            <Head title={`${listing.title} — Yuta`} />

            {/* HEADER */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/marketplace" className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogoIcon className="w-5 h-5 text-emerald-400" />
                            <span className="font-black text-lg text-white">Yuta<span className="text-emerald-400">.</span></span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => toggleFavorite(listing.listing_id, listing.is_favorited)}
                            disabled={saveLoading}
                            className={`p-2 rounded-full border cursor-pointer ${isSaved ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'}`}
                        >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400' : ''}`} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* TITLE & PRICE SUMMARY */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{listing.city_municipality}, {listing.province}</span>
                            <span className="text-slate-600">•</span>
                            <span className="uppercase text-emerald-400 font-bold">{listing.land_type?.replace('_', ' ')}</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-white">{listing.title}</h1>
                    </div>

                    <div className="text-left md:text-right">
                        <span className="text-xs uppercase font-bold text-slate-400 block">Asking Price</span>
                        <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                            ₱{Number(listing.price).toLocaleString()}
                        </span>
                        {pricePerSqm && (
                            <span className="text-xs text-slate-500 block mt-0.5">
                                ~₱{pricePerSqm.toLocaleString()} / sqm
                            </span>
                        )}
                    </div>
                </div>

                {/* IMAGE GALLERY */}
                <div className="space-y-3">
                    <div className="relative h-[320px] sm:h-[480px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
                        <img
                            src={images[selectedImageIndex]?.file_path}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-white border border-white/10 uppercase">
                                {listing.title_status?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {images.length > 1 && (
                        <div className="flex items-center gap-3 overflow-x-auto pb-2">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${selectedImageIndex === index ? 'border-emerald-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img.file_path} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* MAIN GRID: DETAILS + SELLER ACTION CARD */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT 8 COLS */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* SPECIFICATIONS HUD */}
                        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Total Area</span>
                                <span className="text-lg font-black text-white">
                                    {Number(listing.area).toLocaleString()} {listing.area_unit}
                                </span>
                            </div>
                            <div>
                                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Title Document</span>
                                <span className="text-lg font-black text-white capitalize">
                                    {listing.title_status?.replace('_', ' ')}
                                </span>
                            </div>
                            <div>
                                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Topography</span>
                                <span className="text-lg font-black text-white capitalize">
                                    {listing.topography || 'Flat'}
                                </span>
                            </div>
                            <div>
                                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Listing ID</span>
                                <span className="text-xs font-mono text-slate-400 block truncate mt-1">
                                    {listing.listing_id.substring(0, 8)}
                                </span>
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
                            <h2 className="text-xl font-bold text-white">Property Description</h2>
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                                {listing.description}
                            </p>
                        </div>

                        {/* BOUNDARY MAP */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">GIS Location & Boundaries</h2>
                                <span className="text-xs text-slate-400">Coordinates: {Number(listing.latitude).toFixed(4)}, {Number(listing.longitude).toFixed(4)}</span>
                            </div>
                            <ListingMap
                                listings={[listing]}
                                selectedListingId={listing.listing_id}
                                height="400px"
                            />
                        </div>
                    </div>

                    {/* RIGHT 4 COLS: SELLER & DEAL PROPOSAL CARD */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* SELLER CARD */}
                        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 sticky top-24">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-14 h-14 rounded-2xl border border-slate-800">
                                    <AvatarImage src={listing.seller?.avatar || undefined} alt={listing.seller?.name || listing.seller?.first_name} />
                                    <AvatarFallback className="bg-emerald-950 text-emerald-400 font-bold">
                                        {getInitials(listing.seller?.name || listing.seller?.first_name || 'Seller')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-black text-white text-base">
                                            {listing.seller?.name || `${listing.seller?.first_name || ''} ${listing.seller?.last_name || ''}`.trim() || 'Property Seller'}
                                        </h3>
                                        {listing.seller?.seller_profile?.verification_status === 'verified' && (
                                            <ShieldCheck className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-400 capitalize block">
                                        {listing.seller?.seller_profile?.seller_type || listing.seller_type || 'Property Owner'}
                                    </span>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={() => setAgreementModalOpen(true)}
                                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Make an Offer / Start Deal</span>
                                </button>

                                <button
                                    onClick={() => setInquiryModalOpen(true)}
                                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Send Inquiry Message</span>
                                </button>
                            </div>

                            <div className="border-t border-slate-800 pt-4 text-xs text-slate-500 space-y-1">
                                <p>🔒 Secure Land Deal Workflow</p>
                                <p>📄 Automated Digital Agreement Terms</p>
                                <p>💳 Optional Xendit Invoice & Manual Settlement</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIMILAR LISTINGS */}
                {similarListings.length > 0 && (
                    <div className="pt-12 border-t border-slate-800 space-y-6">
                        <h2 className="text-2xl font-black text-white">Similar Properties</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similarListings.map((sim) => (
                                <ListingCard key={sim.listing_id} listing={sim} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* INQUIRY MODAL */}
            {inquiryModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Contact Seller</h3>
                            <button onClick={() => setInquiryModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSendInquiry} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 block mb-1">Your Message</label>
                                <textarea
                                    rows={4}
                                    value={inquiryMessage}
                                    onChange={(e) => setInquiryMessage(e.target.value)}
                                    placeholder="Ask about site inspection, title documents, or availability..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setInquiryModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                                    Cancel
                                </button>
                                <button type="submit" disabled={inquiryLoading} className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* AGREEMENT PROPOSAL MODAL */}
            {agreementModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 my-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">Start Property Deal Agreement</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Submit terms to the seller for review.</p>
                            </div>
                            <button onClick={() => setAgreementModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleProposeAgreement} className="space-y-4 text-xs">
                            <div>
                                <label className="font-semibold text-slate-300 block mb-1">Agreed Price (₱ PHP)</label>
                                <input
                                    type="number"
                                    value={agreedPrice}
                                    onChange={(e) => setAgreedPrice(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm text-white font-bold"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-semibold text-slate-300 block mb-1">Payment Method</label>
                                    <select
                                        value={paymentType}
                                        onChange={(e) => setPaymentType(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-white"
                                    >
                                        <option value="full_cash">Full Cash Payment</option>
                                        <option value="installment">Installment / Deferred</option>
                                        <option value="bank_financing">Bank Financing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-300 block mb-1">Down Payment (₱)</label>
                                    <input
                                        type="number"
                                        value={downPayment}
                                        onChange={(e) => setDownPayment(e.target.value)}
                                        placeholder="Optional (e.g. 20%)"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-white"
                                    />
                                </div>
                            </div>

                            {paymentType === 'installment' && (
                                <div>
                                    <label className="font-semibold text-slate-300 block mb-1">Installment Duration (Months)</label>
                                    <input
                                        type="number"
                                        value={installmentMonths}
                                        onChange={(e) => setInstallmentMonths(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-white"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="font-semibold text-slate-300 block mb-1">Target Closing Date</label>
                                <input
                                    type="date"
                                    value={closingDate}
                                    onChange={(e) => setClosingDate(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-white"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-300 block mb-1">Special Terms / Conditions</label>
                                <textarea
                                    rows={3}
                                    value={specialTerms}
                                    onChange={(e) => setSpecialTerms(e.target.value)}
                                    placeholder="e.g. Subject to clean title verification and boundary geodetic survey..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-white"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setAgreementModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold">
                                    Cancel
                                </button>
                                <button type="submit" disabled={agreementLoading} className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                                    Submit Proposal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}