"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_1 = __importDefault(require("../../../structures/command"));
class Banner extends command_1.default {
    constructor() {
        super(new discord_js_1.SlashCommandBuilder()
            .setName('banner')
            .setDescription("🔬 get a user's banner")
            .addSubcommand((subcommand) => subcommand
            .setName('user')
            .setDescription("🔬 a user's banner")
            .addUserOption((option) => option.setName('target').setDescription('the user')))
            .addSubcommand((subcommand) => subcommand.setName('server').setDescription('🔬 the server banner'))
            .toJSON());
        this.developer = true;
    }
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.options.getSubcommand() === 'user') {
                const member = interaction.options.getUser('target') || interaction.user;
                yield member.fetch(true);
                const embed = new discord_js_1.EmbedBuilder()
                    .setColor('Random')
                    .setAuthor({
                    iconURL: member.displayAvatarURL(),
                    name: member.tag,
                })
                    .setImage(member.bannerURL({ size: 2048 }) || null);
                member.bannerURL()
                    ? yield interaction.reply({
                        embeds: [embed],
                    })
                    : interaction.reply("❌ | this user doesn't have a banner");
            }
            else if (interaction.options.getSubcommand() === 'server') {
                if (interaction.inCachedGuild()) {
                    const guild = interaction.guild;
                    const embed = new discord_js_1.EmbedBuilder()
                        .setColor('Random')
                        .setAuthor({
                        iconURL: guild.iconURL() || undefined,
                        name: guild.name,
                    })
                        .setImage(guild.bannerURL({ size: 2048 }));
                    guild.bannerURL()
                        ? yield interaction.reply({
                            embeds: [embed],
                        })
                        : interaction.reply("❌ | this server doesn't have a banner");
                }
            }
        });
    }
}
exports.default = new Banner();
