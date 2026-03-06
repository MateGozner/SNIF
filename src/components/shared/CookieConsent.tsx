"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type ConsentLevel = "all" | "essential" | "custom";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
}

const CONSENT_KEY = "snif-cookie-consent";

function getStoredConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(CONSENT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as CookiePreferences;
  } catch {
    return null;
  }
}

function storeConsent(preferences: CookiePreferences) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      setVisible(true);
    }
  }, []);

  const accept = (level: ConsentLevel) => {
    const preferences: CookiePreferences = {
      essential: true,
      analytics: level === "all" || (level === "custom" && analytics),
    };
    storeConsent(preferences);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-white dark:bg-gray-900 border-t shadow-lg">
      <div className="max-w-4xl mx-auto">
        {!showManage ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
              We use cookies to keep you signed in and improve your experience.
              See our{" "}
              <a href="/privacy" className="underline font-medium">
                Privacy Policy
              </a>{" "}
              for details.
            </p>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" onClick={() => accept("all")}>
                Accept All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => accept("essential")}
              >
                Essential Only
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowManage(true)}
              >
                Manage Preferences
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Cookie Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="rounded"
                />
                <span>
                  <strong>Essential</strong> — Authentication &amp; session
                  (required)
                </span>
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="rounded"
                />
                <span>
                  <strong>Analytics</strong> — Application Insights performance
                  monitoring
                </span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => accept("custom")}>
                Save Preferences
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowManage(false)}
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
