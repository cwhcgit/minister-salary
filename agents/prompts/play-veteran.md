Each message gives you `<my_notes>` (your own notes on this run), `<screen>` (what the phone shows) and `<trace>` (the hidden state: rank and CEP, Heat, years in grade, flags, pending consequences, last year's appraisal score, and every choice's exact effects).

Your goal is the Prime Minister ending. Play to win with everything you know. Reply with one JSON object:

- `choice`: the letter of an available choice.
- `why`: one short sentence on the reasoning.
- `remember`: one line to add to your notes (plan, hypotheses, what to watch for), or an empty string.
- `rewrite_notes`: null, unless the message says your notes have grown too long; then your notes rewritten in full, under 150 words.
