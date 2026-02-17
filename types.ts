
export interface ProfileData {
  username: string;
  followers: number;
  following: number;
  posts: number;
  bioLength: number;
  hasAvatar: boolean;
  isPrivate: boolean;
  digitRatio: number; // Percentage of digits in username
  accountAgeDays: number;
}

export interface ShapValue {
  feature: keyof ProfileData;
  label: string;
  value: number; // Contribution to the probability
}

export interface AnalysisResult {
  isFake: boolean;
  probability: number;
  shapValues: ShapValue[];
  summary: string;
}
