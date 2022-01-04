const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = class TFCCommand extends Command {
    constructor(client) {
        super(client, {
            name: "transfer",
            category: "economy",
            data: new SlashCommandBuilder()
                .setName("transfer")
                .setDescription("[💵 Economy] Transfira FoxCoins para sua pizzaria e vice versa")
                .addSubcommand(command => command.setName("pizzaria").setDescription("[💵 Economy] Transfira FoxCoins para sua pizzaria").addNumberOption(option => option.setName("quantia").setDescription("Quantia para transferir").setRequired(true)))
                .addSubcommand(command => command.setName("foxy").setDescription("[💵 Economy] Transfira FoxCoins para a sua conta da Foxy").addNumberOption(option => option.setName("quantia").setDescription("Quantia a ser transferida").setRequired(true)))
        })
    }

    async execute(interaction) {
        const value = interaction.options.getNumber("quantia");
        const foxcoins = Math.round(value);
        const userData = await this.client.database.getUser(interaction.user.id);
        const data = await this.client.database.getPizzariaInfoById(interaction.user.id);

        if(foxcoins < 200) return interaction.editReply("Você pode transferir acima de 200 FoxCoins");

        switch (interaction.options.getSubcommand()) {
            case "pizzaria": {
                if(userData.balance < foxcoins) return interaction.editReply({ content: "Você não tem coins o suficiente para transferir para fazer isso", ephemeral: true });
                userData.balance -= foxcoins + 100;
                data.foxcoins += foxcoins - 100;
                data.save();-
                userData.save();
                await interaction.editReply(`${this.client.emotes.daily} **|** Você transferiu **${foxcoins}** FoxCoins para a pizzaria  com as taxas fica ${foxcoins - 100} FoxCoins`)
                break;
            }
            
            case "foxy": {
                if(data.foxcoins < foxcoins) return interaction.editReply({ content: "Você não tem coins o suficiente para transferir para fazer isso", ephemeral: true });
                userData.balance += foxcoins - 100;
                data.foxcoins -= foxcoins - 100;
                userData.save();
                data.save();
                await interaction.editReply(`${this.client.emotes.daily} **|** Você transferiu **${foxcoins}** para a sua conta da Foxy com as taxas fica ${foxcoins - 100} FoxCoins`);
            }
        }
    }
}