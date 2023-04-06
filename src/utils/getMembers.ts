import { Guild, GuildMember } from 'discord.js';

/**
 * Fetches all members of a specific guild.
 * @param {Guild} guild Path to search.
 * @returns {Promise<GuildMember[]>} A Promise that resolves when the array of
 * guild members is provided.
 */
export const getMembers = async (guild: Guild): Promise<GuildMember[]> => {
  return await guild.members.fetch().then((m) => Array.from(m.values()));
};
