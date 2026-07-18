#!/usr/bin/env python3
"""
One-command wrapper for Zeus token routing.

Uses the existing Zeus modules to:
- classify a task into HAIKU / PAIR / SONNET
- look up reusable pool patterns for low-cost reuse
- suggest a pairing partner when the task lands in PAIR

This wrapper is local-only and does not call any remote model.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from dataclasses import asdict
from typing import Any, Dict, List

CURRENT_DIR = os.path.dirname(__file__)
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from pairing_matcher import OracleRole, OracleState, PairingMatcher
from pool_manager import PoolManager, PoolQuery
from task_classifier import TaskClassifier, TaskInput

logging.getLogger().setLevel(logging.WARNING)
logging.getLogger("task_dispatcher").setLevel(logging.WARNING)

DEFAULT_ROLE_LOADS = {
    # Tier 1: Orchestration
    OracleRole.ZEUS: 70,           # Meta-orchestrator, always coordinating
    OracleRole.THAM: 60,           # Governor, high coordination load

    # Tier 2: Core Execution
    OracleRole.LUXI: 45,           # UI/UX specialist
    OracleRole.ARIS: 50,           # Code review gatekeeper
    OracleRole.STRATUM: 40,        # Architecture planning

    # Tier 3: Analysis & Intelligence
    OracleRole.LENS: 45,           # Analytics & insights
    OracleRole.AEIMATHES: 40,      # Research & daily reports

    # Tier 4: Security & Verification
    OracleRole.VERITY: 50,         # Verification & proof
    OracleRole.WARDEN: 45,         # Access control & security

    # Tier 5: Infrastructure & Operations
    OracleRole.DHEVA: 55,          # ERP & system optimization
    OracleRole.TELEOS: 45,         # Deployment automation
    OracleRole.OMEGA: 35,          # Operations bridge

    # Tier 6: Knowledge & Memory
    OracleRole.KHUN_RAM: 35,       # Documentation authority
    OracleRole.ALL: 40,            # Collective memory

    # Special: System Monitoring
    OracleRole.AGIS: 50,           # Workstream monitoring & escalation
}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Route a task through Zeus token-saving workflow.",
    )
    parser.add_argument("description", help="Task description to route")
    parser.add_argument("--oracle-role", default="omega", help="Oracle role, e.g. omega, tham, luxi")
    parser.add_argument("--category", default="unknown", help="Task category, e.g. operations, governance, architecture")
    parser.add_argument("--domain-fit", type=float, default=0.5, help="0.0-1.0 specialty fit")
    parser.add_argument("--priority", default="normal", choices=["low", "normal", "urgent"], help="Task priority")
    parser.add_argument("--max-pool-results", type=int, default=3, help="Maximum pool matches to show")
    parser.add_argument("--min-pool-quality", type=float, default=7.0, help="Minimum pool quality score")
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of human-readable text")
    return parser


def make_default_oracle_states() -> Dict[OracleRole, OracleState]:
    return {
        role: OracleState(role=role, current_load=load, recent_pairs=[], expertise_areas=[])
        for role, load in DEFAULT_ROLE_LOADS.items()
    }


def extract_keywords(description: str, limit: int = 8) -> List[str]:
    words = []
    seen = set()
    for raw in description.lower().replace("/", " ").replace("-", " ").split():
        token = "".join(ch for ch in raw if ch.isalnum() or ch == "_")
        if len(token) < 3:
            continue
        if token in seen:
            continue
        seen.add(token)
        words.append(token)
        if len(words) >= limit:
            break
    return words


def safe_role(role_name: str) -> OracleRole | None:
    try:
        return OracleRole(role_name.lower())
    except ValueError:
        return None


def recommend_execution_lane(recommendation: str) -> Dict[str, Any]:
    base = {
        "claude_policy": "If Claude is used, invoke it only via OpenCode Go. Do not use the Anthropic Claude path.",
    }

    if recommendation == "HAIKU":
        return {
            **base,
            "lane": "fast",
            "workflow": "Use concise prompts, short context, and prefer reuse before deep reasoning.",
            "executor": "Hermes/Codex fast lane",
        }
    if recommendation == "PAIR":
        return {
            **base,
            "lane": "pair",
            "workflow": "Explore broadly first, then refine only the strongest paths.",
            "executor": "Two-step lane: fast explorer + deep refiner",
        }
    return {
        **base,
        "lane": "deep",
        "workflow": "Use the narrowest possible scope, but allow deep reasoning for a high-stakes task.",
        "executor": "Deep reasoning lane",
    }


def build_report(args: argparse.Namespace) -> Dict[str, Any]:
    classifier = TaskClassifier(verbose=False)
    pool = PoolManager()
    matcher = PairingMatcher()

    task = TaskInput(
        description=args.description,
        oracle_role=args.oracle_role,
        category=args.category,
        domain_fit=args.domain_fit,
    )
    classification = classifier.classify(task)

    pool_results = []
    keywords = extract_keywords(args.description)
    if classification.recommendation.value == "HAIKU":
        query = PoolQuery(
            category=args.category if args.category != "unknown" else None,
            keywords=keywords,
            min_quality=args.min_pool_quality,
            max_results=args.max_pool_results,
            problem_description=args.description,
        )
        pool_results = [
            {
                "id": entry.id,
                "title": entry.title,
                "category": entry.category.value,
                "quality_score": entry.quality_score,
                "origin_oracle": entry.origin_oracle,
                "problem": entry.problem,
                "solution": entry.solution,
            }
            for entry in pool.query(query)
        ]

    pairing = None
    role = safe_role(args.oracle_role)
    if classification.recommendation.value == "PAIR" and role is not None:
        pair_result = matcher.find_best_pair(
            requesting_oracle=role,
            oracle_states=make_default_oracle_states(),
            task_category=args.category,
        )
        if pair_result:
            pairing = {
                "explorer": pair_result.explorer.value,
                "refiner": pair_result.refiner.value,
                "compatibility_score": round(pair_result.compatibility_score, 2),
                "reasoning": pair_result.reasoning,
                "basis": "default-neutral-fleet-state",
            }

    report = {
        "input": {
            "description": args.description,
            "oracle_role": args.oracle_role,
            "category": args.category,
            "domain_fit": args.domain_fit,
            "priority": args.priority,
        },
        "classification": {
            "complexity_score": classification.complexity_score,
            "recommendation": classification.recommendation.value,
            "confidence": round(classification.confidence, 2),
            "reasoning": classification.reasoning,
        },
        "pool": {
            "queried": classification.recommendation.value == "HAIKU",
            "keywords": keywords,
            "matches": pool_results,
        },
        "pairing": pairing,
        "execution": recommend_execution_lane(classification.recommendation.value),
    }

    return report


def render_text(report: Dict[str, Any]) -> str:
    lines = []
    inp = report["input"]
    cls = report["classification"]
    pool = report["pool"]
    execution = report["execution"]

    lines.append("ZEUS ROUTE")
    lines.append(f"task: {inp['description']}")
    lines.append(f"role/category: {inp['oracle_role']} / {inp['category']}")
    lines.append("")
    lines.append("ROUTING")
    lines.append(f"recommendation: {cls['recommendation']}")
    lines.append(f"complexity: {cls['complexity_score']}/10")
    lines.append(f"confidence: {int(cls['confidence'] * 100)}%")
    lines.append(f"lane: {execution['lane']}")
    lines.append(f"executor: {execution['executor']}")
    lines.append("")
    lines.append("WHY")
    lines.append(cls["reasoning"])

    if pool["queried"]:
        lines.append("")
        lines.append("POOL")
        if pool["matches"]:
            for match in pool["matches"]:
                lines.append(f"- {match['id']} | {match['title']} | q={match['quality_score']}/10 | from={match['origin_oracle']}")
        else:
            lines.append("- no high-quality pool match found")

    if report["pairing"]:
        pairing = report["pairing"]
        lines.append("")
        lines.append("PAIRING")
        lines.append(
            f"- {pairing['explorer']} -> {pairing['refiner']} (compatibility {int(pairing['compatibility_score'] * 100)}%, basis={pairing['basis']})"
        )

    lines.append("")
    lines.append("EXECUTION POLICY")
    lines.append(f"- {execution['workflow']}")
    lines.append(f"- {execution['claude_policy']}")
    return "\n".join(lines)


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    report = build_report(args)
    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print(render_text(report))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
