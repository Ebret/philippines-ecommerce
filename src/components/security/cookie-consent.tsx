'use client';

/**
 * Cookie Consent Banner Component
 * 
 * GDPR/Data Privacy Act compliant cookie consent management
 * with granular control over cookie categories.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Cookie, Shield, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import {
  CookieConsent as CookieConsentType,
  createDefaultConsent,
  serializeConsent,
  deserializeConsent,
  needsConsentRenewal,
  defaultPrivacyConfig,
} from '@/lib/privacy-protection';

interface CookieConsentProps {
  onConsentChange?: (consent: CookieConsentType) => void;
  privacyPolicyUrl?: string;
  cookiePolicyUrl?: string;
}

const COOKIE_NAME = 'cookie_consent';

export function CookieConsentBanner({
  onConsentChange,
  privacyPolicyUrl = defaultPrivacyConfig.privacyPolicyUrl,
  cookiePolicyUrl = defaultPrivacyConfig.cookiePolicyUrl,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsentType>(createDefaultConsent());

  // Check for existing consent on mount
  useEffect(() => {
    const existingConsent = getCookieConsent();
    if (existingConsent && !needsConsentRenewal(existingConsent)) {
      setConsent(existingConsent);
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  const getCookieConsent = useCallback((): CookieConsentType | null => {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const consentCookie = cookies.find(c => c.trim().startsWith(`${COOKIE_NAME}=`));
    
    if (!consentCookie) return null;
    
    const value = consentCookie.split('=')[1];
    return deserializeConsent(value);
  }, []);

  const saveConsent = useCallback((newConsent: CookieConsentType) => {
    const updatedConsent = {
      ...newConsent,
      timestamp: Date.now(),
      version: defaultPrivacyConfig.cookieConsentVersion,
    };
    
    const serialized = serializeConsent(updatedConsent);
    const maxAge = defaultPrivacyConfig.cookieExpiryDays * 24 * 60 * 60;
    
    document.cookie = `${COOKIE_NAME}=${serialized}; max-age=${maxAge}; path=/; SameSite=Lax; Secure`;
    
    setConsent(updatedConsent);
    onConsentChange?.(updatedConsent);
    setIsVisible(false);
  }, [onConsentChange]);

  const handleAcceptAll = () => {
    saveConsent({
      ...consent,
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleAcceptNecessary = () => {
    saveConsent({
      ...consent,
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  const handleSavePreferences = () => {
    saveConsent(consent);
  };

  const toggleCategory = (category: keyof CookieConsentType) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    setConsent(prev => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-sm border-t">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Cookie Preferences</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAcceptNecessary}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            <a href={privacyPolicyUrl} className="text-primary hover:underline ml-1">
              Privacy Policy
            </a>
            {' | '}
            <a href={cookiePolicyUrl} className="text-primary hover:underline">
              Cookie Policy
            </a>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAcceptAll} className="flex-1 sm:flex-none">
              <Shield className="h-4 w-4 mr-2" />
              Accept All
            </Button>
            <Button variant="outline" onClick={handleAcceptNecessary} className="flex-1 sm:flex-none">
              Necessary Only
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 sm:flex-none"
            >
              <Settings className="h-4 w-4 mr-2" />
              Customize
              {showDetails ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </Button>
          </div>

          {/* Detailed Preferences */}
          {showDetails && (
            <div className="space-y-4 pt-4 border-t">
              {/* Necessary Cookies */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Necessary Cookies</Label>
                  <p className="text-xs text-muted-foreground">
                    Required for the website to function. Cannot be disabled.
                  </p>
                </div>
                <Switch checked={true} disabled aria-label="Necessary cookies (always enabled)" />
              </div>

              {/* Functional Cookies */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Functional Cookies</Label>
                  <p className="text-xs text-muted-foreground">
                    Remember your preferences and settings.
                  </p>
                </div>
                <Switch
                  checked={consent.functional}
                  onCheckedChange={() => toggleCategory('functional')}
                  aria-label="Functional cookies"
                />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Analytics Cookies</Label>
                  <p className="text-xs text-muted-foreground">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <Switch
                  checked={consent.analytics}
                  onCheckedChange={() => toggleCategory('analytics')}
                  aria-label="Analytics cookies"
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Marketing Cookies</Label>
                  <p className="text-xs text-muted-foreground">
                    Used to deliver personalized advertisements.
                  </p>
                </div>
                <Switch
                  checked={consent.marketing}
                  onCheckedChange={() => toggleCategory('marketing')}
                  aria-label="Marketing cookies"
                />
              </div>

              <Button onClick={handleSavePreferences} className="w-full">
                Save Preferences
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CookieConsentBanner;

