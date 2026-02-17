
import React, { useState, useCallback } from 'react';
import { ProfileData, AnalysisResult } from './types';
import { analyzeProfile } from './services/classifier';
import { getAiSummary } from './services/geminiService';
import ProfileForm from './components/ProfileForm';
import ShapVisualizer from './components/ShapVisualizer';

const App: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    username: 'user_9921_bot',
    followers: 12,
    following: 2400,
    posts: 2,
    bioLength: 0,
    hasAvatar: false,
    isPrivate: false,
    digitRatio: 0.45,
    accountAgeDays: 5,
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    // 1. Simulate XGBoost Prediction
    const classification = analyzeProfile(profileData);
    
    // 2. Get AI Summary from Gemini
    const summary = await getAiSummary(profileData, classification);
    
    setResult({
      ...classification,
      summary
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">GuardLens</h1>
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-widest">Profile Integrity Engine</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm font-medium text-slate-600 px-3 py-1 bg-slate-100 rounded-full">v1.2 XGBoost Beta</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5">
            <ProfileForm 
              data={profileData} 
              onChange={setProfileData} 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            {!result && !isLoading && (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-700">Awaiting Profile Analysis</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-1">Input profile metadata on the left to start the dynamic classification process.</p>
              </div>
            )}

            {(result || isLoading) && (
              <div className={`space-y-6 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                
                {/* Score Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detection Confidence</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-slate-800">
                          {result ? Math.round(result.probability * 100) : '--'}%
                        </span>
                        <span className="text-sm font-semibold text-slate-500">Probability of Fake</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border-2 ${
                        result?.isFake 
                          ? 'bg-red-50 border-red-100 text-red-700' 
                          : 'bg-green-50 border-green-100 text-green-700'
                      }`}>
                        <div className={`w-3 h-3 rounded-full animate-pulse ${result?.isFake ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="text-lg font-bold tracking-tight">
                          {result?.isFake ? 'Potential Fake' : 'Likely Genuine'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meter */}
                  <div className="mt-8">
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${result?.isFake ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-green-500'}`}
                        style={{ width: `${result ? result.probability * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 px-1">
                      <span className="text-[10px] font-bold text-slate-400">GENUINE</span>
                      <span className="text-[10px] font-bold text-slate-400">SUSPICIOUS</span>
                    </div>
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-90">Gemini AI Interpretation</h3>
                  </div>
                  <p className="text-lg leading-relaxed font-medium">
                    {result?.summary || 'Generating real-time explanation...'}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                    <div className="text-[10px] bg-white/10 px-2 py-1 rounded">XGBoost-1.5</div>
                    <div className="text-[10px] bg-white/10 px-2 py-1 rounded">SHAP-Explainable</div>
                  </div>
                </div>

                {/* SHAP Plot */}
                {result && <ShapVisualizer data={result.shapValues} />}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Info Footer */}
      <footer className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-slate-800 text-slate-400 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="text-white font-semibold mb-3">How it works</h4>
            <p className="leading-relaxed opacity-80">
              GuardLens uses a custom XGBoost ensemble model trained on metadata patterns. It doesn't just give a score; it calculates 
              <span className="text-blue-400 mx-1">SHAP values</span> to show which specific profile traits contributed most to the final decision.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Key Indicators</h4>
            <ul className="space-y-2 opacity-80 list-disc pl-4">
              <li>Follower/Following ratio imbalance</li>
              <li>High digit density in usernames</li>
              <li>Empty bios and placeholder images</li>
              <li>Sudden spikes in account creation age</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Privacy & Ethics</h4>
            <p className="leading-relaxed opacity-80">
              This tool provides probabilistic estimates for informational purposes. Final verification should always involve human oversight to prevent false positives in security workflows.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
