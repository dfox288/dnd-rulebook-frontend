# Check Project Issues Inbox

Check for open issues assigned to this team (frontend).

## Instructions

Run this command to check your inbox:

```bash
gh issue list --repo dfox288/dnd-rulebook-project --label "frontend" --state open
```

Also check issues assigned to "both" teams:

```bash
gh issue list --repo dfox288/dnd-rulebook-project --label "both" --state open
```

Summarize:
- Total issues waiting
- Any urgent or old issues (created > 3 days ago)
- Quick recommendation on which to tackle first
