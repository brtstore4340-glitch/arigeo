# Architecture: zeus-oracle

## Overview
Root meta-orchestrator for the MARCUZ oracle fleet. Contains 7 subprojects and comprehensive strategic documentation.

## Type: Hybrid
- **Commercial subprojects**: cms-arigeo, captain-maid, marcuz-website, orry-website
- **System/Personal**: ram-voice-chat, arigeo-project (research)

## Tech Stack
- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js
- **Storage**: GitHub
- **Documentation**: Markdown
- **Fleet Memory**: ψ/ system

## Subprojects
1. **arigeo-project** - Research/Archive
2. **arigeo-project-II** - Research/Archive
3. **captain-maid** - Product Platform (commercial)
4. **marcuz-website** - Marketing Site (commercial)
5. **marcuxz-web** - Secondary Web (commercial)
6. **orry-website** - ERP Portal (commercial)
7. **ram-voice-chat** - Voice Integration (system)

## Key Architecture Decisions
- Monorepo structure with independent subprojects
- Fleet memory system (ψ/) for distributed knowledge
- Multi-oracle coordination model
- Proof-required execution model
- Role-based authorization

## Dependencies
- All subprojects depend on: fleet governance, oracle coordination, deployment pipelines
- cms-arigeo ← captain-maid integration
- dheva-oracle ← orry-website backend
