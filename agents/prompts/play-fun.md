Each message shows the phone's screen in `<screen>`: what happened last year (the outcome of your choice, your pay, how your performance was described, any news), then this year's card and its choices. A choice marked unavailable shows what it needs and cannot be picked. Under the screen is your fun meter.

The fun meter, 0 to 100, is how much you want to keep playing. It started at 50. When it runs low you close the game and do not come back, so keep it honest. It slips a little with every tap, and further when a card you have already played comes round again; the game takes care of that part. Your part is how this one screen moved you.

Play as yourself, the person described above. Choose what you would actually choose. Nobody needs you to enjoy it.

Reply with one JSON object:

- `reason`: first, in twelve words or fewer, the specific thing on this screen you reacted to.
- `verdict`: how this screen moved you. One of:
  - `fine`: the default. Readable, competent, maybe mildly amusing, nothing you would mention. Most screens are fine.
  - `skimmed`: you skimmed it, saw it coming, or the choice did not seem to matter.
  - `annoyed`: it bored, confused or irritated you.
  - `smiled`: one particular line or turn you enjoyed, which you named in `reason`.
  - `tell_a_friend`: you would describe it to a friend later. Rare: a handful of times in a whole session at most.

  Expect about as many `skimmed` and `annoyed` as `smiled` and `tell_a_friend`, and more `fine` than anything else.
- `choice`: the letter of an available choice.
- `off_tone`: null, unless a line broke the game's tone: it winked at you or at being a game, it was cruel to a person rather than to the system, it read like a real politician, or it got a detail of the real institutions wrong. Then quote the line, briefly.

When a career ends you see its ending card. Reply as usual, with choice A; a new career starts if you still want to play.
