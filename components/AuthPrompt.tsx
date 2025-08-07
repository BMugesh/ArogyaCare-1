"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  UserPlus, 
  LogIn, 
  Shield, 
  Stethoscope, 
  Bot,
  X,
  Star
} from 'lucide-react';
import Link from 'next/link';

interface AuthPromptProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function AuthPrompt({ onClose, showCloseButton = true }: AuthPromptProps) {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  // Hide if user is already authenticated
  useEffect(() => {
    if (user) {
      setIsVisible(false);
    }
  }, [user]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible || user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-2 sm:p-4 pt-16 sm:pt-20">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-6rem)] overflow-y-auto">
        <Card className="w-full mx-auto relative animate-in fade-in-0 zoom-in-95 duration-300">
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            aria-label="Close welcome dialog"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        <CardHeader className="text-center pb-3 px-3 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Welcome to ArogyaCare
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm lg:text-base mt-2 px-1 sm:px-2">
            Your AI-powered healthcare companion for better health management
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4 lg:space-y-6 px-3 sm:px-6 pb-4 sm:pb-6">
          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mx-auto mb-1 sm:mb-2" />
              <h3 className="font-medium text-blue-900 text-xs sm:text-sm">AI Health Assistant</h3>
              <p className="text-xs text-blue-600 hidden sm:block">Get instant health advice</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-1 sm:mb-2" />
              <h3 className="font-medium text-green-900 text-xs sm:text-sm">Find Doctors</h3>
              <p className="text-xs text-green-600 hidden sm:block">Locate nearby healthcare</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mx-auto mb-1 sm:mb-2" />
              <h3 className="font-medium text-purple-900 text-xs sm:text-sm">Prescription Analysis</h3>
              <p className="text-xs text-purple-600 hidden sm:block">AI-powered medication help</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 mr-1 sm:mr-2" />
              Why join ArogyaCare?
            </h4>
            <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2"></div>
                Personalized health insights
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-2"></div>
                Multi-language support
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mr-2"></div>
                Secure health data storage
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full mr-2"></div>
                24/7 AI health assistant
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-3">
              <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900">
                Join thousands of users taking control of their health
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <Link href="/login?tab=signup" className="w-full sm:w-auto">
                  <Button size="default" className="w-full sm:w-auto flex items-center justify-center space-x-2 text-sm">
                    <UserPlus className="h-4 w-4" />
                    <span>Create Free Account</span>
                  </Button>
                </Link>
                <Link href="/login?tab=signin" className="w-full sm:w-auto">
                  <Button size="default" variant="outline" className="w-full sm:w-auto flex items-center justify-center space-x-2 text-sm">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                100% Secure
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Heart className="h-3 w-3 mr-1" />
                HIPAA Compliant
              </Badge>
            </div>
          </div>

          {/* Skip Option */}
          {showCloseButton && (
            <div className="text-center pt-2 border-t">
              <button
                onClick={handleClose}
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Continue as guest (limited features)
              </button>
            </div>
          )}
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
