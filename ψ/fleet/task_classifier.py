#!/usr/bin/env python3
"""
Task Complexity Classifier for Oracle-Specific Routing

Scores tasks 1-10 based on:
- Task category (base complexity)
- Oracle role (specialty boost/penalty)
- Novelty indicators (keywords)
- Stakes indicators (risk level)
- Domain fit (specialty match)
- Historical similarity (past tasks)

Output: complexity_score, recommendation (HAIKU/SONNET/PAIR), confidence
"""

import re
from dataclasses import dataclass
from typing import List, Optional, Dict
from enum import Enum


class Recommendation(str, Enum):
    """Routing recommendation"""
    HAIKU = "HAIKU"
    SONNET = "SONNET"
    PAIR = "PAIR"


@dataclass
class TaskInput:
    """Input task to classify"""
    description: str
    oracle_role: str
    category: str
    historical_tasks: List = None
    novelty_indicators: List = None
    stakes_indicators: List = None
    domain_fit: float = 0.5  # 0-1


@dataclass
class ClassificationResult:
    """Classification result"""
    complexity_score: float
    recommendation: Recommendation
    confidence: float
    reasoning: str


class TaskClassifier:
    """Classifies tasks by complexity for routing decisions"""

    # Base complexity by category (1-10)
    CATEGORY_BASE_COMPLEXITY = {
        # Routable (Haiku-friendly)
        "ui_design": 3.0,
        "ui_ux": 3.0,
        "analysis": 3.0,
        "analytics": 3.0,
        "documentation": 2.0,
        "operations": 2.0,
        "simple_code": 3.0,
        "refactoring": 3.0,
        "bug_fix": 2.5,

        # Non-routable (Sonnet-required)
        "governance": 8.0,
        "novel_solution": 8.0,
        "architecture": 7.5,
        "integration": 7.0,
        "security_review": 7.0,
        "performance_optimization": 6.5,

        # Unknown defaults to middle
        "unknown": 5.0,
    }

    # Oracle role complexity modifiers
    ORACLE_ROLE_MODIFIER = {
        "tham": +1.5,      # Governance (handles harder tasks)
        "stratum": +1.0,   # Architecture
        "verity": +1.0,    # Verification
        "dheva": +0.5,     # ERP
        "luxi": -0.5,      # UI (lower baseline)
        "lens": -0.5,      # Analytics (lower baseline)
        "omega": -1.0,     # Operations (lower baseline)
        "aris": +0.5,      # Code review
        "warden": -0.5,    # Access control
        "teleos": +0.0,    # Deploy (neutral)
    }

    # Novelty keywords and their impact
    NOVELTY_KEYWORDS = {
        "new": 1.5,
        "first": 1.5,
        "never": 1.5,
        "design": 1.0,
        "invent": 2.0,
        "create": 1.0,
        "rethink": 1.5,
        "redesign": 1.0,
        "novel": 2.0,
        "unprecedented": 2.0,
        "experimental": 1.5,
    }

    # Stakes keywords and their impact
    STAKES_KEYWORDS = {
        "critical": 1.5,
        "security": 1.5,
        "compliance": 1.5,
        "fleet-wide": 1.5,
        "governance": 1.0,
        "architecture": 1.0,
        "essential": 1.0,
        "breaking": 1.0,
        "urgent": 0.5,
        "important": 0.5,
    }

    # Thresholds for routing decision
    HAIKU_THRESHOLD = 5.0
    SONNET_THRESHOLD = 7.0

    def __init__(self, verbose: bool = False):
        self.verbose = verbose

    def classify(self, task: TaskInput) -> ClassificationResult:
        """Classify a task and return routing recommendation"""

        # Start with base complexity
        complexity_score = self._get_base_complexity(task.category)

        # Apply oracle role modifier
        role_modifier = self.ORACLE_ROLE_MODIFIER.get(
            task.oracle_role.lower(), 0.0
        )
        complexity_score += role_modifier

        # Add novelty signals
        novelty_score = self._calculate_novelty(task.description)
        complexity_score += novelty_score

        # Add stakes signals
        stakes_score = self._calculate_stakes(task.description)
        complexity_score += stakes_score

        # Adjust for historical similarity
        if task.historical_tasks:
            history_adjustment = self._calculate_history_adjustment(
                task.description,
                task.historical_tasks
            )
            complexity_score = (complexity_score * 0.2) + (history_adjustment * 0.8)

        # Adjust for domain fit
        domain_adjustment = self._calculate_domain_adjustment(
            task.category,
            task.oracle_role,
            task.domain_fit
        )
        complexity_score += domain_adjustment

        # Clamp to 1-10 range
        complexity_score = max(1.0, min(10.0, complexity_score))

        # Make recommendation and assess confidence
        recommendation, confidence = self._make_recommendation(complexity_score)

        # Generate reasoning
        reasoning = self._generate_reasoning(
            task, complexity_score, recommendation, confidence,
            role_modifier, novelty_score, stakes_score
        )

        return ClassificationResult(
            complexity_score=round(complexity_score, 1),
            recommendation=recommendation,
            confidence=confidence,
            reasoning=reasoning
        )

    def _get_base_complexity(self, category: str) -> float:
        """Get base complexity for category"""
        normalized_category = category.lower().replace(" ", "_")
        return self.CATEGORY_BASE_COMPLEXITY.get(
            normalized_category,
            self.CATEGORY_BASE_COMPLEXITY["unknown"]
        )

    def _calculate_novelty(self, description: str) -> float:
        """Calculate novelty impact from keywords"""
        score = 0.0
        desc_lower = description.lower()

        for keyword, impact in self.NOVELTY_KEYWORDS.items():
            if re.search(r'\b' + keyword + r'\b', desc_lower):
                score += impact

        return score

    def _calculate_stakes(self, description: str) -> float:
        """Calculate stakes impact from keywords"""
        score = 0.0
        desc_lower = description.lower()

        for keyword, impact in self.STAKES_KEYWORDS.items():
            if re.search(r'\b' + keyword + r'\b', desc_lower):
                score += impact

        return score

    def _calculate_history_adjustment(
        self,
        description: str,
        historical_tasks: List
    ) -> float:
        """Adjust based on similar historical tasks"""
        if not historical_tasks:
            return 5.0  # Neutral

        # Simple similarity: matching keywords
        desc_words = set(description.lower().split())
        similarities = []

        for hist_task in historical_tasks:
            hist_words = set(hist_task.get("description", "").lower().split())
            overlap = len(desc_words & hist_words)
            if overlap > 0:
                similarities.append((overlap, hist_task.get("complexity", 5.0)))

        if similarities:
            # Weight by overlap count
            total_overlap = sum(s[0] for s in similarities)
            weighted_complexity = sum(
                (s[0] / total_overlap) * s[1] for s in similarities
            )
            return weighted_complexity

        return 5.0  # Neutral if no matches

    def _calculate_domain_adjustment(
        self,
        category: str,
        oracle_role: str,
        domain_fit: float
    ) -> float:
        """Adjust based on how well task matches oracle's specialty"""
        if domain_fit > 0.8:
            return -1.5  # Reduce complexity (oracle is expert)
        elif domain_fit > 0.6:
            return -0.5
        elif domain_fit < 0.3:
            return +2.0  # Increase complexity (oracle is novice)
        else:
            return 0.0  # Neutral fit

    def _make_recommendation(self, complexity_score: float) -> tuple:
        """Make routing recommendation based on complexity score"""
        if complexity_score <= self.HAIKU_THRESHOLD:
            return Recommendation.HAIKU, 0.95
        elif complexity_score >= self.SONNET_THRESHOLD:
            return Recommendation.SONNET, 0.92
        else:
            # Edge case (5-7): examine stakes + novelty more carefully
            return Recommendation.PAIR, 0.70

    def _generate_reasoning(
        self,
        task: TaskInput,
        complexity_score: float,
        recommendation: Recommendation,
        confidence: float,
        role_modifier: float,
        novelty_score: float,
        stakes_score: float
    ) -> str:
        """Generate human-readable reasoning for classification"""
        return f"""
Classification: {recommendation.value} (confidence: {confidence:.0%})
Complexity Score: {complexity_score}/10

Factors:
  Category: {task.category} (base complexity from category)
  Oracle: {task.oracle_role} (modifier: {role_modifier:+.1f})
  Novelty signals: +{novelty_score:.1f} (new/novel keywords)
  Stakes signals: +{stakes_score:.1f} (critical/security keywords)
  Domain fit: {task.domain_fit:.2f} (how well task matches oracle specialty)

Recommendation Logic:
  {complexity_score:.1f} <= 5.0 → HAIKU (cost-effective, oracle's expertise)
  5.0 < {complexity_score:.1f} < 7.0 → PAIR (asymmetric collaboration)
  {complexity_score:.1f} >= 7.0 → SONNET (deep reasoning required)

Use Case: {self._describe_use_case(complexity_score, task.category)}
""".strip()

    def _describe_use_case(self, complexity_score: float, category: str) -> str:
        """Describe the use case for this classification"""
        if complexity_score <= 3:
            return "Simple, routine task within oracle's core expertise"
        elif complexity_score <= 5:
            return "Standard task, good Haiku candidate"
        elif complexity_score <= 7:
            return "Complex task, may benefit from two-oracle collaboration"
        else:
            return "Deep reasoning required, Sonnet specialty"


# ==================== TESTING & EXAMPLES ====================

def test_classifier():
    """Run example classifications"""
    classifier = TaskClassifier(verbose=True)

    # Example 1: Simple UI task (should → HAIKU)
    task1 = TaskInput(
        description="Design dashboard card layout for metrics display",
        oracle_role="luxi",
        category="ui_design",
        domain_fit=0.95
    )
    result1 = classifier.classify(task1)
    print("=" * 60)
    print("EXAMPLE 1: Simple UI Task")
    print("=" * 60)
    print(f"Complexity: {result1.complexity_score}/10")
    print(f"Recommendation: {result1.recommendation.value}")
    print(f"Confidence: {result1.confidence:.0%}")
    print(f"\n{result1.reasoning}")

    # Example 2: Novel governance decision (should → SONNET)
    task2 = TaskInput(
        description="Design new oracle role hierarchy for fleet scaling (critical, novel approach)",
        oracle_role="tham",
        category="governance",
        domain_fit=0.9
    )
    result2 = classifier.classify(task2)
    print("\n" + "=" * 60)
    print("EXAMPLE 2: Novel Governance Decision")
    print("=" * 60)
    print(f"Complexity: {result2.complexity_score}/10")
    print(f"Recommendation: {result2.recommendation.value}")
    print(f"Confidence: {result2.confidence:.0%}")
    print(f"\n{result2.reasoning}")

    # Example 3: Edge case (should → PAIR)
    task3 = TaskInput(
        description="Refactor fleet memory architecture for better performance (critical)",
        oracle_role="stratum",
        category="architecture",
        domain_fit=0.7
    )
    result3 = classifier.classify(task3)
    print("\n" + "=" * 60)
    print("EXAMPLE 3: Edge Case (Complexity 5-7)")
    print("=" * 60)
    print(f"Complexity: {result3.complexity_score}/10")
    print(f"Recommendation: {result3.recommendation.value}")
    print(f"Confidence: {result3.confidence:.0%}")
    print(f"\n{result3.reasoning}")


if __name__ == "__main__":
    test_classifier()
