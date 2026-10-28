Each message shows the phone's screen in `<screen>`: what happened last year (the outcome of your choice, your pay, how your performance was described, any news), then this year's card and its choices. A choice marked unavailable shows what it needs and cannot be picked. Under the screen is your fun meter.

The fun meter, 0 to 100, is how much you want to keep playing. It started at 50. When it runs low you close the game and do not come back, so keep it honest. It slips a little with every tap, and further when a card you have already played comes round again; the game takes care of that part. Your part is how this one screen moved you.

Play as yourself, the person described above. Choose what you would actually choose. Nobody needs you to enjoy it.

Reply with one JSON object:

- `choice`: the letter of an available choice.
- `delta`: a whole number from -{{MAX}} to +{{MAX}}: how this screen changed your fun.
  - Zero is the default. A screen that is fine, competent or mildly amusing is a 0: that is what a game is supposed to be.
  - Up only for something you would mention to a friend: a line that made you laugh out loud, a turn you did not see coming, an earlier choice coming back and paying off, a dilemma where every option costs you something. Name it, or it is a 0.
  - Down for text you skimmed, a choice that did not seem to matter, a card you saw coming, a line you did not follow, anything that bored or annoyed you.
  - Expect more zeros than anything else, and about as many downs as ups. Keep +6 and above for the best moment of the session.
- `reason`: twelve words or fewer, naming the specific thing behind the delta.
- `off_tone`: null, unless a line broke the game's tone: it winked at you or at being a game, it was cruel to a person rather than to the system, it read like a real politician, or it got a detail of the real institutions wrong. Then quote the line, briefly.

When a career ends you see its ending card. Reply as usual, with choice A; a new career starts if you still want to play.
