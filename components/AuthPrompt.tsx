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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl mx-auto relative animate-in fade-in-0 zoom-in-95 duration-300">
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Welcome to ArogyaCare
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Your AI-powered healthcare companion for better health management
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Bot className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-blue-900">AI Health Assistant</h3>
              <p className="text-sm text-blue-600">Get instant health advice</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Stethoscope className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-green-900">Find Doctors</h3>
              <p className="text-sm text-green-600">Locate nearby healthcare</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-purple-900">Prescription Analysis</h3>
              <p className="text-sm text-purple-600">AI-powered medication help</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              Why join ArogyaCare?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Personalized health insights
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Multi-language support
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Secure health data storage
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                24/7 AI health assistant
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <div className="space-y-3">
              <p className="text-lg font-medium text-gray-900">
                Join thousands of users taking control of their health
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/login?tab=signup">
                  <Button size="lg" className="w-full sm:w-auto flex items-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Create Free Account</span>
                  </Button>
                </Link>
                <Link href="/login?tab=signin">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto flex items-center space-x-2">
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
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
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Continue as guest (limited features)
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
