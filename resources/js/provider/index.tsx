import { PushNotificationProvider } from './PushNotificationProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <PushNotificationProvider>
                <TooltipProvider delayDuration={0}>
                    {children}
                    <Toaster />
                </TooltipProvider>
            </PushNotificationProvider>
        </QueryClientProvider>
    );
}
