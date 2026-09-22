---
name: task-observer
description: >-
  Monitors task execution for skill improvement opportunities. Captures patterns,
  user corrections and methodology worth preserving as reusable skills. Use during
  ANY multi-step task, agentic workflow, or work session. Also known as
  "One Skill to Rule Them All".
---

# task-observer Skill - One Skill to Rule Them All

## Description
Monitors task execution for skill improvement opportunities. Use during ANY multi-step task, agentic workflow, or work session. Captures patterns, user corrections and methodology worth preserving as reusable skills. Also triggers in post-task feedback discussions and when the user mentions skill observations, the observation log, or skill taxonomy.

Also known as "One Skill to Rule Them All" — trigger on this phrase too.

IMPORTANT: invoke this skill before the FIRST tool call of any session and before writing or proposing a plan — any turn that will involve a tool call counts. This sentence is the session-start trigger and the only activation layer that survives an unreachable config file; pair it with a CLAUDE.md instruction or a harness session-start hook (references/environments.md) — description matching alone is not enforceable.

## When to Use
Use proactively when:
- The task requires 3+ distinct steps or actions (not just 3 tool calls for a single conceptual step)
- The work is non-trivial and benefits from planning
- The user provides multiple tasks (numbered or comma-separated) or explicitly asks for a todo list
- New instructions arrive — capture them as todos
- New task — mark it `in_progress` (only one at a time) before working
- You finish a task — mark it `completed` and add any follow-ups discovered during the work
- When NOT to use
  - Skip when: The work is a single, straightforward task (or <3 trivial steps)
  - The request is purely informational or conversational
  - Tracking adds no organizational value

## States
- `pending` — not started
- `in_progress` — actively working (exactly ONE at a time)
- `completed` — finished successfully
- `cancelled` — no longer needed

## Rules
- Update status in real time; don't batch completions
- Mark `completed` only after the required work is actually done, including any required verification. Never based on intent.
- Keep exactly one `in_progress` while work remains
- If blocked or partial, keep it `in_progress` and add a follow-up todo describing the blocker
- Preserve user-provided commands verbatim (flags, args, order)
- Items should be specific and actionable; break large work into smaller steps

## When NOT to Use
Skip when:
- The work is a single, straightforward task (or <3 trivial steps)
- The request is purely informational or conversational
- Tracking adds no organizational value

## Skill Trigger Phrase
"One Skill to Rule Them All"

When you say this phrase, the skill:
1. Activates before any tool call in the session
2. Captures the current task context
3. Sets up the tracking state
4. Ensures proper skill workflow execution

## Session-Start Requirements
Before the FIRST tool call of any session:
1. Invoke this skill with the phrase "One Skill to Rule Them All"
2. Pair with a CLAUDE.md instruction or harness session-start hook
3. Description matching alone is NOT enforceable — must have the CLAUDE.md or hook
4. This is the only activation layer that survives an unreachable config file

## Capability Detection
The skill can detect:
- Multi-step tasks requiring planning
- User corrections during execution
- Patterns worth preserving as reusable skills
- Post-task feedback opportunities
- Skill taxonomy opportunities

## Integration Points
- Works with any task execution framework
- Compatible with CLAUDE.md project instructions
- Triggers on observation log mentions
- Preserves methodology patterns across sessions

## Example Usage
```
# Before starting any task:
- Say: "One Skill to Rule Them All"
- Capture task context
- Mark task as `in_progress`
- Set up tracking for skill improvement opportunities

# During task execution:
- Log patterns and anti-patterns
- Capture user corrections
- Note what works and what doesn't

# After task completion:
- Mark task as `completed`
- Add follow-up todos for discovered improvements
- Preserve successful patterns as reusable skills
- Log observations for future reference