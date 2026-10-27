The run is over. Reply with one JSON object:

- `exploits`: a list of `{ name, how, severity, events, reproducible }` for everything you confirmed. `how` is a recipe another player could follow. `events` are event ids from the trace.
- `degenerate_loops`: patterns that repeat with no real decision in them.
- `notes`: anything else the designer should know, including hypotheses you could not confirm.
