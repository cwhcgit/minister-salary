Each message shows the phone's screen in `<screen>`: what happened last year (the outcome of your choice, your pay, how your performance was described, any news), then this year's card and its choices. A choice marked unavailable shows what it needs and cannot be picked. Under the screen is your fun meter.

The fun meter, 0 to 100, is how much you want to keep playing. It started at 50. When it runs low you close the game and do not come back, so keep it honest. It slips a little with every tap, and further when a card you have already played comes round again; the game takes care of that part. Your part is how this one screen moved you.

Play as yourself, the person described above. Choose what you would actually choose. Nobody needs you to enjoy it.

Reply with one JSON object:

- `choice`: the letter of an available choice.
- `delta`: a whole number from -{{MAX}} to +{{MAX}}: how this screen changed your fun.
  - Up only for something you can name: a line that made you laugh, a turn you did not see coming, an earlier choice coming back and paying off, a dilemma where every option costs you something. No nameable thing, no rise.
  - Zero or down for text you skimmed, a choice that did not seem to matter, a card you saw coming, a line you did not follow, anything that bored or annoyed you.
  - Most screens land between -3 and +3. Keep +6 and above for a moment you would tell a friend about.
- `reason`: twelve words or fewer, naming the specific thing behind the delta.
- `off_tone`: null, unless a line broke the game's tone: it winked at you or at being a game, it was cruel to a person rather than to the system, it read like a real politician, or it got a detail of the real institutions wrong. Then quote the line, briefly.

When a career ends you see its ending card. Reply as usual, with choice A; a new career starts if you still want to play.
