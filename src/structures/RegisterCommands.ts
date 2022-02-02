import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as fs from 'fs';

export default class RegisterCommands {
    public client: any;
    public clientId: string;
    public token: string;

    constructor(client, clientId, token) {
        this.client = client;
        this.clientId = clientId;
        this.token = token;
    }

    async register(path: string) {
        const commands = [];
        const commandFolders = fs.readdirSync(path);

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(path + `/${folder}`);
            for (const file of commandFiles) {
                const commandFile = await import(`${path}/${folder}/${file}`);
                const command = new commandFile.default(this.client);
                console.info(`[SLASH] - Carregando ${command.config.data.name}`);
                commands.push(command.config.data.toJSON());
            }
        }

        const rest = new REST({ version: '9' }).setToken(this.token);

        (async () => {
            try {
            console.info("Registrando comandos...");

                await rest.put(
                    Routes.applicationGuildCommands(this.clientId, "709847600467148801"),
                    // Se quiser registrar comandos em um servidor específico, basta trocar a função applicationCommands(this.clientId) para applicationGuildCommands(this.clientId, "Id do servidor")
                    { body: commands },
                );

                console.info("[SLASH] - Comandos atualizados!");
                process.exit(1);
            } catch (error) {
                console.error(error);
            }
        })()
    }
}