<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirect(string $provider = 'google')
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider = 'google')
    {
        $driver = Socialite::driver($provider);

        if (app()->environment('local') && method_exists($driver, 'setHttpClient')) {
            $driver->setHttpClient(new Client(['verify' => false]));
        }

        try {
            $socialUser = $driver->user();
        } catch (Exception $e) {
            return redirect()->route('login')->with('error', 'Unable to authenticate with '.ucfirst($provider));
        }

        if (! $socialUser->getEmail()) {
            return redirect()->route('login')->with('error', 'Unable to retrieve email from '.ucfirst($provider));
        }

        // First try to find by provider ID (google_id for google)
        $user = null;
        if ($provider === 'google') {
            $user = User::where('google_id', $socialUser->getId())->first();
        }

        // If not found, try by email
        if (! $user) {
            $user = User::where('email', $socialUser->getEmail())->first();
        }

        if ($user) {
            // Link account if not yet linked
            if ($provider === 'google' && ! $user->google_id) {
                $user->google_id = $socialUser->getId();
                $user->avatar = $socialUser->getAvatar() ?? $user->avatar;
                $user->save();
            }
        } else {
            // Create new user
            $fullName = $socialUser->getName() ?? $socialUser->getNickname() ?? 'User';
            $nameParts = $this->splitName($fullName);

            $user = User::create([
                'first_name' => $nameParts['first_name'],
                'middle_name' => $nameParts['middle_name'],
                'last_name' => $nameParts['last_name'],
                'email' => $socialUser->getEmail(),
                'contact_number' => null,
                'google_id' => $provider === 'google' ? $socialUser->getId() : null,
                'avatar' => $socialUser->getAvatar(),
                'email_verified_at' => now(),
                'password' => null,
            ]);
        }

        Auth::login($user, true);

        return redirect()->intended(route('dashboard'));
    }

    private function splitName(string $fullName): array
    {
        $parts = preg_split('/\s+/', trim($fullName)) ?: [];

        $firstName = ! empty($parts[0]) ? $parts[0] : 'User';
        $lastName = count($parts) > 1 ? array_pop($parts) : '';
        $middleName = count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : null;

        return [
            'first_name' => $firstName,
            'middle_name' => $middleName,
            'last_name' => $lastName,
        ];
    }
}
