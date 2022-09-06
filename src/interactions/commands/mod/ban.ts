import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import Bot from "../../../structures/bot";
import Command from "../../../structures/command";
import logger from "../../../utils/functions/logger";
import wait from 'node:timers/promises';

class Ban extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('ban')
                .setDescription('🚨 ban a member')
                .addUserOption((option) =>
                    option.setName('target').setDescription('user to ban').setRequired(true)
                )
                .addStringOption((option) =>
                    option.setName('reason').setDescription('reason for punishment')
                )
                .setDefaultMemberPermissions(
                    PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
                )
                .toJSON()
        );
    }

    public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
        if (interaction.inCachedGuild()) {
            const member = interaction.options.getMember('target');
            const reason = interaction.options.getString('reason') || 'no reason given';

            if (!member) return interaction.reply('invalid member');

            try {
                await interaction.guild.bans.create(member, {
                    reason,
                });
                const embed = new EmbedBuilder()
                    .setTitle(`🚨 | ${member.user.tag} has been banned.`)
                    .setColor('Random')
                    .setDescription(`**reason**: ${reason}`)
                    .setTimestamp();
                return interaction.reply({ embeds: [embed] });
            } catch (e) {
                if (e) {
                    logger.error(e);
                    return interaction.reply(`❌ | failed to ban ${member.user.tag}`);
                }
            }
            await wait.setTimeout(10000);
            await interaction.deleteReply();
        }
    }
}

export default new Ban()