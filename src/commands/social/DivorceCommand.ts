import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton } from "discord.js";

export default class DivorceCommand extends Command {
    constructor(client) {
        super(client, {
            name: "divorce",
            description: "Divorce your partner",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("divorce")
                .setDescription("[👥 Social] Divorce your partner")
        });
    }

    async execute(interaction, t) {
        const userData = await this.client.database.getUser(interaction.user.id);
        const marriedId = await userData.marriedWith;

        if(!marriedId) return interaction.editReply(t("commands:divorce.notMarried"));

        const userInfo = await this.client.users.fetch(marriedId);
        const marriedData = await this.client.database.getUser(marriedId);

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("divorce")
            .setLabel(t("commands:divorce.confirm"))
            .setStyle("DANGER")
        )

        interaction.editReply({ content: t('commands:divorce.confirm2', { user: userInfo.username }), actions: [row] });

        const filter = i => i.customId === "divorce" && i.user.id === interaction.user.id;
        const collector = await interaction.channel.createMessageComponentCollector(filter, { max: 1, time: 60000 });

        collector.on("collect", async i => {
            i.deferUpdate();
            userData.marriedWith = null;
            marriedData.marriedWith = null;
            await userData.save();
            await marriedData.save();
            return interaction.followUp(`${this.client.emotes.error} **|** ${t('commands:divorce.divorced')}`);
        });
    }
}