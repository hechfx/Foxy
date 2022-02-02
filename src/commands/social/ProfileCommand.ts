import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";
import GenerateImage from "../../structures/GenerateImage";

export default class ProfileCommand extends Command {
    constructor(client) {
        super(client, {
            name: "profile",
            description: "View your profile",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("profile")
                .setDescription("[👥 Social] View your profile")
                .addUserOption(option => option.setName("user").setRequired(false).setDescription("The user to view"))
        });
    }

    async execute(interaction, t) {
        const user = interaction.options.getUser("user") || interaction.user;
        const userData = await this.client.database.getUser(user.id);
        const canvasGenerator = new GenerateImage(this.client, user, userData, 1436, 884);
        const profile = new MessageAttachment(await canvasGenerator.renderProfile(t), "profile.png");

        await interaction.editReply({ content: t('commands:profile.your'), files: [profile.attachment] });
    }
}