#!/usr/bin/env python3
"""
Task Dispatcher - Integrates Classifier + Router + Feedback Loop

Main dispatcher that ธาม uses to route tasks to appropriate oracles.
- Receives incoming task
- Classifies complexity (using classifier)
- Routes to Haiku/Sonnet/Pair
- Logs decision + outcome
- Collects feedback
"""

import json
import logging
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import List, Optional, Dict
from enum import Enum

# Import our implementations (inline to avoid path issues in testing)
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from task_classifier import TaskClassifier, TaskInput, Recommendation
from pool_manager import PoolManager, PoolQuery
from pairing_matcher import PairingMatcher, OracleState, OracleRole


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class DispatchLog:
    """Log of a task dispatch decision"""
    task_id: str
    timestamp: str
    oracle_role: str
    task_description: str
    complexity_score: float
    recommendation: str
    confidence: float
    pool_match: Optional[str] = None  # Pool entry ID if pattern found
    pairing_oracle: Optional[str] = None  # Paired oracle if applicable
    actual_model_used: Optional[str] = None  # What was actually used
    feedback_score: Optional[float] = None  # Oracle's satisfaction (1-10)
    tokens_used: Optional[int] = None


@dataclass
class DispatchRequest:
    """Request to dispatch a task"""
    task_id: str
    oracle_role: str
    task_description: str
    task_category: str
    domain_fit: float = 0.5
    priority: str = "normal"  # urgent, normal, low
    allow_pairing: bool = True


class TaskDispatcher:
    """Main dispatcher that orchestrates routing decisions"""

    def __init__(self, pool_dir: str = "ψ/memory/fleet"):
        self.classifier = TaskClassifier()
        self.pool = PoolManager(pool_dir)
        self.pairing = PairingMatcher()
        self.dispatch_logs: List[DispatchLog] = []
        self.oracle_states: Dict = {}  # Will be populated from fleet state

    def dispatch(
        self,
        request: DispatchRequest,
        oracle_states: Optional[Dict] = None
    ) -> DispatchLog:
        """
        Dispatch a task and return dispatch decision
        """

        if oracle_states:
            self.oracle_states = oracle_states

        # Step 1: Classify task complexity
        task_input = TaskInput(
            description=request.task_description,
            oracle_role=request.oracle_role,
            category=request.task_category,
            domain_fit=request.domain_fit
        )

        classification = self.classifier.classify(task_input)

        # Step 2: Check pool for matching patterns
        pool_match = None
        if classification.recommendation == Recommendation.HAIKU:
            # Haiku-routable tasks may benefit from pool patterns
            query = PoolQuery(
                keywords=request.task_description.split()[:5],
                min_quality=7.0,
                max_results=1
            )
            pool_results = self.pool.query(query)
            if pool_results:
                pool_match = pool_results[0].id
                logger.info(f"Pool pattern found: {pool_match}")

        # Step 3: Check if pairing would help
        pairing_oracle = None
        if request.allow_pairing and classification.recommendation == Recommendation.PAIR:
            pairing_result = self.pairing.find_best_pair(
                request.oracle_role,
                self.oracle_states,
                request.task_category
            )
            if pairing_result and pairing_result.compatibility_score > 0.7:
                pairing_oracle = pairing_result.refiner.value
                logger.info(f"Pairing suggested: {request.oracle_role} + {pairing_oracle}")

        # Step 4: Create dispatch log
        log = DispatchLog(
            task_id=request.task_id,
            timestamp=datetime.now().isoformat(),
            oracle_role=request.oracle_role,
            task_description=request.task_description,
            complexity_score=classification.complexity_score,
            recommendation=classification.recommendation.value,
            confidence=classification.confidence,
            pool_match=pool_match,
            pairing_oracle=pairing_oracle
        )

        self.dispatch_logs.append(log)

        # Step 5: Log the decision
        self._log_dispatch(log, classification)

        return log

    def record_outcome(
        self,
        task_id: str,
        model_used: str,
        tokens_used: int,
        feedback_score: float
    ):
        """Record actual outcome after task execution"""
        for log in self.dispatch_logs:
            if log.task_id == task_id:
                log.actual_model_used = model_used
                log.tokens_used = tokens_used
                log.feedback_score = feedback_score

                # Record pool reuse if applicable
                if log.pool_match:
                    self.pool.record_reuse(log.pool_match)

                logger.info(f"Task {task_id} outcome recorded: {model_used}, {tokens_used} tokens, {feedback_score}/10")
                break

    def get_statistics(self) -> Dict:
        """Get dispatch statistics"""
        if not self.dispatch_logs:
            return {}

        total_tasks = len(self.dispatch_logs)
        haiku_tasks = sum(1 for log in self.dispatch_logs if log.recommendation == "HAIKU")
        sonnet_tasks = sum(1 for log in self.dispatch_logs if log.recommendation == "SONNET")
        pair_tasks = sum(1 for log in self.dispatch_logs if log.recommendation == "PAIR")

        # Tasks with actual outcomes
        completed_tasks = [log for log in self.dispatch_logs if log.tokens_used is not None]
        total_tokens = sum(log.tokens_used for log in completed_tasks)

        # Routing accuracy (did recommendations match actual usage?)
        routing_correct = sum(
            1 for log in completed_tasks
            if self._routing_matches_usage(log)
        )

        avg_feedback = (
            sum(log.feedback_score for log in completed_tasks if log.feedback_score)
            / len(completed_tasks)
            if completed_tasks else 0
        )

        return {
            "total_tasks": total_tasks,
            "recommendations": {
                "haiku": haiku_tasks,
                "sonnet": sonnet_tasks,
                "pair": pair_tasks
            },
            "completion_rate": len(completed_tasks) / total_tasks if total_tasks > 0 else 0,
            "total_tokens_used": total_tokens,
            "avg_tokens_per_task": total_tokens / len(completed_tasks) if completed_tasks else 0,
            "routing_accuracy": routing_correct / len(completed_tasks) if completed_tasks else 0,
            "avg_feedback_score": round(avg_feedback, 1),
            "pool_usage": sum(1 for log in self.dispatch_logs if log.pool_match),
            "pairing_usage": sum(1 for log in self.dispatch_logs if log.pairing_oracle),
        }

    def _routing_matches_usage(self, log: DispatchLog) -> bool:
        """Check if routing recommendation matched actual usage"""
        if not log.actual_model_used:
            return False

        if log.recommendation == "HAIKU" and log.actual_model_used == "haiku":
            return True
        if log.recommendation == "SONNET" and log.actual_model_used == "sonnet":
            return True
        if log.recommendation == "PAIR" and log.pairing_oracle:
            return True

        return False

    def _log_dispatch(self, log: DispatchLog, classification):
        """Log dispatch decision for audit trail"""
        logger.info(f"""
DISPATCH: {log.task_id}
  Oracle: {log.oracle_role}
  Complexity: {log.complexity_score}/10
  Recommendation: {log.recommendation} ({log.confidence:.0%} confidence)
  Pool Match: {log.pool_match or 'None'}
  Pairing: {log.pairing_oracle or 'None'}

Reasoning:
{classification.reasoning}
""")


# ==================== TESTING ====================

def test_dispatcher():
    """Test dispatcher with example tasks"""
    dispatcher = TaskDispatcher()

    # Create mock oracle states
    oracle_states = {
        "luxi": OracleState("luxi", current_load=40),
        "tham": OracleState("tham", current_load=70),
        "stratum": OracleState("stratum", current_load=20),
    }

    print("=" * 60)
    print("DISPATCHER TEST: Multiple Tasks")
    print("=" * 60)

    # Test cases
    test_tasks = [
        DispatchRequest(
            task_id="task-001",
            oracle_role="luxi",
            task_description="Design dashboard card layout for metrics",
            task_category="ui_design",
            domain_fit=0.95
        ),
        DispatchRequest(
            task_id="task-002",
            oracle_role="tham",
            task_description="Design new oracle role hierarchy for fleet scaling (critical)",
            task_category="governance",
            domain_fit=0.9
        ),
        DispatchRequest(
            task_id="task-003",
            oracle_role="stratum",
            task_description="Refactor fleet memory architecture for performance",
            task_category="architecture",
            domain_fit=0.7,
            allow_pairing=True
        ),
    ]

    # Dispatch tasks
    logs = []
    for task in test_tasks:
        print(f"\nDispatching: {task.task_id}")
        log = dispatcher.dispatch(task, oracle_states)
        logs.append(log)
        print(f"  Result: {log.recommendation} (confidence: {log.confidence:.0%})")
        if log.pool_match:
            print(f"  Pool pattern: {log.pool_match}")
        if log.pairing_oracle:
            print(f"  Pairing: {log.pairing_oracle}")

    # Record outcomes
    print("\n" + "=" * 60)
    print("RECORDING OUTCOMES")
    print("=" * 60)

    dispatcher.record_outcome("task-001", "haiku", 450, 9.0)
    dispatcher.record_outcome("task-002", "sonnet", 2100, 8.5)
    dispatcher.record_outcome("task-003", "sonnet", 1800, 8.0)

    # Get statistics
    print("\n" + "=" * 60)
    print("DISPATCHER STATISTICS")
    print("=" * 60)

    stats = dispatcher.get_statistics()
    print(f"Total tasks: {stats['total_tasks']}")
    print(f"Recommendations: {stats['recommendations']}")
    print(f"Completion rate: {stats['completion_rate']:.0%}")
    print(f"Total tokens used: {stats['total_tokens_used']}")
    print(f"Avg tokens/task: {stats['avg_tokens_per_task']:.0f}")
    print(f"Routing accuracy: {stats['routing_accuracy']:.0%}")
    print(f"Avg feedback: {stats['avg_feedback_score']}/10")
    print(f"Pool usage: {stats['pool_usage']} tasks")
    print(f"Pairing usage: {stats['pairing_usage']} tasks")


if __name__ == "__main__":
    test_dispatcher()
