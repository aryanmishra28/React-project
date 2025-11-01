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

  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Extract text from file (basic implementation)
  const extractTextFromFile = async (file) => {
    // For text files, use .text()
    if (file.type === 'text/plain') {
      return await file.text();
    }
    
    // For PDF, DOC, DOCX - we'd need a library like pdf-parse or mammoth
    // For now, show an error message for unsupported formats
    if (file.type === 'application/pdf' || 
        file.name.endsWith('.pdf') ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx')) {
      throw new Error('PDF and DOC files require additional parsing. Please copy and paste your resume text, or convert to .txt file.');
    }
    
    // Try to read as text (might work for some formats)
    try {
      return await file.text();
    } catch (err) {
      throw new Error('Unable to read file. Please ensure it\'s a text file or copy the resume content.');
    }
  };

  const analyzeResume = async () => {
    if (!selectedFile || !user) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Extract text from file
      const resumeText = await extractTextFromFile(selectedFile);
      
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('The file appears to be empty. Please upload a file with resume content.');
      }

      // Call the API
      const res = await fetch('http://localhost:5000/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to analyze resume');
      }

      // Handle response - could be structured or raw
      if (typeof data.feedback === 'string') {
        // If raw text string, display it in a simple format
        setAnalysisData({
          score: 50,
          strengths: [{ title: 'AI Feedback', description: data.feedback }],
          weaknesses: [],
          suggestions: data.feedback
        });
      } else if (data.feedback && data.feedback.raw) {
        // If marked as raw object
        setAnalysisData({
          score: 50,
          strengths: [{ title: 'AI Feedback', description: String(data.feedback) }],
          weaknesses: [],
          suggestions: String(data.feedback)
        });
      } else {
        // Structured response with score, strengths, weaknesses
        setAnalysisData(data.feedback);
      }
    } catch (err) {
      console.error('Resume analysis error:', err);
      setError(err.message || 'Failed to analyze resume. Please try again.');
      setAnalysisData(null);
    } finally {
      setIsAnalyzing(false);
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
                    accept=".txt,.text"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700">
                      {selectedFile ? selectedFile.name : 'Drop your resume here'}
                    </p>
                    <p className="text-sm text-gray-500">Text files (.txt) supported</p>
                    <p className="text-xs text-gray-400 mt-1">For PDF/DOC files, copy content to a .txt file</p>
                  </label>
                </div>
                
                <Button 
                  onClick={analyzeResume}
                  disabled={!selectedFile || !user || isAnalyzing}
                  className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] text-white py-3 rounded-xl disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                </Button>
                {!user && (
                  <p className="text-sm text-center text-gray-500">Sign in to analyze your resume</p>
                )}
                {error && (
                  <p className="text-sm text-center text-red-600 mt-2">{error}</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {!analysisData && user && !isAnalyzing && (
              <Card className="shadow-lg rounded-2xl">
                <CardContent className="p-12 text-center">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Upload Your Resume</h3>
                  <p className="text-gray-600">Get AI-powered insights and recommendations</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Note: For best results, upload a .txt file or copy your resume content into a text file.
                  </p>
                </CardContent>
              </Card>
            )}

            {isAnalyzing && (
              <Card className="shadow-lg rounded-2xl">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-[#6A0DAD] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Analyzing Resume...</h3>
                  <p className="text-gray-600">Our AI is reviewing your resume. This may take a moment.</p>
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
                      {analysisData.score >= 80 && (
                        <>Your resume is <span className="font-semibold text-green-600">excellent</span>. Keep up the great work!</>
                      )}
                      {analysisData.score >= 60 && analysisData.score < 80 && (
                        <>Your resume is <span className="font-semibold text-purple-600">good</span>. Follow our suggestions to improve further.</>
                      )}
                      {analysisData.score < 60 && (
                        <>Your resume needs <span className="font-semibold text-orange-600">improvement</span>. Review our suggestions below.</>
                      )}
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
                      {analysisData.strengths && analysisData.strengths.length > 0 ? (
                        analysisData.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{strength.title || 'Strength'}</p>
                              <p className="text-sm text-gray-600">{strength.description || strength}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No strengths identified yet.</p>
                      )}
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
                      {analysisData.weaknesses && analysisData.weaknesses.length > 0 ? (
                        analysisData.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <AlertCircle className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{weakness.title || 'Improvement Area'}</p>
                              <p className="text-sm text-gray-600">{weakness.description || weakness}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">Great! No major areas need improvement.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {analysisData.suggestions && (
                  <Card className="shadow-lg rounded-2xl">
                    <CardHeader>
                      <CardTitle>Overall Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-line">{analysisData.suggestions}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}