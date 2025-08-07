"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/hooks/useAuth';
import { API_ENDPOINTS } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  FileText, 
  Camera, 
  Bot, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  X,
  Loader2,
  Pill
} from 'lucide-react';
import Image from 'next/image';
import { AuthGuard } from '@/components/AuthGuard';
import Navbar from '@/components/navbar';

interface PrescriptionAnalysis {
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  doctorName: string;
  hospitalName: string;
  patientName: string;
  date: string;
  diagnosis: string;
  precautions: string[];
  followUp: string;
  additionalNotes: string;
}

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PrescriptionAnalysis | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzePrescrip = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one prescription file');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setError('');

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Convert files to base64
      const fileData = await Promise.all(
        uploadedFiles.map(async (file) => {
          const base64 = await fileToBase64(file);
          return {
            name: file.name,
            type: file.type,
            data: base64
          };
        })
      );

      // Call your existing backend API
      const response = await fetch(API_ENDPOINTS.ANALYZE_PRESCRIPTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: fileData,
          userId: user?.uid || 'anonymous'
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error('Failed to analyze prescription');
      }

      const result = await response.json();
      setAnalysis(result.analysis);

    } catch (err: any) {
      setError(err.message || 'Failed to analyze prescription');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  };

  const handlePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  return (
    <AuthGuard>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Pill className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">ArogyaScript AI</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Upload your prescription images and get detailed AI-powered analysis including medication details, 
              dosage instructions, and health recommendations powered by Gemini 1.5-flash.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Prescription
                </CardTitle>
                <CardDescription>
                  Drag and drop prescription images or PDFs here, or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center space-y-2">
                    {isDragActive ? (
                      <Upload className="h-8 w-8 text-blue-500" />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                    <p className="text-sm text-gray-600">
                      {isDragActive 
                        ? 'Drop the files here...' 
                        : 'Drag & drop prescription files here, or click to select'
                      }
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: JPG, PNG, PDF (max 10MB each, up to 5 files)
                    </p>
                  </div>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {(file.size / 1024 / 1024).toFixed(1)}MB
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          {file.type.startsWith('image/') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePreview(file)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Progress Bar */}
                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Analyzing prescription...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                {/* Analyze Button */}
                <Button 
                  onClick={analyzePrescrip}
                  disabled={uploadedFiles.length === 0 || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  AI Analysis Results
                </CardTitle>
                <CardDescription>
                  Detailed prescription analysis powered by Gemini 1.5-flash
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!analysis ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Upload and analyze a prescription to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-gray-700">Patient:</label>
                        <p className="text-gray-900">{analysis.patientName || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">Date:</label>
                        <p className="text-gray-900">{analysis.date || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">Doctor:</label>
                        <p className="text-gray-900">{analysis.doctorName || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">Hospital:</label>
                        <p className="text-gray-900">{analysis.hospitalName || 'Not specified'}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Diagnosis */}
                    {analysis.diagnosis && (
                      <div>
                        <h4 className="font-medium mb-2">Diagnosis</h4>
                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">{analysis.diagnosis}</p>
                      </div>
                    )}

                    {/* Medications */}
                    <div>
                      <h4 className="font-medium mb-3">Prescribed Medications</h4>
                      <div className="space-y-3">
                        {analysis.medications?.map((med, index) => (
                          <div key={index} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-blue-600">{med.name}</h5>
                              <Badge variant="outline">{med.dosage}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div>
                                <span className="font-medium">Frequency:</span> {med.frequency}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span> {med.duration}
                              </div>
                            </div>
                            {med.instructions && (
                              <p className="text-xs text-gray-700 mt-2 italic">{med.instructions}</p>
                            )}
                          </div>
                        )) || <p className="text-gray-500">No medications detected</p>}
                      </div>
                    </div>

                    {/* Precautions */}
                    {analysis.precautions && analysis.precautions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Precautions</h4>
                        <ul className="space-y-1">
                          {analysis.precautions.map((precaution, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <AlertCircle className="h-3 w-3 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                              {precaution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Follow-up */}
                    {analysis.followUp && (
                      <div>
                        <h4 className="font-medium mb-2">Follow-up Instructions</h4>
                        <div className="flex items-start text-sm bg-green-50 p-3 rounded">
                          <Clock className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {analysis.followUp}
                        </div>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {analysis.additionalNotes && (
                      <div>
                        <h4 className="font-medium mb-2">Additional Notes</h4>
                        <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded">{analysis.additionalNotes}</p>
                      </div>
                    )}

                    {/* Download/Save Options */}
                    <div className="flex space-x-2 pt-4 border-t">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save to Profile
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Image Preview Modal */}
          {previewImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-medium">Prescription Preview</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setPreviewImage(null);
                      URL.revokeObjectURL(previewImage);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <Image
                    src={previewImage}
                    alt="Prescription preview"
                    width={800}
                    height={600}
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
