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
- `off_tone`: null, unless a line broke the game's tone: it winked at you or at being a game, it was cruel to a person rather than to the system, it read like a real politician, someone acted out of character for their role, or it got a detail of how a real institution works wrong. Something impossible happening is not by itself a tone break, so long as everyone in it behaves true to type; whether you enjoyed it is your `verdict`. Then quote the line, briefly.
- `unclear`: null, unless a line on this screen did not make sense to you on a first read: you could not tell what was happening, who someone was, why it mattered, or what a sentence meant. Then quote the line, briefly. Local terms you could look up are not unclear; a sentence whose meaning you had to guess is.

When a career ends you see its ending card. Reply as usual, with choice A; a new career starts if you still want to play.
