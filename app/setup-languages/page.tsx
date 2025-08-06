"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguagePreferences, AVAILABLE_LANGUAGES, Language } from '@/hooks/useLanguagePreferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Languages, 
  CheckCircle, 
  Globe, 
  ArrowRight,
  Info,
  Heart
} from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';

export default function SetupLanguagesPage() {
  const router = useRouter();
  const { setLanguagePreferences } = useLanguagePreferences();
  const [selectedSecondary, setSelectedSecondary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // English is always primary
  const primaryLanguage = AVAILABLE_LANGUAGES[0]; // English
  const secondaryOptions = AVAILABLE_LANGUAGES.filter(lang => lang.code !== 'en');

  const handleComplete = async () => {
    setIsLoading(true);
    setError('');

    try {
      const secondaryLang = selectedSecondary 
        ? AVAILABLE_LANGUAGES.find(lang => lang.code === selectedSecondary) || null
        : null;

      await setLanguagePreferences(primaryLanguage, secondaryLang);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to save language preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await setLanguagePreferences(primaryLanguage, null);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to save language preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Languages className="h-12 w-12 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Language Preferences</h1>
                <div className="flex items-center justify-center mt-2">
                  <Heart className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-gray-600">ArogyaCare</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 max-w-md mx-auto">
              Choose your preferred languages for the best healthcare experience
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Set Your Language Preferences
              </CardTitle>
              <CardDescription>
                Select a secondary language to complement English for better accessibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Language (Fixed) */}
              <div>
                <Label className="text-base font-medium">Primary Language (Fixed)</Label>
                <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{primaryLanguage.flag}</span>
                      <div>
                        <p className="font-medium text-blue-900">{primaryLanguage.name}</p>
                        <p className="text-sm text-blue-600">{primaryLanguage.localName}</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-blue-600">Primary</Badge>
                  </div>
                </div>
                <Alert className="mt-2">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    English is set as your primary language and cannot be changed.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Secondary Language Selection */}
              <div>
                <Label className="text-base font-medium">Secondary Language (Optional)</Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  Choose an additional language for better accessibility and comfort
                </p>
                
                <RadioGroup 
                  value={selectedSecondary} 
                  onValueChange={setSelectedSecondary}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                    <RadioGroupItem value="" id="none" />
                    <Label htmlFor="none" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🚫</span>
                        <div>
                          <p className="font-medium">No secondary language</p>
                          <p className="text-sm text-gray-500">Use English only</p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {secondaryOptions.map((language) => (
                    <div key={language.code} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      <RadioGroupItem value={language.code} id={language.code} />
                      <Label htmlFor={language.code} className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{language.flag}</span>
                          <div>
                            <p className="font-medium">{language.name}</p>
                            <p className="text-sm text-gray-500">{language.localName}</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Language Usage Info */}
              <Alert>
                <Languages className="h-4 w-4" />
                <AlertDescription>
                  <strong>How this works:</strong> The interface will use English as primary, with your secondary language available for manual switching. Languages won't change automatically - you control when to switch between them.
                </AlertDescription>
              </Alert>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="order-2 sm:order-1"
                >
                  Skip for now
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="order-1 sm:order-2 flex-1"
                >
                  {isLoading ? (
                    "Saving preferences..."
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Preview Section */}
              {selectedSecondary && (
                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium">Your Language Setup Preview:</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                      <span className="text-sm">Primary: English 🇬🇧</span>
                      <Badge variant="outline" className="text-green-700 border-green-300">Always Available</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded">
                      <span className="text-sm">
                        Secondary: {AVAILABLE_LANGUAGES.find(l => l.code === selectedSecondary)?.name} {AVAILABLE_LANGUAGES.find(l => l.code === selectedSecondary)?.flag}
                      </span>
                      <Badge variant="outline" className="text-blue-700 border-blue-300">Manual Switch</Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="text-center mt-6 text-sm text-gray-600">
            <p>You can change these preferences anytime in your profile settings</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
