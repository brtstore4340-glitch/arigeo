#!/usr/bin/env python3
"""
Oracle Pairing Matcher - Asymmetric Oracle Pairing for Complex Tasks

Matches compatible oracle pairs for complex problems:
- Oracle A (Haiku/Explorer): Explores 5-10 angles quickly
- Oracle B (Sonnet/Refiner): Deep-dives on promising angles

Matching based on:
- Expertise complementarity
- Availability
- Past pairing performance
"""

from dataclasses import dataclass
from typing import List, Optional, Dict, Tuple
from enum import Enum


class OracleRole(str, Enum):
    """Oracle roles — Fleet Directory"""
    # Tier 1: Orchestration
    ZEUS = "zeus"           # Meta-Orchestrator · Fleet Command
    THAM = "tham"           # Governor · Coordinator · Daily Operations

    # Tier 2: Core Execution
    LUXI = "luxi"           # UI/UX · Frontend · Design
    ARIS = "aris"           # Code Review · Quality Gate · Project Review
    STRATUM = "stratum"     # Architecture · Structure · System Design

    # Tier 3: Analysis & Intelligence
    LENS = "lens"           # Analysis · Perspective · Data Intelligence
    AEIMATHES = "aeimathes" # Research · Analysis · Daily Reports

    # Tier 4: Security & Verification
    VERITY = "verity"       # Truth · Verification · Proof
    WARDEN = "warden"       # Guardian · Access Control · Security

    # Tier 5: Infrastructure & Operations
    DHEVA = "dheva"         # ERP · System Optimization
    TELEOS = "teleos"       # Vercel · Deploy · Deployment
    OMEGA = "omega"         # Bridge · Gate · Integration

    # Tier 6: Knowledge & Memory
    KHUN_RAM = "khun_ram"   # Documentation · Memory Authority · Thai Language
    ALL = "all"             # Fleet Scribe · Collective Memory

    # Special: System Monitoring (born during system-down recovery)
    AGIS = "agis"           # Workstream Monitoring & Escalation


@dataclass
class OracleState:
    """State of an oracle"""
    role: OracleRole
    current_load: int       # 0-100 (busy percentage)
    recent_pairs: List[str] = None  # List of oracle IDs recently paired with
    expertise_areas: List[str] = None


@dataclass
class PairingResult:
    """Result of pairing operation"""
    explorer: OracleRole
    refiner: OracleRole
    compatibility_score: float  # 0-1
    reasoning: str


class PairingMatcher:
    """Matches oracle pairs for asymmetric collaboration"""

    # Complementary expertise pairings (from fleet architecture)
    EXPERTISE_PAIRINGS = {
        # Tier 2: Execution
        OracleRole.LUXI: [OracleRole.STRATUM, OracleRole.DHEVA],
        OracleRole.ARIS: [OracleRole.VERITY, OracleRole.WARDEN],
        OracleRole.STRATUM: [OracleRole.LUXI, OracleRole.DHEVA],

        # Tier 3: Analysis
        OracleRole.LENS: [OracleRole.THAM, OracleRole.STRATUM],
        OracleRole.AEIMATHES: [OracleRole.LENS],

        # Tier 4: Security
        OracleRole.VERITY: [OracleRole.ARIS, OracleRole.THAM],
        OracleRole.WARDEN: [OracleRole.ARIS, OracleRole.VERITY],

        # Tier 5: Infrastructure
        OracleRole.DHEVA: [OracleRole.STRATUM, OracleRole.THAM],
        OracleRole.TELEOS: [OracleRole.ALL],
        OracleRole.OMEGA: [OracleRole.THAM, OracleRole.STRATUM],

        # Tier 6: Knowledge
        OracleRole.KHUN_RAM: [OracleRole.ALL],
        OracleRole.ALL: [OracleRole.KHUN_RAM],

        # Orchestration
        OracleRole.THAM: [OracleRole.DHEVA, OracleRole.LENS, OracleRole.VERITY],
        OracleRole.ZEUS: [],  # No pairing (orchestrator only)

        # System Monitoring
        OracleRole.AGIS: [OracleRole.THAM, OracleRole.LENS],
    }

    # Pairing history (past success rates) — Wave 1 baseline
    PAIRING_HISTORY = {
        # Execution tier
        ("luxi", "stratum"): 0.85,
        ("aris", "verity"): 0.88,
        ("stratum", "dheva"): 0.82,

        # Analysis tier
        ("lens", "tham"): 0.80,
        ("lens", "aeimathes"): 0.79,

        # Governance
        ("tham", "verity"): 0.78,
        ("tham", "dheva"): 0.81,
        ("tham", "lens"): 0.80,

        # Infrastructure
        ("dheva", "stratum"): 0.82,
        ("teleos", "all"): 0.84,

        # Knowledge
        ("khun_ram", "all"): 0.86,

        # Security
        ("warden", "aris"): 0.83,
        ("verity", "warden"): 0.87,

        # Monitoring (new)
        ("agis", "tham"): 0.75,
        ("agis", "lens"): 0.76,
    }

    def find_best_pair(
        self,
        requesting_oracle: OracleRole,
        oracle_states: Dict[OracleRole, OracleState],
        task_category: str
    ) -> Optional[PairingResult]:
        """Find best pairing partner for requesting oracle"""

        # Get candidate pairings
        candidates = self.EXPERTISE_PAIRINGS.get(
            requesting_oracle, []
        )

        if not candidates:
            return None

        # Score each candidate
        best_score = -1
        best_pair = None

        for candidate in candidates:
            if candidate not in oracle_states:
                continue

            score = self._calculate_pairing_score(
                requesting_oracle,
                candidate,
                oracle_states[candidate],
                task_category
            )

            if score > best_score:
                best_score = score
                best_pair = candidate

        if best_pair is None:
            return None

        reasoning = self._generate_reasoning(
            requesting_oracle,
            best_pair,
            best_score,
            task_category
        )

        return PairingResult(
            explorer=requesting_oracle,
            refiner=best_pair,
            compatibility_score=best_score,
            reasoning=reasoning
        )

    def _calculate_pairing_score(
        self,
        oracle_a: OracleRole,
        oracle_b: OracleRole,
        oracle_b_state: OracleState,
        task_category: str
    ) -> float:
        """Calculate pairing compatibility score"""

        # Start with expertise compatibility (high baseline)
        score = 0.75

        # Adjust for availability (0-25%)
        availability_factor = (100 - oracle_b_state.current_load) / 100
        score += 0.25 * availability_factor

        # Check historical pairing success
        pair_key = (oracle_a.value, oracle_b.value)
        if pair_key in self.PAIRING_HISTORY:
            history_score = self.PAIRING_HISTORY[pair_key]
            score = (score * 0.6) + (history_score * 0.4)

        # Penalize if recently paired
        if oracle_b_state.recent_pairs:
            if oracle_a.value in oracle_b_state.recent_pairs:
                score *= 0.8  # Reduce score, but allow re-pairing if needed

        # Clamp to 0-1
        return max(0.0, min(1.0, score))

    def _generate_reasoning(
        self,
        oracle_a: OracleRole,
        oracle_b: OracleRole,
        score: float,
        task_category: str
    ) -> str:
        """Generate reasoning for pairing"""
        return f"""
Pairing: {oracle_a.value} (Explorer) ← → {oracle_b.value} (Refiner)
Compatibility: {score:.0%}

Expert Pairing:
  {oracle_a.value} explores {task_category} (breadth)
  {oracle_b.value} refines insights (depth)

Process:
  1. {oracle_a.value}: Haiku explores 5-10 angles (~500 tokens, 5min)
  2. {oracle_b.value}: Sonnet deep-dives on 2-3 angles (~1500 tokens, 10min)
  3. Combined: {oracle_a.value} + {oracle_b.value} make decision

Expected Outcome:
  Cost: ~2000 tokens (vs 4000+ solo Sonnet)
  Quality: High (two perspectives, validated)
  Time: 15-20 min (vs 45 min solo)
""".strip()


# ==================== TESTING ====================

def test_pairing():
    """Test pairing matcher"""
    matcher = PairingMatcher()

    # Create test oracle states
    oracle_states = {
        OracleRole.LUXI: OracleState(OracleRole.LUXI, current_load=40),
        OracleRole.STRATUM: OracleState(OracleRole.STRATUM, current_load=20),
        OracleRole.DHEVA: OracleState(OracleRole.DHEVA, current_load=60),
        OracleRole.THAM: OracleState(OracleRole.THAM, current_load=70),
        OracleRole.LENS: OracleState(OracleRole.LENS, current_load=30),
    }

    # Test pairing scenarios
    test_cases = [
        (OracleRole.LUXI, "ui_design"),
        (OracleRole.LENS, "governance"),
        (OracleRole.DHEVA, "integration"),
    ]

    for requesting_oracle, task_category in test_cases:
        print("=" * 60)
        print(f"PAIRING REQUEST: {requesting_oracle.value} (task: {task_category})")
        print("=" * 60)

        result = matcher.find_best_pair(
            requesting_oracle,
            oracle_states,
            task_category
        )

        if result:
            print(f"Match: {result.explorer.value} ↔ {result.refiner.value}")
            print(f"Compatibility: {result.compatibility_score:.0%}")
            print(f"\n{result.reasoning}")
        else:
            print("No suitable pairing found")

        print()


if __name__ == "__main__":
    test_pairing()
