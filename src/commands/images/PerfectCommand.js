const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Canvas = require("canvas");

module.exports = class PerfectCommand extends Command {
    constructor(client) {
        super(client, {
            name: "perfect",
            category: "image",
            data: new SlashCommandBuilder()
                .setName("perfect")
                .setDescription("Existe algo perfeito?")
                .addUserOption(option => option.setName("user").setDescription("Mencione um usuário").setRequired(false))
        })
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        const canvas = Canvas.createCanvas(467, 400);
        const ctx = canvas.getContext('2d');

        var avatar;
        if (!user) {
            avatar = this.client.user.displayAvatarURL({ format: "png", size: 1024 });
        } else {
            avatar = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        }

        const background = await canvas.loadImage("./src/assets/perfeito.png");
        ctx.drawImage(background, 0, 0, 467, 400);

        const userAvatar = await canvas.loadImage(avatar);
        ctx.drawImage(userAvatar, 400 - 177, 30 + 20, 400 - 178, 400 - 179)

        const attachment = new MessageAttachment(canvas.toBuffer(), 'pf.png');

        await interaction.reply({ files: [attachment] });
    }
}