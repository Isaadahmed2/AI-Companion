from typing import List, Dict, Any, Optional
import uuid

class RecommendationService:
    def __init__(self):
        self.catalog = [
            # Music
            {
                "id": str(uuid.uuid4()),
                "category": "music",
                "title": "Lo-Fi Beats for Peaceful Focus",
                "description": "Chill lofi study and relaxation instrumentals to ease the mind.",
                "content_url": "https://www.youtube.com/watch?v=jfKfPfyJRdk",
                "target_emotions": ["anxiety", "sadness", "neutral", "calm"],
                "score": 0.95
            },
            {
                "id": str(uuid.uuid4()),
                "category": "music",
                "title": "Uplifting Acoustic Sunshine",
                "description": "Bright guitar and cheerful melodies to brighten your mood.",
                "content_url": "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0",
                "target_emotions": ["joy", "neutral", "sadness"],
                "score": 0.90
            },
            {
                "id": str(uuid.uuid4()),
                "category": "music",
                "title": "Forest Rainfall & Nature Ambient",
                "description": "Gentle woodland rain to calm thoughts and reduce sensory overload.",
                "content_url": "https://www.youtube.com/watch?v=mPZkdNFkNps",
                "target_emotions": ["anxiety", "anger", "calm"],
                "score": 0.92
            },
            # Games & Activities
            {
                "id": str(uuid.uuid4()),
                "category": "game",
                "title": "Mindful Zen Puzzle",
                "description": "A soothing, pressure-free color gradient puzzle.",
                "content_url": "#puzzle",
                "target_emotions": ["anxiety", "neutral", "sadness"],
                "score": 0.88
            },
            {
                "id": str(uuid.uuid4()),
                "category": "game",
                "title": "Word Sparks Challenge",
                "description": "Engaging word association and anagrams to stimulate focus.",
                "content_url": "#wordgame",
                "target_emotions": ["joy", "neutral", "calm"],
                "score": 0.85
            },
            # Comedy & Entertainment
            {
                "id": str(uuid.uuid4()),
                "category": "comedy",
                "title": "Wholesome Pet Antics & Funny Reels",
                "description": "Guaranteed smile-inducing moments with playful dogs and cats.",
                "content_url": "#comedy",
                "target_emotions": ["sadness", "neutral", "anger"],
                "score": 0.94
            },
            # Motivation & Inspiration
            {
                "id": str(uuid.uuid4()),
                "category": "motivation",
                "title": "5-Minute Guided Grounding Meditation",
                "description": "Box breathing and body scan technique for inner equilibrium.",
                "content_url": "#meditation",
                "target_emotions": ["anxiety", "anger", "sadness"],
                "score": 0.96
            },
            {
                "id": str(uuid.uuid4()),
                "category": "motivation",
                "title": "Daily Micro-Affirmations",
                "description": "Gentle reminders that you are capable, worthy, and resilient.",
                "content_url": "#affirmations",
                "target_emotions": ["sadness", "neutral", "joy", "anxiety"],
                "score": 0.89
            },
            # Social Connection
            {
                "id": str(uuid.uuid4()),
                "category": "social",
                "title": "Mindfulness & Gratitude Circle",
                "description": "Connect with supportive peers sharing positive daily moments.",
                "content_url": "#social",
                "target_emotions": ["neutral", "joy", "calm"],
                "score": 0.87
            }
        ]

    async def generate_recommendations(
        self,
        user_id: str,
        emotion: str,
        topics: Optional[List[str]] = None,
        limit: int = 4
    ) -> List[Dict[str, Any]]:
        """Filter and rank recommendations based on emotion and topics"""
        emotion_clean = emotion.lower()
        scored_items = []

        for item in self.catalog:
            score = item.get("score", 0.8)
            if emotion_clean in item.get("target_emotions", []):
                score += 0.2
            
            # Add topic match boost
            if topics:
                for topic in topics:
                    if topic.lower() in item.get("title", "").lower() or topic.lower() in item.get("description", "").lower():
                        score += 0.15

            scored_items.append({
                "activity_id": item["id"],
                "category": item["category"],
                "title": item["title"],
                "description": item["description"],
                "content_url": item["content_url"],
                "relevance_score": round(score, 2),
                "reason": f"Recommended to support you when feeling {emotion_clean}."
            })

        # Sort descending by relevance score
        scored_items.sort(key=lambda x: x["relevance_score"], reverse=True)
        return scored_items[:limit]

    def suggest_daily_goals(self, emotion: str, recommendations: List[Dict[str, Any]]) -> List[str]:
        """Suggest 2-3 manageable micro-goals based on emotional state"""
        emotion_clean = emotion.lower()
        if emotion_clean in ["anxiety", "fear", "overwhelmed"]:
            return [
                "Take 5 deep belly breaths when feeling tense",
                "Drink a warm glass of water or herbal tea",
                "Step outside or look at the sky for 3 minutes"
            ]
        elif emotion_clean in ["sadness", "down", "lonely"]:
            return [
                "Listen to 1 soothing song without multitasking",
                "Write down one kind thought to yourself",
                "Stretch gently for 2 minutes"
            ]
        elif emotion_clean in ["joy", "happiness", "excited"]:
            return [
                "Share your positive energy with a friend or colleague",
                "Journal 3 things you are grateful for today",
                "Tackle one creative idea you've been wanting to do"
            ]
        else:
            return [
                "Take a 10-minute restorative walk",
                "Check off one small task on your list",
                "Practice 2 minutes of mindful stillness"
            ]
