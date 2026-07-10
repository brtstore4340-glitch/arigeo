#!/usr/bin/env python3
"""
Fleet Knowledge Pool Manager

Manages shared knowledge pool for inter-oracle learning.
- Add patterns from oracle contributions
- Query pool for relevant patterns
- Rate patterns by quality/usefulness
- Maintain pool health (remove stale entries)
"""

import json
import hashlib
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import List, Optional, Dict
from enum import Enum
import re


class PatternCategory(str, Enum):
    """Pool pattern categories"""
    ACCESSIBILITY = "accessibility"
    EVM_ERRORS = "evm_errors"
    GOVERNANCE = "governance"
    PERFORMANCE = "performance"
    MISC = "misc"


@dataclass
class PoolEntry:
    """A single knowledge pool entry"""
    id: str
    category: PatternCategory
    title: str
    problem: str
    solution: str
    tags: List[str]
    origin_oracle: str
    date_added: str
    times_reused: int = 0
    quality_score: float = 8.0  # 1-10
    source_file: str = ""


@dataclass
class PoolQuery:
    """Query to search pool"""
    category: Optional[str] = None
    keywords: List[str] = None
    min_quality: float = 6.0
    origin_oracle: Optional[str] = None
    max_results: int = 5
    problem_description: str = ""


class PoolManager:
    """Manages fleet knowledge pool"""

    def __init__(self, pool_dir: str = "ψ/memory/fleet"):
        self.pool_dir = pool_dir
        self.entries: Dict[str, PoolEntry] = {}
        self.load_pool()

    def load_pool(self):
        """Load pool entries from filesystem (placeholder)"""
        # In real implementation, would scan directory
        self._add_seed_entries()

    def _add_seed_entries(self):
        """Add seed patterns for demo"""
        seeds = [
            PoolEntry(
                id="acc-001",
                category=PatternCategory.ACCESSIBILITY,
                title="ARIA labels for dynamic form controls",
                problem="Form fields added dynamically need accessible labels",
                solution="Use aria-label + aria-labelledby + role=region for dynamic forms",
                tags=["aria", "forms", "wcag2.1"],
                origin_oracle="luxi",
                date_added="2026-05-28",
                times_reused=0,
                quality_score=9.0
            ),
            PoolEntry(
                id="evm-001",
                category=PatternCategory.EVM_ERRORS,
                title="Handling EVM revert with custom error codes",
                problem="EVM transaction reverted, need human-readable error message",
                solution="Decode error code using contract ABI, map to predefined messages",
                tags=["evm", "error-handling", "defi"],
                origin_oracle="dheva",
                date_added="2026-06-01",
                times_reused=0,
                quality_score=8.0
            ),
            PoolEntry(
                id="gov-001",
                category=PatternCategory.GOVERNANCE,
                title="Oracle role assignment decision template",
                problem="Need to assign new oracle to role without breaking fleet hierarchy",
                solution="Use role-based inheritance model: define role > assign oracle > propagate permissions",
                tags=["governance", "roles", "hierarchy"],
                origin_oracle="tham",
                date_added="2026-06-02",
                times_reused=0,
                quality_score=8.5
            ),
        ]

        for entry in seeds:
            self.entries[entry.id] = entry

    def add_entry(self, entry: PoolEntry) -> str:
        """Add new pattern to pool"""
        if not entry.id:
            entry.id = self._generate_id(entry.title)

        self.entries[entry.id] = entry
        return entry.id

    def query(self, query: PoolQuery) -> List[PoolEntry]:
        """Search pool with query"""
        results = list(self.entries.values())

        # Filter by category
        if query.category:
            results = [e for e in results if e.category.value == query.category]

        # Filter by min quality
        results = [e for e in results if e.quality_score >= query.min_quality]

        # Filter by origin oracle if specified
        if query.origin_oracle:
            results = [e for e in results if e.origin_oracle == query.origin_oracle]

        # Score by keyword relevance
        if query.keywords or query.problem_description:
            search_terms = (query.keywords or []) + (
                query.problem_description.split() if query.problem_description else []
            )
            search_set = set(t.lower() for t in search_terms)

            scored_results = []
            for entry in results:
                entry_text = (entry.title + " " + entry.problem + " " + entry.solution).lower()
                entry_words = set(entry_text.split())
                overlap = len(search_set & entry_words)
                if overlap > 0:
                    scored_results.append((overlap, entry))

            # Sort by relevance score, descending
            scored_results.sort(key=lambda x: x[0], reverse=True)
            results = [e for _, e in scored_results]

        # Limit results
        return results[:query.max_results]

    def rate_entry(self, entry_id: str, new_score: float):
        """Update entry quality score"""
        if entry_id in self.entries:
            self.entries[entry_id].quality_score = max(1.0, min(10.0, new_score))

    def record_reuse(self, entry_id: str):
        """Record that entry was used"""
        if entry_id in self.entries:
            self.entries[entry_id].times_reused += 1

    def get_stale_entries(self, quality_threshold: float = 6.0) -> List[PoolEntry]:
        """Get entries below quality threshold (candidates for removal)"""
        return [e for e in self.entries.values() if e.quality_score < quality_threshold]

    def remove_entry(self, entry_id: str):
        """Remove entry from pool"""
        if entry_id in self.entries:
            del self.entries[entry_id]

    def get_pool_stats(self) -> Dict:
        """Get pool health statistics"""
        entries = list(self.entries.values())
        if not entries:
            return {"total": 0, "avg_quality": 0, "most_reused": None}

        total = len(entries)
        avg_quality = sum(e.quality_score for e in entries) / total
        most_reused = max(entries, key=lambda e: e.times_reused)

        return {
            "total_entries": total,
            "avg_quality": round(avg_quality, 2),
            "most_reused": {
                "id": most_reused.id,
                "title": most_reused.title,
                "times_reused": most_reused.times_reused,
                "quality": most_reused.quality_score
            },
            "entries_below_6": len(self.get_stale_entries(6.0)),
            "categories": {cat.value: len([e for e in entries if e.category == cat])
                          for cat in PatternCategory}
        }

    def _generate_id(self, title: str) -> str:
        """Generate unique ID from title"""
        # Create deterministic ID: first 3 words + hash
        words = title.split()[:3]
        prefix = "-".join(w.lower() for w in words)
        hash_suffix = hashlib.md5(title.encode()).hexdigest()[:3]
        return f"{prefix}-{hash_suffix}"


# ==================== TESTING & EXAMPLES ====================

def test_pool():
    """Test pool functionality"""
    pool = PoolManager()

    print("=" * 60)
    print("POOL STATISTICS")
    print("=" * 60)
    stats = pool.get_pool_stats()
    print(f"Total entries: {stats['total_entries']}")
    print(f"Average quality: {stats['avg_quality']}/10")
    print(f"Categories: {stats['categories']}")

    print("\n" + "=" * 60)
    print("QUERY EXAMPLE 1: Search accessibility patterns")
    print("=" * 60)
    query1 = PoolQuery(
        category="accessibility",
        keywords=["aria", "forms"],
        max_results=5
    )
    results1 = pool.query(query1)
    for entry in results1:
        print(f"\n[{entry.id}] {entry.title}")
        print(f"  Quality: {entry.quality_score}/10")
        print(f"  Problem: {entry.problem}")
        print(f"  Solution: {entry.solution}")

    print("\n" + "=" * 60)
    print("QUERY EXAMPLE 2: Find governance patterns")
    print("=" * 60)
    query2 = PoolQuery(
        category="governance",
        min_quality=8.0,
        max_results=3
    )
    results2 = pool.query(query2)
    for entry in results2:
        print(f"\n[{entry.id}] {entry.title}")
        print(f"  Quality: {entry.quality_score}/10")
        print(f"  Origin: {entry.origin_oracle}")

    print("\n" + "=" * 60)
    print("RECORD REUSE")
    print("=" * 60)
    if results1:
        pool.record_reuse(results1[0].id)
        print(f"Recorded reuse for {results1[0].id}")
        print(f"Times reused: {pool.entries[results1[0].id].times_reused}")

    print("\n" + "=" * 60)
    print("UPDATED STATS")
    print("=" * 60)
    updated_stats = pool.get_pool_stats()
    print(f"Most reused: {updated_stats['most_reused']['title']}")
    print(f"  Reuse count: {updated_stats['most_reused']['times_reused']}")


if __name__ == "__main__":
    test_pool()
