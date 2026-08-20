export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  language_preference?: string;
  interests?: string[];
  onboarding_completed?: boolean;
  created_at?: string;
}

export interface MoodLog {
  id: string;
  user_id?: string;
  mood_level: number;
  emotion: string;
  intensity?: number;
  message?: string;
  detected_topics?: string[];
  detected_sentiment?: Record<string, any>;
  voice_input?: boolean;
  created_at: string;
}

export interface RecommendationItem {
  activity_id: string;
  category: 'music' | 'game' | 'comedy' | 'motivation' | 'social' | 'goals' | string;
  title: string;
  description: string;
  content_url: string;
  relevance_score?: number;
  reason?: string;
}

export interface MoodCheckinResult {
  mood_log_id: string;
  user_id: string;
  mood_level: number;
  detected_emotion: string;
  intensity: number;
  confidence: number;
  detected_topics: string[];
  ai_response: string;
  recommendations: RecommendationItem[];
  goal_suggestions: string[];
  created_at: string;
}

export interface Activity {
  id: string;
  category: string;
  title: string;
  description: string;
  content_url?: string;
  active: boolean;
}

export interface DailyGoal {
  id: string;
  goal_text: string;
  category?: string;
  completed: boolean;
}
