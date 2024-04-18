import { bot } from "../../";
import config from "../../../config.json";
const setGuildCreateEvent = (): void => {
    bot.events.guildCreate = async (_, guild) => {
        const guildId = guild.id;
        if (guild.toggles.unavailable) {
            return bot.helpers.sendWebhookMessage(config.webhooks.join_leave_guild.id, config.webhooks.join_leave_guild.token, {
                embeds: [{
                    title: `<:emoji:${bot.emotes.FOXY_CRY}> **|** Servidor indisponivel!`,
                    description: `**ID:** ${guild}`,
                }]
            });
        };

        const guildData = bot.database.getGuild(guild.id);
        if (!guildData) {
            setTimeout(() => {
                bot.helpers.sendWebhookMessage(config.webhooks.join_leave_guild.id, config.webhooks.join_leave_guild.token, {
                    embeds: [{
                        title: `<:emoji:${bot.emotes.FOXY_YAY}> **|** Fui adicionada em um servidor!`,
                        description: `**Nome:** ${guild.name}\n**ID:** ${guild.id}`,
                        footer: {
                            text: `Servidor salvo no banco de dados!`
                        }
                    }]
                });
            }, 500);
        }
    }
}

export { setGuildCreateEvent }