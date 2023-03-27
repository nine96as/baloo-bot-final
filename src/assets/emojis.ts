/**
 * Object containing various emojis used in the Discord bot.
 */
export const emojis: Record<string, string | Record<string, string>> = {
  category: '<:category:1025367604384239679>',

  success: '<:success:1025364274610196582>',
  error: '<:error:1025364273020547092>',
  info: '<:info:1025365189434019933>',

  join: '<:join:1025373360785465374>',
  leave: '<:leave:1025373359392964618>',

  translate: '<:translate:1025378106833379420>',
  ping: '🏓',
  dice: '🎲',
  math: '<:math:1025365970191122514>',

  pages: {
    first: '<:first:1025373353885839401>',
    next: '<:next:1025373355479662644>',
    previous: '<:previous:1025373357518114836>',
    last: '<:last:1025373352497524806>'
  },

  switch: {
    on: '<:on:1025378108116848670>',
    off: '<:off:1025378109756809256>'
  },

  badge: {
    owner: '<:owner:1025362154259492974>',
    booster: '<:booster:1025374007341625344>',
    staff: '<:staff:1025373363759222815>',
    member: '<:member:1025367605919371286>',
    bot: '<:bot:1025360506166448158>'
  }
};

/**
 * Construct a type with a set of properties K of type T.
 */
type Record<K extends string, T> = {
  [P in K]: T;
};
