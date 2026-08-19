from typing import TypedDict, List, Dict, Any, Optional
import logging
from app.services.emotion_service import EmotionDetectionService
from app.services.llm_service import LLMService
from app.services.recommendation_service import RecommendationService

logger = logging.getLogger(__name__)

class CompanionState(TypedDict):
    user_id: str
    user_message: str
    mood_level: int
    detected_emotion: str
    confidence: float
    intensity: int
    detected_topics: List[str]
    sentiment_scores: Dict[str, Any]
    ai_response: str
    recommendations: List[Dict[str, Any]]
    goal_suggestions: List[str]
    next_action: str

class WellnessAgent:
    def __init__(self):
        self.emotion_service = EmotionDetectionService()
        self.llm_service = LLMService()
        self.recommendation_service = RecommendationService()
        self._graph = self._build_workflow()

    def _build_workflow(self):
        """Build LangGraph workflow if available, otherwise use native runner"""
        try:
            from langgraph.graph import StateGraph, END
            workflow = StateGraph(CompanionState)
            
            workflow.add_node("emotion_detection", self.emotion_detection_node)
            workflow.add_node("llm_response", self.llm_response_node)
            workflow.add_node("recommendations", self.recommendation_node)
            workflow.add_node("goal_setting", self.goal_setting_node)
            
            workflow.set_entry_point("emotion_detection")
            workflow.add_edge("emotion_detection", "llm_response")
            workflow.add_edge("llm_response", "recommendations")
            workflow.add_edge("recommendations", "goal_setting")
            workflow.add_edge("goal_setting", END)
            
            return workflow.compile()
        except Exception as e:
            logger.info(f"LangGraph compile info: {e}. Using native sequential pipeline.")
            return None

    async def emotion_detection_node(self, state: CompanionState) -> CompanionState:
        """Detect emotion, topics, and sentiment"""
        emotion_data = await self.emotion_service.detect_emotion(
            state.get("user_message", ""),
            state.get("mood_level", 5)
        )
        topics = await self.emotion_service.extract_topics(state.get("user_message", ""))
        
        state["detected_emotion"] = emotion_data["emotion"]
        state["confidence"] = emotion_data["confidence"]
        state["intensity"] = emotion_data["intensity"]
        state["sentiment_scores"] = emotion_data["sentiment_scores"]
        state["detected_topics"] = topics
        return state

    async def llm_response_node(self, state: CompanionState) -> CompanionState:
        """Generate empathetic AI response"""
        response = await self.llm_service.generate_empathetic_response(
            user_message=state.get("user_message", ""),
            detected_emotion=state["detected_emotion"],
            mood_level=state.get("mood_level", 5),
            topics=state.get("detected_topics", [])
        )
        state["ai_response"] = response
        return state

    async def recommendation_node(self, state: CompanionState) -> CompanionState:
        """Generate personalized wellness recommendations"""
        recommendations = await self.recommendation_service.generate_recommendations(
            user_id=state["user_id"],
            emotion=state["detected_emotion"],
            topics=state.get("detected_topics", [])
        )
        state["recommendations"] = recommendations
        return state

    async def goal_setting_node(self, state: CompanionState) -> CompanionState:
        """Suggest daily micro-goals"""
        goals = self.recommendation_service.suggest_daily_goals(
            emotion=state["detected_emotion"],
            recommendations=state.get("recommendations", [])
        )
        state["goal_suggestions"] = goals
        state["next_action"] = "complete"
        return state

    async def run(self, user_id: str, user_message: str, mood_level: int) -> CompanionState:
        """Run the wellness agent pipeline"""
        initial_state: CompanionState = {
            "user_id": user_id,
            "user_message": user_message or "",
            "mood_level": mood_level,
            "detected_emotion": "",
            "confidence": 0.0,
            "intensity": 3,
            "detected_topics": [],
            "sentiment_scores": {},
            "ai_response": "",
            "recommendations": [],
            "goal_suggestions": [],
            "next_action": "start"
        }

        if self._graph:
            try:
                result = await self._graph.ainvoke(initial_state)
                return result
            except Exception as e:
                logger.warning(f"LangGraph execution exception: {e}. Running fallback sequence.")

        # Native pipeline execution
        state = await self.emotion_detection_node(initial_state)
        state = await self.llm_response_node(state)
        state = await self.recommendation_node(state)
        state = await self.goal_setting_node(state)
        return state

wellness_agent = WellnessAgent()
