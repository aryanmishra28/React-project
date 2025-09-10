import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { useAuth } from "./AuthContext";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

export function ResumeAnalyzer() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [analysisData, setAnalysisData] = React.useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // replace analyzeResume in Frontend/src/components/ResumeAnalyzer.tsx
const analyzeResume = async () => {
  if (!selectedFile || !user) return;

  const text = await selectedFile.text(); // basic approach
  const res = await fetch('http://localhost:5000/api/resume/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText: text }),
  });
  const data = await res.json();
  if (data.success) {
    setAnalysisData(parseFromText(data.feedback)); // or show feedback text directly
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Resume Analyzer</h1>
          <p className="text-xl text-gray-600">
            Get AI-powered insights to improve your resume
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  <span>Upload Resume</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700">
                      {selectedFile ? selectedFile.name : 'Drop your resume here'}
                    </p>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX supported</p>
                  </label>
                </div>
                
                <Button 
                  onClick={analyzeResume}
                  disabled={!selectedFile || !user}
                  className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] text-white py-3 rounded-xl"
                >
                  Analyze Resume
                </Button>
                {!user && (
                  <p className="text-sm text-center text-gray-500">Sign in to analyze your resume</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {!analysisData && user && (
              <Card className="shadow-lg rounded-2xl">
                <CardContent className="p-12 text-center">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Upload Your Resume</h3>
                  <p className="text-gray-600">Get AI-powered insights and recommendations</p>
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card className="shadow-lg rounded-2xl">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Sign In to Get Started</h3>
                  <p className="text-gray-600">Create an account to analyze your resume</p>
                </CardContent>
              </Card>
            )}

            {analysisData && (
              <>
                <Card className="shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Overall Score</span>
                      <div className="text-3xl font-bold text-purple-600">{analysisData.score}/100</div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={analysisData.score} className="h-3 mb-4" />
                    <p className="text-gray-600">
                      Your resume is <span className="font-semibold text-purple-600">above average</span>. 
                      Follow our suggestions to improve further.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="shadow-lg rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Strengths</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {analysisData.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{strength.title}</p>
                            <p className="text-sm text-gray-600">{strength.description}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-orange-700 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>Areas to Improve</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {analysisData.weaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{weakness.title}</p>
                            <p className="text-sm text-gray-600">{weakness.description}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}