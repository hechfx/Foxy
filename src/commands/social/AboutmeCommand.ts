import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class ProfileCommand extends Command {
    constructor(client) {
        super(client, {
            name: "aboutme",
            description: "Set your aboutme",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("aboutme")
                .setDescription("[👥 Social] Set your aboutme")
                .addStringOption(option => option.setName("aboutme").setRequired(true).setDescription("The aboutme"))
        });
    }

    async execute(interaction, t) {
        const aboutme = interaction.options.getString("aboutme");
        const userData = await this.client.database.getUser(interaction.user.id);

        userData.aboutme = aboutme;
        userData.save();

        await interaction.editReply(t("commands:aboutme.set", { aboutme: aboutme }));
    }
}