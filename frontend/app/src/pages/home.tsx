import React, { useState, ChangeEvent } from 'react';
import { Upload, ArrowUpCircle, AlertCircle, CheckCircle, Info } from 'lucide-react';
import '../styles/DeepfakeDetection.css';

// Define types for our application
interface AnalysisResult {
  isDeepfake: boolean;
  confidence: number;
  analysisTime: string;
}

const DeepfakeDetectionSystem: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'about'>('home');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.includes('video')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleAnalyze = (): void => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call to analyze video
    setTimeout(() => {
      // Mock result - in a real app, this would come from your backend
      const mockResult: AnalysisResult = {
        isDeepfake: Math.random() > 0.5,
        confidence: Math.floor(70 + Math.random() * 25),
        analysisTime: (Math.random() * 2 + 1).toFixed(1)
      };
      
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <div className="navbar-logo">
              <AlertCircle size={24} />
              <span className="app-title">DeepCheck</span>
            </div>
            <div className="navbar-menu">
              <button 
                className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                Home
              </button>
              <button 
                className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content container">
        {activeTab === 'home' ? (
          <div className="home-content">
            {/* Upload Section */}
            <div className="card upload-section">
              <h2 className="section-title">Upload Video for Analysis</h2>
              
              <div className="upload-container">
                <label className="input-label">Select video file:</label>
                <div 
                  className="upload-dropzone" 
                  onClick={() => document.getElementById('videoInput')?.click()}
                >
                  <Upload className="upload-icon" size={48} />
                  <p className="upload-text">Drag &amp; drop your video here or click to browse</p>
                  <p className="upload-subtext">Supported formats: MP4, AVI, MOV (max 100MB)</p>
                  <input 
                    type="file" 
                    id="videoInput" 
                    accept="video/*" 
                    className="hidden-input" 
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {file && (
                <div className="selected-file">
                  <p className="file-name">Selected file: {file.name}</p>
                  <button 
                    className={`analyze-button ${isAnalyzing ? 'analyzing' : ''}`}
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="spinner"></span>
                        Analyzing Video...
                      </>
                    ) : (
                      <>
                        <ArrowUpCircle className="button-icon" />
                        Analyze Video
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Preview & Results Section */}
            <div className="card results-section">
              <h2 className="section-title">Video Preview & Results</h2>
              
              {preview ? (
                <div className="video-preview">
                  <video 
                    src={preview} 
                    controls 
                    className="preview-player"
                  />
                </div>
              ) : (
                <div className="empty-preview">
                  <p>No video selected for analysis</p>
                </div>
              )}

              {result && (
                <div className={`analysis-result ${result.isDeepfake ? 'deepfake' : 'authentic'}`}>
                  <div className="result-header">
                    {result.isDeepfake ? (
                      <AlertCircle className="result-icon fake" size={24} />
                    ) : (
                      <CheckCircle className="result-icon real" size={24} />
                    )}
                    <h3 className="result-title">
                      {result.isDeepfake ? 'Likely Deepfake' : 'Likely Authentic'}
                    </h3>
                  </div>
                  
                  <div className="confidence-section">
                    <p className="confidence-label">Confidence Score:</p>
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar ${result.isDeepfake ? 'fake' : 'real'}`}
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                    <div className="progress-labels">
                      <span>0%</span>
                      <span>{result.confidence}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <p className="analysis-time">
                    Analysis completed in {result.analysisTime} seconds
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card about-section">
            <h2 className="section-title">About DeepCheck</h2>
            <div className="about-content">
              <p>
                DeepCheck is an advanced deepfake video recognition system designed to help users identify manipulated video content with high accuracy.
              </p>
              <p>
                Our system uses state-of-the-art machine learning algorithms to analyze various aspects of videos, including facial movements, lighting inconsistencies, and digital artifacts that are often present in synthetic media.
              </p>
              <p>
                How it works:
              </p>
              <ol className="steps-list">
                <li>Upload your video file through our secure interface</li>
                <li>Our AI analyzes the video frame-by-frame for signs of manipulation</li>
                <li>Receive a detailed report with confidence scores and analysis</li>
              </ol>
              <div className="info-box">
                <Info className="info-icon" />
                <p>
                  While our system is highly accurate, no deepfake detection technology is perfect. We recommend using DeepCheck as one tool among many for evaluating video authenticity.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 DeepCheck - Deepfake Video Recognition System</p>
        </div>
      </footer>
    </div>
  );
};

export default DeepfakeDetectionSystem;