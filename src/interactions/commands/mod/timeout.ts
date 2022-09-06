import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import Bot from "../../../structures/bot";
import Command from "../../../structures/command";
import logger from "../../../utils/functions/logger";
import wait from 'node:timers/promises';

const durations = [
    { name: '60 seconds', value: 60 * 1000 },
    { name: '5 minutes', value: 5 * 60 * 1000 },
    { name: '10 minutes', value: 10 * 60 * 1000 },
    { name: '30 minutes', value: 30 * 60 * 1000 },
    { name: '1 hour', value: 60 * 60 * 1000 },
    { name: '1 day', value: 24 * 60 * 60 * 1000 },
    { name: '1 week', value: 7 * 24 * 60 * 60 * 1000 },
];

class Timeout extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('timeout')
                .setDescription('🚨 timeout a member')
                .addUserOption((option) =>
                    option
                        .setName('target')
                        .setDescription('user to timeout')
                        .setRequired(true)
                )
                .addNumberOption((option) =>
                    option
                        .setName('duration')
                        .setDescription('duration of timeout')
                        .addChoices(
                            { name: '60 seconds', value: 60 * 1000 },
                            { name: '5 minutes', value: 5 * 60 * 1000 },
                            { name: '10 minutes', value: 10 * 60 * 1000 },
                            { name: '30 minutes', value: 30 * 60 * 1000 },
                            { name: '1 hour', value: 60 * 60 * 1000 },
                            { name: '1 day', value: 24 * 60 * 60 * 1000 },
                            { name: '1 week', value: 7 * 24 * 60 * 60 * 1000 }
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option.setName('reason').setDescription('reason for punishment')
                )
                .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
                .toJSON()
        );
    }

    public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
        if (interaction.inCachedGuild()) {
            const member = interaction.options.getMember('target');
            const duration = interaction.options.getNumber('duration');
            const reason = interaction.options.getString('reason') || 'no reason given';

            if (!member) return interaction.reply('invalid member');

            try {
                await member.timeout(duration, reason);
                const embed = new EmbedBuilder()
                    .setTitle(`⏱️ | ${member.user.tag} has been timed out.`)
                    .setColor('Random')
                    .setDescription(
                        `**duration**: ${
                            durations.find((d) => duration === d.value)?.name
                        }\n` + `**reason**: ${reason}`
                    )
                    .setTimestamp();
                return interaction.reply({ embeds: [embed] });
            } catch (e) {
                if (e) {
                    logger.error(e);
                    return interaction.reply(
                        `❌ | failed to timeout ${member.user.tag}`
                    );
                }
            }
            await wait.setTimeout(10000);
            await interaction.deleteReply();
        }
    }
}

export default new Timeout()