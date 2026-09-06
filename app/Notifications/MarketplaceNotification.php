<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class MarketplaceNotification extends Notification
{
    use Queueable;

    /**
     * @param array{
     *     title: string,
     *     message: string,
     *     type: string,
     *     link?: string,
     *     entity_id?: string
     * } $data
     */
    public function __construct(public readonly array $data) {}

    public function via(object $notifiable): array
    {
        $channels = ['database'];

        // If user has push subscriptions, also send web push
        if (method_exists($notifiable, 'pushSubscriptions') && $notifiable->pushSubscriptions()->exists()) {
            $channels[] = WebPushChannel::class;
        }

        return $channels;
    }

    public function toArray(object $notifiable): array
    {
        return $this->data;
    }

    public function toWebPush($notifiable, $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title($this->data['title'] ?? 'Yuta Notification')
            ->icon('/icons/icon-192.png')
            ->body($this->data['message'] ?? '')
            ->action('View', 'view_action')
            ->data(['url' => $this->data['link'] ?? '/']);
    }
}
