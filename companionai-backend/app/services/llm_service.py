import httpx
from typing import Optional, List, Dict
import logging
from app.config import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = settings.DEEPSEEK_API_KEY
        self.api_base = settings.DEEPSEEK_API_BASE
        self.model = settings.DEEPSEEK_MODEL

    async def generate_empathetic_response(
        self,
        user_message: str,
        detected_emotion: str,
        mood_level: int = 5,
        topics: Optional[List[str]] = None,
        mood_history: Optional[List[Dict]] = None
    ) -> str:
        """
        Generate empathetic AI response using DeepSeek LLM with fallback
        """
        system_prompt = self._build_system_prompt(detected_emotion, mood_level, topics)
        
        user_content = user_message if user_message and user_message.strip() else f"I just checked in with a mood level of {mood_level}/10."

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ]

        if mood_history:
            history_summary = "Recent mood history: " + ", ".join(
                [f"Day {i+1}: mood {h.get('mood_level')}/10 ({h.get('emotion')})" for i, h in enumerate(mood_history[-3:])]
            )
            messages.insert(1, {"role": "system", "content": history_summary})

        # Call DeepSeek API if valid key is set
        if self.api_key and self.api_key != "your-deepseek-api-key":
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        f"{self.api_base}/chat/completions",
                        json={
                            "model": self.model,
                            "messages": messages,
                            "temperature": 0.7,
                            "max_tokens": 400,
                        },
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json"
                        }
                    )
                    if response.status_code == 200:
                        result = response.json()
                        return result["choices"][0]["message"]["content"]
                    else:
                        logger.warning(f"DeepSeek API responded with status {response.status_code}: {response.text}")
            except Exception as e:
                logger.error(f"Error calling DeepSeek API: {e}")

        # Fallback empathetic response
        return self._get_fallback_response(detected_emotion, mood_level, user_message)

    def _build_system_prompt(self, emotion: str, mood_level: int, topics: Optional[List[str]]) -> str:
        base_prompt = """You are CompanionAI, an empathetic and compassionate emotional wellness companion.
Your mission:
1. Genuinely validate the user's emotional state without toxic positivity or judgment.
2. Maintain a warm, encouraging, and supportive conversational tone.
3. Keep responses concise (2 to 4 sentences), relatable, and practical.
4. Encourage gentle micro-steps, mindful breathing, or uplifting activities when helpful.
5. If the user indicates extreme distress or crisis, prioritize gentle care and safety."""

        emotion_guidance = {
            "sadness": "The user is experiencing sadness. Acknowledge their vulnerability, let them know they are not alone, and offer a calming presence.",
            "anxiety": "The user feels anxious or overwhelmed. Guide them with a gentle grounding reminder (e.g. slow breath, feeling grounded) and reassurance.",
            "joy": "The user feels happy and energized! Celebrate their win with genuine warmth and encourage them to savor this good feeling.",
            "anger": "The user is frustrated or angry. Validate their boundaries and feelings without judgment, helping them find constructive release.",
            "calm": "The user feels peaceful. Reinforce their state of balance and tranquility.",
            "neutral": "The user is feeling balanced or in-between. Be friendly, open, and invite them to explore whatever is on their mind."
        }

        topics_str = f"Related themes: {', '.join(topics)}." if topics else ""
        guidance = emotion_guidance.get(emotion.lower(), emotion_guidance["neutral"])
        
        return f"{base_prompt}\n\nCurrent user state: Mood Level {mood_level}/10, Emotion: {emotion}. {topics_str}\n{guidance}"

    def _get_fallback_response(self, emotion: str, mood_level: int, user_message: str) -> str:
        emotion_clean = emotion.lower()
        if emotion_clean in ["sadness", "grief"] or mood_level <= 3:
            return "I hear you, and I want you to know that your feelings are completely valid. It is okay to take things slow and give yourself grace today. I'm right here with you."
        elif emotion_clean in ["anxiety", "fear", "nervous"] or (mood_level <= 5 and "stress" in (user_message or "").lower()):
            return "I can sense things might feel a bit overwhelming right now. Take a deep, gentle breath and let your shoulders drop. You don't have to carry it all at once."
        elif emotion_clean in ["joy", "happiness", "excited"] or mood_level >= 8:
            return "It's so wonderful to see you feeling this vibrant! Savor this bright moment and carry that positive spark with you throughout your day."
        elif emotion_clean in ["anger", "frustration"]:
            return "I understand why that feels so frustrating. It's important to honor your feelings—let's take a beat together and find some constructive space to decompress."
        elif emotion_clean in ["calm", "serene"]:
            return "It's great to have these tranquil moments. Embracing this sense of calm is a wonderful way to recharge your mind and body."
        else:
            return "Thank you for checking in with me today. Taking a moment to check in with yourself is a powerful healthy habit. How can I best support you right now?"
