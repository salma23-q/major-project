
import { ProfileData, ShapValue, AnalysisResult } from '../types';

/**
 * Simulates an XGBoost model prediction by calculating weights for specific features
 * common in fake account detection.
 */
export const analyzeProfile = (data: ProfileData): Omit<AnalysisResult, 'summary'> => {
  let score = 0.3; // Base probability (intercept)
  const shapValues: ShapValue[] = [];

  // 1. Follower/Following Ratio (Bottleneck feature)
  // Real accounts usually have a balanced ratio or more followers.
  const ratio = data.followers / (data.following || 1);
  let ratioEffect = 0;
  if (ratio < 0.05) {
    ratioEffect = 0.25; // High signal for bots
  } else if (ratio > 2) {
    ratioEffect = -0.15; // Signal for real/influencer
  }
  score += ratioEffect;
  shapValues.push({ feature: 'followers', label: 'Follower Ratio', value: ratioEffect });

  // 2. Digit Ratio in Username
  // Bots often have random strings like "user12345678"
  let digitEffect = data.digitRatio > 0.3 ? 0.2 : -0.1;
  score += digitEffect;
  shapValues.push({ feature: 'digitRatio', label: 'Username Digits', value: digitEffect });

  // 3. Activity (Posts)
  // Low posts + high following = suspicious
  let activityEffect = data.posts < 5 ? 0.15 : -0.1;
  score += activityEffect;
  shapValues.push({ feature: 'posts', label: 'Post Count', value: activityEffect });

  // 4. Metadata (Avatar & Bio)
  let metadataEffect = 0;
  if (!data.hasAvatar) metadataEffect += 0.2;
  if (data.bioLength < 5) metadataEffect += 0.1;
  if (data.bioLength > 20) metadataEffect -= 0.05;
  score += metadataEffect;
  shapValues.push({ feature: 'bioLength', label: 'Profile Metadata', value: metadataEffect });

  // 5. Account Age
  let ageEffect = data.accountAgeDays < 30 ? 0.15 : -0.1;
  score += ageEffect;
  shapValues.push({ feature: 'accountAgeDays', label: 'Account Age', value: ageEffect });

  // Clamp probability
  const probability = Math.max(0, Math.min(0.99, score));
  
  return {
    isFake: probability > 0.6,
    probability,
    shapValues: shapValues.sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
  };
};
