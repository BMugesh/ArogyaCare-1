"use client";

import { useState } from 'react';
import { useLanguagePreferences } from '@/hooks/useLanguagePreferences';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Languages, Settings, Check } from 'lucide-react';
import Link from 'next/link';

export function LanguageSwitcher() {
  const { preferences, switchLanguage, loading } = useLanguagePreferences();

  if (loading || !preferences) {
    return (
      <Button size="sm" variant="outline" disabled>
        <Languages className="h-4 w-4" />
      </Button>
    );
  }

  const availableLanguages = [preferences.primaryLanguage];
  if (preferences.secondaryLanguage) {
    availableLanguages.push(preferences.secondaryLanguage);
  }

  // If only English available, show simple indicator
  if (availableLanguages.length === 1) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
        <span className="text-lg">{preferences.primaryLanguage.flag}</span>
        <span className="text-sm font-medium text-blue-600 hidden sm:inline">
          {preferences.primaryLanguage.name}
        </span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center space-x-2">
          <span className="text-base">{preferences.currentLanguage.flag}</span>
          <span className="hidden sm:inline text-sm font-medium">
            {preferences.currentLanguage.name}
          </span>
          <Languages className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-medium text-gray-500">
          Switch Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {availableLanguages.map((language) => (
          <DropdownMenuItem 
            key={language.code}
            onClick={() => switchLanguage(language)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="text-base">{language.flag}</span>
              <div>
                <p className="font-medium">{language.name}</p>
                <p className="text-xs text-gray-500">{language.localName}</p>
              </div>
            </div>
            {preferences.currentLanguage.code === language.code && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/setup-languages" className="flex items-center space-x-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Language Settings</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
