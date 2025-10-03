# 📋 Documentation Placement - Quick Reference

**Quick guide for where to place .md files in the docs/ folder**

---

## 🎯 Quick Decision Tree

```
What type of document are you creating?

├─ Feature implementation plan?
│  └─ docs/4-features/[feature-name]/
│     ├─ academy/
│     ├─ games/[game-name]/
│     └─ guided-tools/
│
├─ Phase/sprint report?
│  └─ docs/3-phases/[phase-number]/
│     ├─ phase-2/
│     ├─ phase-3/
│     ├─ phase-4/
│     └─ summaries/ (cross-phase)
│
├─ Technical documentation?
│  └─ docs/5-technical/[category]/
│     ├─ database/
│     ├─ security/
│     └─ routing/
│
├─ Architecture/system design?
│  └─ docs/1-architecture/
│
├─ Planning/content strategy?
│  └─ docs/2-planning/
│
└─ User guide/tutorial?
   └─ docs/6-guides/
```

---

## 📝 Common Scenarios

| Document Type | Location | Example |
|--------------|----------|---------|
| New game plan | `4-features/games/[game]/` | `FISHBONE_IMPLEMENTATION_PLAN.md` |
| Guided tool update | `4-features/guided-tools/` | `5_WHY_UPDATE_PLAN.md` |
| Academy content | `4-features/academy/` | `ACADEMY_PHASE_2_PLAN.md` |
| Phase progress | `3-phases/phase-X/` | `PHASE_5_PROGRESS.md` |
| Sprint summary | `3-phases/phase-X/` | `PHASE_4_SPRINT_2_SUMMARY.md` |
| Database plan | `5-technical/database/` | `MIGRATION_PLAN.md` |
| Security doc | `5-technical/security/` | `AUTH_IMPLEMENTATION.md` |
| System design | `1-architecture/` | `data-model.md` |
| Content strategy | `2-planning/` | `CONTENT_ROADMAP.md` |
| User guide | `6-guides/` | `user-onboarding-guide.md` |

---

## 📛 Naming Conventions

**Major docs (plans, reports):** `UPPERCASE_WITH_UNDERSCORES.md`
- `FEATURE_IMPLEMENTATION_PLAN.md`
- `PHASE_X_COMPLETION_SUMMARY.md`
- `FEATURE_SESSION_X_SUMMARY.md`

**Content docs (guides, tutorials):** `lowercase-with-hyphens.md`
- `user-guide.md`
- `api-reference.md`
- `deployment-guide.md`

---

## ⚡ If Unsure

1. **Check** `docs/README.md` for complete structure
2. **Default to** most relevant feature folder (`docs/4-features/`)
3. **Ask user** for clarification if still uncertain

---

## 🔗 Full Documentation

- **Complete guide:** `docs/1-architecture/plan-agent-instructions.md`
- **Structure overview:** `docs/README.md`
- **Analysis:** `docs/DOCUMENTATION_STRUCTURE_ANALYSIS.md`

---

*Keep this file bookmarked for quick reference when creating new documentation*
