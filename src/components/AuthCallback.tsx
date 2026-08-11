/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RefreshCw } from 'lucide-react';

interface AuthCallbackProps {
  setIsLoggedIn: (login: boolean) => void;
  setActiveTab: (tab: string) => void;
  addToast: (msg: string) => void;
}

export default function AuthCallback({ setIsLoggedIn, setActiveTab, addToast }: AuthCallbackProps) {
  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Supabase automatically handles the OAuth callback
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          addToast('Authentication failed. Please try again.');
          window.location.href = '/';
          return;
        }

        if (session) {
          setIsLoggedIn(true);
          addToast(`Welcome ${session.user.email}! Successfully authenticated.`);
          setActiveTab('dashboard');
          window.location.href = '/';
        } else {
          window.location.href = '/';
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        window.location.href = '/';
      }
    };

    handleCallback();
  }, [setIsLoggedIn, setActiveTab, addToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/40 to-indigo-50/50">
      <div className="text-center space-y-4">
        <RefreshCw className="h-12 w-12 text-teal-600 animate-spin mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Authenticating...</h2>
        <p className="text-slate-600">Please wait while we complete your login.</p>
      </div>
    </div>
  );
}
