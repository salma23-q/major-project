
import React from 'react';
import { ProfileData } from '../types';

interface ProfileFormProps {
  data: ProfileData;
  onChange: (newData: ProfileData) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ data, onChange, onAnalyze, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...data,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    });
  };

  const InputGroup = ({ label, name, type = "number", step = "1", min = "0", max = "1000000" }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        name={name}
        value={(data as any)[name]}
        onChange={handleChange}
        step={step}
        min={min}
        max={max}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-800">Profile Metadata</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Username Handle</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-400">@</span>
            <input
              type="text"
              name="username"
              value={data.username}
              onChange={handleChange}
              placeholder="e.g. crypto_bot_99"
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <InputGroup label="Followers" name="followers" />
        <InputGroup label="Following" name="following" />
        <InputGroup label="Total Posts" name="posts" />
        <InputGroup label="Bio Length (chars)" name="bioLength" max="250" />
        <InputGroup label="Account Age (Days)" name="accountAgeDays" />
        <InputGroup label="Username Digit Ratio (0-1)" name="digitRatio" type="number" step="0.1" min="0" max="1" />

        <div className="flex items-center gap-4 mt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              name="hasAvatar" 
              checked={data.hasAvatar} 
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Has Profile Pic</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              name="isPrivate" 
              checked={data.isPrivate} 
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Private Account</span>
          </label>
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Running XGBoost + SHAP...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.357 11.357 0 00-1.573 7.411c.59 3.72 3.329 7.72 10.191 10.305a1.164 1.164 0 00.956 0c6.862-2.585 9.601-6.585 10.191-10.305a1.135 1.135 0 00-1.573-7.411z" />
            </svg>
            Analyze Account
          </>
        )}
      </button>
    </div>
  );
};

export default ProfileForm;
