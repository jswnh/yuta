<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('subscriptions:expire')]
#[Description('Mark active subscriptions whose end date has passed as expired and update seller status')]
class ExpireSubscriptionsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $expiredSubscriptions = Subscription::where('status', 'active')
            ->whereNotNull('ends_at')
            ->where('ends_at', '<=', now())
            ->get();

        $count = $expiredSubscriptions->count();

        foreach ($expiredSubscriptions as $subscription) {
            $subscription->update([
                'status' => 'expired',
            ]);

            /** @var User|null $user */
            $user = User::find($subscription->user_id);
            if ($user && ! $user->isSellerActive()) {
                $user->forceFill([
                    'is_seller' => false,
                ])->save();
            }
        }

        $this->info("Successfully expired {$count} subscriptions.");

        return Command::SUCCESS;
    }
}
