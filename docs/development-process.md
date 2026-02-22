# `z-megarepo` development process

## Mode: Dialog-driven vibe coding

Lightweight, conversational collaboration intended for spikes, prototypes, or fuzzy explorations where we expect to learn as we build. Instead of full spec docs up front, the human and LLM co-evolve direction inside an ongoing dialog.

### When to pick this mode

- Discovery work, UI spikes, "can we even do this?" experiments.
- Small fixes where writing a full spec would cost more than the change.
- Sessions that need rapid iteration or pairing energy.

### Workflow loop

1. **Frame intent** – capture a quick goal, guardrails, and timebox (even a paragraph in `__drafts__/` is fine).
2. **Conversational build** – bounce between ideas, snippets, and immediate feedback. It's OK to write tests opportunistically rather than strictly first.
3. **Micro-checkpoints** – pause occasionally to summarize the current understanding or decisions so the session stays coherent.
4. **Stabilize** – once the solution feels "real," capture a short retro + TODOs if the spike already produced mergeable code.

## Notes

### commit scopes

- `docs`
- `chore`
- `red`
- `green`
- `refactor`

### changelog generation

if the *docs* & *commits* are structured enough, we should be able to generate pretty amazing change documentation, potentially at different levels of granularity

### branch workflow

This is intended to closely mirror trunk-based development
I think it'll work best if all changes are 'up-to-date' with `master`
BUT... I think longer-term planning (beyond the current PR branch) might justify other long-lived branch(s) *just* for planning.

**Note**: The primary branch is `master` (not `main`). See [Git Conventions](../development-conventions/git/README.md) for full branch naming standards.
