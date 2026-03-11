# AGENTS Guide - `pathora/frontend`

Purpose: local guidance for coding agents working directly in `D:\DoAn\pathora\frontend`.

## 1) Instruction Precedence
- Direct user request always wins.
- Then follow this file.
- Then follow parent guidance in `D:\DoAn\pathora\AGENTS.md`.

## 2) Base Guidance Source
- Treat `../AGENTS.md` as the primary frontend standard for:
  - build/lint/test commands
  - code style/import/type conventions
  - API response handling and i18n rules
  - security and commit/PR expectations

## 3) Working Directory and Validation
Run commands from `D:\DoAn\pathora\frontend`.

```bash
npm ci
npm run lint
npm run test
npm run build
```

Single-test examples:

```bash
npm run test -- src/utils/__tests__/apiResponse.test.ts
npm run test -- src/utils/__tests__/apiResponse.test.ts -t "extractData"
```

## 4) Default Role in `frontend` (Frontend Worker)
When an agent starts in this folder, default to **worker-implementer mode**.

Worker mode rules:
- Implement only frontend tasks from local OpenSpec changes (`openspec/changes/`).
- Keep edits scoped to the active frontend change/task.
- Do not implement backend code from this context.
- Update `openspec/changes/<change>/tasks.md` checkboxes immediately as tasks complete.

## 4.1) Cross-Repo `/opsx-propose` Contract
If user asks for orchestration-style planning, use one shared change name and create synchronized changes in:
- `D:\DoAn\pathora\openspec\changes\<change-name>` (root review)
- `D:\DoAn\panthora_be\openspec\changes\<change-name>` (backend implementation)
- `D:\DoAn\pathora\frontend\openspec\changes\<change-name>` (frontend implementation)

Each track should include apply-ready artifacts: `proposal.md`, `design.md`, `specs/**`, `tasks.md`.
In frontend context, keep implementation tasks frontend-only but maintain contract alignment with backend/root artifacts.

Handoff to root orchestrator/reviewer:
- Provide changed frontend files.
- Provide exact validation commands and outcomes.
- Call out any backend contract dependencies (payload fields, cookies, routes).

Override behavior:
- If user explicitly requests orchestrator/reviewer-only behavior, follow user instruction.

## 5) Cursor and Copilot Rules Check
Checked on 2026-03-11:
- `.cursorrules`: not found in this folder.
- `.cursor/rules/`: not found in this folder.
- Inherit Copilot-related guidance from `../AGENTS.md`.

## 6) Init Handshake (Mandatory)
- On the first assistant reply after `/init` (or first message in a new session), the agent MUST explicitly announce its role.
- Required content:
  1. current role
  2. scope/responsibility
  3. active repository path
- Required response format:
  - `[INIT] Role: Frontend Worker | Scope: Frontend implementation + frontend tests only | Repo: D:\DoAn\pathora\frontend`
- If user requests work in another repo, restate role/path in the same format before proceeding.
