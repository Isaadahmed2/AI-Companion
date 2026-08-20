from typing import Dict, List, Any
import logging
import re

logger = logging.getLogger(__name__)

class EmotionDetectionService:
    def __init__(self):
        self.emotion_pipeline = None
        self.sia = None
        self._init_models()

    def _init_models(self):
        """Lazy load HuggingFace model or NLTK if available"""
        try:
            from transformers import pipeline
            self.emotion_pipeline = pipeline(
                "text-classification",
                model="j-hartmann/emotion-english-distilroberta-base",
                device=-1
            )
            logger.info("HuggingFace emotion model initialized.")
        except Exception as e:
            logger.warning(f"Could not load HuggingFace pipeline ({e}). Falling back to rule-based analysis.")

        try:
            import nltk
            from nltk.sentiment import SentimentIntensityAnalyzer
            try:
                self.sia = SentimentIntensityAnalyzer()
            except Exception:
                nltk.download("vader_lexicon", quiet=True)
                self.sia = SentimentIntensityAnalyzer()
        except Exception as e:
            logger.warning(f"NLTK VADER not loaded ({e}). Rule-based sentiment will be used.")

    async def detect_emotion(self, text: str, mood_level: int = 5) -> Dict[str, Any]:
        """
        Detect emotion and intensity from message + mood level.
        Returns: {emotion, confidence, sentiment_scores, intensity}
        """
        if not text or not text.strip():
            # Infer from numerical mood level if text is blank
            return self._infer_from_mood_level(mood_level)

        emotion = "neutral"
        confidence = 0.85
        sentiment_scores = {"compound": 0.0, "pos": 0.0, "neg": 0.0, "neu": 1.0}

        # Try HuggingFace pipeline
        if self.emotion_pipeline:
            try:
                res = self.emotion_pipeline(text)[0]
                emotion = res["label"].lower()
                confidence = float(res["score"])
            except Exception as e:
                logger.warning(f"Pipeline prediction error: {e}")
                emotion = self._rule_based_emotion(text, mood_level)
        else:
            emotion = self._rule_based_emotion(text, mood_level)

        # Try VADER sentiment
        if self.sia:
            try:
                sentiment_scores = self.sia.polarity_scores(text)
            except Exception:
                sentiment_scores = self._rule_based_sentiment(text)
        else:
            sentiment_scores = self._rule_based_sentiment(text)

        intensity = self._calculate_intensity(sentiment_scores.get("compound", 0.0), mood_level)

        return {
            "emotion": emotion,
            "confidence": confidence,
            "sentiment_scores": sentiment_scores,
            "intensity": intensity
        }

    async def extract_topics(self, text: str) -> List[str]:
        """Extract keywords / wellness topics from message"""
        if not text:
            return ["daily checkin"]

        topics_map = {
            "work": ["work", "job", "career", "office", "boss", "deadline", "project", "meeting"],
            "family": ["family", "mom", "dad", "parents", "brother", "sister", "child", "kids"],
            "relationship": ["partner", "boyfriend", "girlfriend", "spouse", "friend", "lonely", "dating"],
            "health": ["sleep", "tired", "headache", "sick", "exercise", "workout", "pain", "fatigue"],
            "study": ["exam", "school", "college", "study", "homework", "grades", "test"],
            "mindset": ["anxious", "stress", "overwhelmed", "hopeful", "calm", "grateful", "peaceful"]
        }

        detected = []
        lower_text = text.lower()
        for category, words in topics_map.items():
            if any(re.search(rf"\b{w}\b", lower_text) for w in words):
                detected.append(category)

        return detected if detected else ["general wellness"]

    def _calculate_intensity(self, compound_score: float, mood_level: int) -> int:
        """Convert compound sentiment score and mood level to intensity (1-5)"""
        # Distance from neutral (5.5)
        dist = abs(mood_level - 5.5)
        if dist >= 3.5 or abs(compound_score) >= 0.6:
            return 5
        elif dist >= 2.5 or abs(compound_score) >= 0.4:
            return 4
        elif dist >= 1.5 or abs(compound_score) >= 0.2:
            return 3
        elif dist >= 0.5:
            return 2
        return 1

    def _infer_from_mood_level(self, mood_level: int) -> Dict[str, Any]:
        if mood_level <= 3:
            return {"emotion": "sadness", "confidence": 0.85, "sentiment_scores": {"compound": -0.6}, "intensity": 4}
        elif mood_level <= 5:
            return {"emotion": "neutral", "confidence": 0.80, "sentiment_scores": {"compound": -0.1}, "intensity": 2}
        elif mood_level <= 7:
            return {"emotion": "calm", "confidence": 0.85, "sentiment_scores": {"compound": 0.3}, "intensity": 3}
        else:
            return {"emotion": "joy", "confidence": 0.95, "sentiment_scores": {"compound": 0.7}, "intensity": 5}

    def _rule_based_emotion(self, text: str, mood_level: int) -> str:
        text_lower = text.lower()
        if any(w in text_lower for w in ["anxious", "worry", "panic", "stressed", "stress", "nervous", "scared", "fear", "overwhelmed", "pressure", "burnout"]):
            return "anxiety"
        if any(w in text_lower for w in ["sad", "depressed", "cry", "crying", "unhappy", "heartbroken", "down", "lonely", "hopeless", "grief"]):
            return "sadness"
        if any(w in text_lower for w in ["angry", "mad", "furious", "annoyed", "irritated", "frustrated", "rage"]):
            return "anger"
        if any(w in text_lower for w in ["happy", "great", "awesome", "excited", "glad", "joy", "wonderful", "love", "cheerful", "blessed"]):
            return "joy"
        if any(w in text_lower for w in ["calm", "peaceful", "relaxed", "serene", "fine", "chill", "content"]):
            return "calm"
        
        if mood_level <= 3:
            return "sadness"
        elif mood_level >= 8:
            return "joy"
        return "neutral"

    def _rule_based_sentiment(self, text: str) -> Dict[str, float]:
        text_lower = text.lower()
        pos_words = ["good", "great", "happy", "love", "awesome", "better", "glad", "calm", "peace"]
        neg_words = ["bad", "sad", "terrible", "lonely", "stress", "anxious", "angry", "hate", "pain", "tired"]
        
        pos_count = sum(1 for w in pos_words if w in text_lower)
        neg_count = sum(1 for w in neg_words if w in text_lower)
        
        total = pos_count + neg_count
        if total == 0:
            return {"compound": 0.0, "pos": 0.0, "neg": 0.0, "neu": 1.0}
        compound = (pos_count - neg_count) / total
        return {"compound": round(compound, 2), "pos": pos_count / total, "neg": neg_count / total, "neu": 0.0}
