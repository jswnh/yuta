import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { useAppearance } from '@/hooks/use-appearance';
import mockListings from '@/data/mock-listings';
import ListingCard from '@/components/listing-card';
import ListingMap from '@/components/map/listing-map';
import welcomeContent from '@/data/welcome-content.json';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { 
    Sun,
    Moon,
    Layers, 
    TrendingUp, 
    Maximize2, 
    Mountain, 
    ShieldCheck, 
    ArrowUpRight, 
    Plus, 
    CheckCircle2, 
    FileCheck, 
    MapPin, 
    Search, 
    Menu, 
    X,
    Sparkles,
    ChevronRight,
    Globe,
    Flame,
    Map as MapIcon,
    Zap,
    Tag,
    Building2,
    Home as HomeIcon,
    TreePine,
    Briefcase,
    CreditCard
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const getInitials = useInitials();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('marketplace');
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const handleBecomeSeller = () => {
        if (auth?.user) {
            if (auth.user.is_seller) {
                router.get('/dashboard');
            } else {
                router.post('/become-seller');
            }
        } else {
            router.get('/register');
        }
    };

    const scrollToSection = (id: string) => {
        setActiveTab(id);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Sort mock listings by view_count descending to show Most Visited Items first
    const mostVisitedListings = [...mockListings].sort((a, b) => b.view_count - a.view_count);

    // Filter listings based on category selection (Land & Lots vs House & Lot vs Farm vs Commercial)
    const filteredListings = mostVisitedListings.filter((listing) => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'land_lots') return listing.land_type === 'residential' || listing.land_type === 'raw_land';
        if (selectedCategory === 'house_and_lot') return listing.land_type === 'residential';
        if (selectedCategory === 'farm') return listing.land_type === 'agricultural';
        if (selectedCategory === 'commercial') return listing.land_type === 'commercial';
        return true;
    });

    const [activeHudBadge, setActiveHudBadge] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    const challengeIcons = [Tag, ShieldCheck, FileCheck, Zap];

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setEmailSubmitted(true);
            setEmail('');
            setTimeout(() => setEmailSubmitted(false), 4000);
        }
    };

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            <Head title={welcomeContent.meta.pageTitle} />

            <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white font-sans antialiased overflow-x-hidden transition-colors duration-300">
                {/* Background Ambient Glow */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-100/40 via-teal-50/20 to-transparent dark:from-emerald-950/20 dark:via-slate-900/10 blur-3xl -z-10 pointer-events-none" />

                {/* HEADER SECTION */}
                <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-md bg-[#FAF9F6]/80 dark:bg-[#0B0F17]/80 border-b border-slate-200/50 dark:border-slate-800/80 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        {/* Logo: AppLogoIcon + "Yuta" */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <AppLogoIcon className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
                            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                                Yuta
                            </span>
                        </Link>

                        {/* Pill Navigation Links */}
                        <nav className="hidden md:flex items-center bg-white/90 dark:bg-slate-900/90 shadow-xs border border-slate-200/80 dark:border-slate-800 rounded-full px-4 py-1.5 gap-1 backdrop-blur-sm">
                            {[
                                { id: 'marketplace', label: 'Marketplace' },
                                { id: 'spotlight', label: 'Spotlight' },
                                { id: 'why-yuta', label: 'Why Yuta' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                                        activeTab === item.id
                                            ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs font-semibold'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* Right Header Actions */}
                        <div className="flex items-center gap-3">
                            {/* Theme Switcher Button */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title={`Switch to ${resolvedAppearance === 'dark' ? 'light' : 'dark'} mode`}
                                aria-label="Toggle theme"
                            >
                                {resolvedAppearance === 'dark' ? (
                                    <Sun className="w-4 h-4 text-amber-400" />
                                ) : (
                                    <Moon className="w-4 h-4 text-slate-700" />
                                )}
                            </button>

                            {/* Become a Seller / Seller Dashboard Action Button */}
                            {auth?.user?.is_seller ? (
                                <Link
                                    href="/dashboard"
                                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xs"
                                >
                                    <Briefcase className="w-3.5 h-3.5" />
                                    <span>Seller Dashboard</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={handleBecomeSeller}
                                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-md hover:shadow-emerald-500/25 active:scale-95 cursor-pointer border border-emerald-200/50 dark:border-emerald-500/30"
                                >
                                    <Building2 className="w-4 h-4 text-slate-950" />
                                    <span>Become a Seller</span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/85 text-amber-300 text-[10px] font-black tracking-wide border border-amber-400/40">
                                        <CreditCard className="w-3 h-3 text-amber-300" />
                                        PAID
                                    </span>
                                </button>
                            )}

                            {/* User Profile Dropdown (Only shown if Auth) */}
                            {auth?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 rounded-full p-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none">
                                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                <AvatarImage src={auth.user.avatar} alt={auth.user.first_name} />
                                                <AvatarFallback className="bg-emerald-600 text-white font-semibold text-xs">
                                                    {getInitials(`${auth.user.first_name} ${auth.user.last_name}`)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="hidden lg:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200 pr-2">
                                                {auth.user.first_name}
                                            </span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 rounded-full transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="text-xs font-semibold bg-slate-900 text-white dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-2 rounded-full transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}

                            {/* Mobile menu toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
                                aria-label="Toggle Navigation"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Dropdown Nav */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-3 pt-3 pb-2 border-t border-slate-200/60 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                            {[
                                { id: 'marketplace', label: 'Marketplace' },
                                { id: 'spotlight', label: 'Spotlight' },
                                { id: 'why-yuta', label: 'Why Yuta' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        scrollToSection(item.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="px-4 py-2 rounded-xl text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-1 flex flex-col gap-2">
                                {!auth?.user?.is_seller && (
                                    <button
                                        onClick={() => {
                                            handleBecomeSeller();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 text-slate-950 text-xs shadow-md active:scale-95 cursor-pointer"
                                    >
                                        <Building2 className="w-4 h-4 text-slate-950" />
                                        <span>Become a Seller</span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/85 text-amber-300 text-[10px] font-black tracking-wide border border-amber-400/40">
                                            <CreditCard className="w-3 h-3 text-amber-300" />
                                            PAID
                                        </span>
                                    </button>
                                )}
                                {auth?.user ? (
                                    <Link
                                        href="/settings/profile"
                                        className="w-full text-center py-2.5 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                                    >
                                        Profile Settings
                                    </Link>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link
                                            href="/login"
                                            className="flex-1 text-center py-2 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="flex-1 text-center py-2 rounded-xl font-bold bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 text-xs"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                {/* HERO SECTION */}
                <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-16 sm:pb-12 text-center">
                    {/* Top Pill Announcement */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                        <span>{welcomeContent.hero.badge}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                    </div>

                    {/* Bold Main Headline */}
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-5xl mx-auto mb-6">
                        {welcomeContent.hero.headlineMain} <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-700 dark:from-white dark:via-emerald-300 dark:to-teal-400 bg-clip-text text-transparent">
                            {welcomeContent.hero.headlineHighlight}
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-8">
                        {welcomeContent.hero.subtext}
                    </p>

                    {/* Quick Search Bar */}
                    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-2 rounded-full shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2 mb-6 transition-colors">
                        <div className="pl-4 text-slate-400 flex items-center gap-2 flex-1">
                            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <input 
                                type="text"
                                placeholder={welcomeContent.hero.searchPlaceholder}
                                className="w-full bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            />
                        </div>
                        <button 
                            onClick={() => setModalOpen(true)}
                            className="bg-slate-900 hover:bg-emerald-600 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-medium px-6 py-3 rounded-full text-sm transition-all duration-300 flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
                        >
                            <Search className="w-4 h-4" />
                            <span>{welcomeContent.hero.searchButtonText}</span>
                        </button>
                    </div>

                    {/* Category Selection Filter Pills (Land & Lots vs House & Lot) */}
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-10">
                        {welcomeContent.hero.categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                    selectedCategory === cat.id
                                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                                        : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Key Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2 pb-6 border-y border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
                        {welcomeContent.hero.stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* LARGE CENTRAL ROUNDED CONTAINER WITH AERIAL LANDSCAPE & FROSTED GLASS HUD BADGES */}
                <section id="spotlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                    <div className="relative w-full rounded-[2.5rem] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl min-h-[560px] sm:min-h-[660px] flex flex-col justify-between p-6 sm:p-10 transition-all bg-slate-900 group">
                        
                        {/* Aerial Landscape Background */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src="/images/aerial_land_plot.jpg"
                                alt="Aerial landscape property view"
                                className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out brightness-95"
                            />
                            {/* Dark vignette gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-slate-950/50" />
                        </div>

                        {/* SOFT OVERLAY EFFECTS */}
                        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                            {/* Animated cloud layer 1 */}
                            <div 
                                className="absolute -top-1/4 -left-1/4 w-[140%] h-[140%] opacity-50 mix-blend-screen animate-cloud-1 bg-repeat"
                                style={{
                                    backgroundImage: `radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0) 70%)`
                                }}
                            />
                            {/* Animated cloud layer 2 */}
                            <div 
                                className="absolute -bottom-1/3 -right-1/4 w-[130%] h-[130%] opacity-45 mix-blend-screen animate-cloud-2 bg-repeat"
                                style={{
                                    backgroundImage: `radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 75%)`
                                }}
                            />
                            {/* Grid Overlay */}
                            <div 
                                className="absolute inset-0 opacity-15"
                                style={{
                                    backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                                    backgroundSize: `48px 48px`
                                }}
                            />
                        </div>

                        {/* HUD TOP BAR HEADER OVERLAY */}
                        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4">
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-hud text-white text-xs sm:text-sm font-medium tracking-wide">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 absolute" />
                                <span className="font-semibold text-emerald-300 ml-3">{welcomeContent.featuredPlotHud.hudTitle}</span>
                                <span className="text-slate-400">|</span>
                                <span className="text-slate-200">{welcomeContent.featuredPlotHud.propertyCode}</span>
                            </div>

                            <div className="hidden sm:flex items-center gap-3">
                                <div className="px-3.5 py-1.5 rounded-full glass-hud text-xs font-mono text-emerald-300 flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>{welcomeContent.featuredPlotHud.coordinates}</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-full glass-hud text-xs text-white font-medium">
                                    Status: <span className="text-emerald-400 font-semibold">{welcomeContent.featuredPlotHud.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* INTERACTIVE PROPERTY BOUNDARY PINS ON MAP */}
                        <div className="relative z-20 my-auto py-12 flex flex-col justify-center items-center">
                            {/* Center Target Crosshair Graphic */}
                            <div className="relative flex items-center justify-center">
                                <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-emerald-400/30 animate-spin-slow pointer-events-none flex items-center justify-center">
                                    <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border border-dashed border-emerald-300/40" />
                                </div>
                                <div className="absolute w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_20px_#10b981] animate-pulse-glow" />
                                
                                {/* Floating Pin 1 */}
                                <div className="absolute -top-6 -left-12 sm:-left-20">
                                    <div className="glass-hud px-3 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-emerald-400/40 animate-hud-float">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>{welcomeContent.featuredPlotHud.pinFrontage}</span>
                                    </div>
                                </div>

                                {/* Floating Pin 2 */}
                                <div className="absolute -bottom-6 -right-12 sm:-right-20">
                                    <div className="glass-hud px-3 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-emerald-400/40 animate-hud-float-delayed">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>{welcomeContent.featuredPlotHud.pinTitle}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FLOATING FROSTED GLASS HUD BADGES GRID */}
                        <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 lg:mb-0">
                            
                            {/* HUD BADGE 1: LOT AREA */}
                            <div 
                                onClick={() => setActiveHudBadge('area')}
                                className={`glass-hud rounded-2xl p-4.5 sm:p-5 text-white transition-all duration-300 cursor-pointer hover:border-emerald-400/60 hover:translate-y-[-3px] ${
                                    activeHudBadge === 'area' ? 'ring-2 ring-emerald-400 bg-slate-900/80' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                                        <Maximize2 className="w-4 h-4 text-emerald-400" />
                                        {welcomeContent.featuredPlotHud.metrics.lotArea.title}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                                        {welcomeContent.featuredPlotHud.metrics.lotArea.badge}
                                    </span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                                    {welcomeContent.featuredPlotHud.metrics.lotArea.value}
                                </div>
                                <div className="text-xs text-slate-300 font-medium flex items-center justify-between">
                                    <span>{welcomeContent.featuredPlotHud.metrics.lotArea.sub}</span>
                                    <span className="text-emerald-400 font-semibold">Clean Boundary</span>
                                </div>
                            </div>

                            {/* HUD BADGE 2: PRICE TREND BAR CHART */}
                            <div 
                                onClick={() => setActiveHudBadge('price')}
                                className={`glass-hud rounded-2xl p-4.5 sm:p-5 text-white transition-all duration-300 cursor-pointer hover:border-emerald-400/60 hover:translate-y-[-3px] ${
                                    activeHudBadge === 'price' ? 'ring-2 ring-emerald-400 bg-slate-900/80' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        {welcomeContent.featuredPlotHud.metrics.priceTrend.title}
                                    </span>
                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                                        {welcomeContent.featuredPlotHud.metrics.priceTrend.badge}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                        {welcomeContent.featuredPlotHud.metrics.priceTrend.value}
                                    </span>
                                </div>
                                {/* Micro Bar Chart SVG */}
                                <div className="flex items-end gap-1.5 h-7 pt-1">
                                    {[40, 52, 60, 68, 82, 100].map((height, i) => (
                                        <div key={i} className="flex-1 bg-slate-700/60 rounded-t overflow-hidden h-full flex items-end">
                                            <div 
                                                className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t transition-all duration-500" 
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* HUD BADGE 3: SOIL & GROUND QUALITY */}
                            <div 
                                onClick={() => setActiveHudBadge('soil')}
                                className={`glass-hud rounded-2xl p-4.5 sm:p-5 text-white transition-all duration-300 cursor-pointer hover:border-emerald-400/60 hover:translate-y-[-3px] ${
                                    activeHudBadge === 'soil' ? 'ring-2 ring-emerald-400 bg-slate-900/80' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                        {welcomeContent.featuredPlotHud.metrics.soilQuality.title}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold">
                                        {welcomeContent.featuredPlotHud.metrics.soilQuality.badge}
                                    </span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                                    {welcomeContent.featuredPlotHud.metrics.soilQuality.value}
                                </div>
                                {/* Progress gauge bar */}
                                <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden mb-1.5">
                                    <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full w-[98.4%]" />
                                </div>
                                <div className="text-xs text-slate-300 font-medium">
                                    {welcomeContent.featuredPlotHud.metrics.soilQuality.sub}
                                </div>
                            </div>

                            {/* HUD BADGE 4: ELEVATION & FLOOD SAFETY */}
                            <div 
                                onClick={() => setActiveHudBadge('elevation')}
                                className={`glass-hud rounded-2xl p-4.5 sm:p-5 text-white transition-all duration-300 cursor-pointer hover:border-emerald-400/60 hover:translate-y-[-3px] ${
                                    activeHudBadge === 'elevation' ? 'ring-2 ring-emerald-400 bg-slate-900/80' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                                        <Mountain className="w-4 h-4 text-emerald-400" />
                                        {welcomeContent.featuredPlotHud.metrics.elevation.title}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                                        {welcomeContent.featuredPlotHud.metrics.elevation.badge}
                                    </span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                                    {welcomeContent.featuredPlotHud.metrics.elevation.value}
                                </div>
                                <div className="text-xs text-slate-300 font-medium flex items-center justify-between">
                                    <span>{welcomeContent.featuredPlotHud.metrics.elevation.sub}</span>
                                    <span className="text-emerald-400 font-semibold">Zero Risk</span>
                                </div>
                            </div>

                        </div>

                        {/* BOTTOM-RIGHT FLOATING CTA BUTTON */}
                        <button 
                            onClick={() => setModalOpen(true)}
                            className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-30 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold px-6 py-3.5 shadow-2xl hover:shadow-emerald-900/20 hover:scale-105 active:scale-95 border border-white/90 dark:border-slate-700 transition-all duration-300 cursor-pointer flex items-center gap-2.5 text-sm sm:text-base group"
                        >
                            <span>{welcomeContent.featuredPlotHud.ctaButtonText}</span>
                            <div className="w-7 h-7 rounded-full bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            </div>
                        </button>
                    </div>
                </section>

                {/* FEATURED MARKETPLACE SECTION: MOST VISITED ITEMS & INTERACTIVE MAP */}
                <section id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-500/20">
                                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span>{welcomeContent.trendingSection.badge}</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {welcomeContent.trendingSection.title}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                {welcomeContent.trendingSection.subtext}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {filteredListings.length} Active Listings
                            </span>
                        </div>
                    </div>

                    {/* INTERACTIVE MAP DISPLAY */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <MapIcon className="w-4 h-4 text-emerald-500" />
                                {welcomeContent.trendingSection.mapLabel}
                            </span>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                {welcomeContent.trendingSection.mapSubtext}
                            </span>
                        </div>
                        <ListingMap 
                            listings={filteredListings}
                            selectedListingId={selectedListingId}
                            onSelectListing={(id) => setSelectedListingId(id)}
                            height="420px"
                        />
                    </div>

                    {/* MARKETPLACE LISTINGS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {filteredListings.map((listing) => (
                            <ListingCard 
                                key={listing.listing_id}
                                listing={listing}
                                isSelected={listing.listing_id === selectedListingId}
                                onHover={() => setSelectedListingId(listing.listing_id)}
                            />
                        ))}
                    </div>
                </section>

                {/* SECTION: WHY YUTA WORKS BETTER / KEY ADVANTAGES */}
                <section id="why-yuta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-20">
                    <div className="flex flex-col items-start gap-4 mb-12">
                        {/* Left Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-xs">
                            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{welcomeContent.challengesSection.badge}</span>
                        </div>

                        {/* Bold Heading */}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                            {welcomeContent.challengesSection.title}
                        </h2>

                        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl font-normal leading-relaxed">
                            {welcomeContent.challengesSection.subtext}
                        </p>
                    </div>

                    {/* Light Rounded Card Components Underneath */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {welcomeContent.challengesSection.items.map((item, idx) => {
                            const IconComponent = challengeIcons[idx] || Building2;
                            return (
                                <div 
                                    key={idx}
                                    className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-emerald-400/50"
                                >
                                    <div>
                                        {/* Card Top Pill Badge */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="px-3 py-1 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                                                {item.badge}
                                            </div>
                                            <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">
                                                0{idx + 1} / 04
                                            </span>
                                        </div>

                                        {/* Challenge Title */}
                                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <span>{item.title}</span>
                                        </h3>

                                        {/* Problem Description */}
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Yuta Solution Component Box */}
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-4 group-hover:bg-emerald-50/40 dark:group-hover:bg-emerald-950/20 transition-colors">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            <span>Yuta Advantage: {item.solution}</span>
                                        </div>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                            {item.solutionText}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* PROMOTIONAL CTA BANNER (PROMOTING BUYING & SELLING) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                    <div className="relative rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 p-8 sm:p-14 text-white overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Decorative background glow circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10 max-w-2xl text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-4">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{welcomeContent.promoBanner.badge}</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                                {welcomeContent.promoBanner.title}
                            </h2>
                            <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed">
                                {welcomeContent.promoBanner.subtext}
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
                            <button 
                                onClick={() => setModalOpen(true)}
                                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-full text-base transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Search className="w-4 h-4" />
                                <span>{welcomeContent.promoBanner.buyButton}</span>
                            </button>
                            
                            {auth?.user?.is_seller ? (
                                <Link 
                                    href="/dashboard"
                                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-full text-base border border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Building2 className="w-4 h-4 text-emerald-400" />
                                    <span>Go to Seller Dashboard</span>
                                </Link>
                            ) : (
                                <button 
                                    onClick={handleBecomeSeller}
                                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-7 py-3.5 rounded-full text-base transition-all duration-300 shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
                                >
                                    <Building2 className="w-5 h-5 text-slate-950" />
                                    <span>Become a Property Seller</span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/90 text-amber-300 text-xs font-black tracking-wider border border-amber-400/40">
                                        <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                                        PAID PLAN
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* FOOTER SECTION */}
                <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="md:col-span-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <AppLogoIcon className="h-8 w-auto object-contain" />
                                    <span className="font-bold text-2xl tracking-tight text-white">Yuta</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                                    {welcomeContent.footer.brandDescription}
                                </p>
                            </div>

                            <div className="text-xs text-slate-500">
                                © {new Date().getFullYear()} Yuta. All rights reserved.
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="md:col-span-3">
                            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                                {welcomeContent.footer.quickLinksTitle}
                            </h4>
                            <ul className="space-y-2.5 text-sm">
                                {welcomeContent.footer.quickLinks.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:text-emerald-400 transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter Column */}
                        <div className="md:col-span-4">
                            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                                {welcomeContent.footer.newsletterTitle}
                            </h4>
                            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                                {welcomeContent.footer.newsletterSubtext}
                            </p>

                            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                                <div className="relative">
                                    <input 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={welcomeContent.footer.newsletterPlaceholder}
                                        required
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer"
                                >
                                    {welcomeContent.footer.newsletterButton}
                                </button>
                                {emailSubmitted && (
                                    <p className="text-xs text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {welcomeContent.footer.newsletterSuccess}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </footer>

                {/* INTERACTIVE PROPERTIES MODAL */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95">
                            <button 
                                onClick={() => setModalOpen(false)}
                                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <AppLogoIcon className="h-8 w-auto object-contain" />
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{welcomeContent.modal.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{welcomeContent.modal.subtext}</p>
                                </div>
                            </div>

                            <div className="space-y-4 my-6 max-h-[60vh] overflow-y-auto pr-1">
                                {filteredListings.map((listing) => (
                                    <div key={listing.listing_id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-slate-900 dark:text-white">{listing.title}</span>
                                            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">₱{listing.price.toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                                            {listing.area.toLocaleString()} {listing.area_unit} • {listing.city_municipality}, {listing.province} • 🔥 {listing.view_count.toLocaleString()} views
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => {
                                                    setSelectedListingId(listing.listing_id);
                                                    setModalOpen(false);
                                                }}
                                                className="bg-slate-900 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer"
                                            >
                                                {welcomeContent.modal.highlightButton}
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    alert(`Contacting ${listing.seller_type}: Direct inquiry for ${listing.title}`);
                                                }}
                                                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 text-xs font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer"
                                            >
                                                {welcomeContent.modal.contactButton}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button 
                                    onClick={() => setModalOpen(false)}
                                    className="px-5 py-2.5 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors cursor-pointer"
                                >
                                    {welcomeContent.modal.closeButton}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
