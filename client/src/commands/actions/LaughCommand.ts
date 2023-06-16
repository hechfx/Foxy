import { createCommand } from '../../structures/commands/createCommand';
import { createEmbed } from '../../utils/discord/Embed';
import { bot } from '../..';

const embed = createEmbed({});

const LaughCommand = createCommand({
    name: 'laugh',
    nameLocalizations: {
        'pt-BR': 'rir'
    },
    description: '[Roleplay] * giggles *',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] * risadas *"
    },
    category: 'roleplay',

    execute: async (context, endCommand, t) => {
        const laughGif: any = await context.getImage("laugh");
        embed.title = t('commands:laugh.success', { author: await bot.foxyRest.getUserDisplayName(context.author.id) }),
            embed.image = {
                url: laughGif.url
            }

        context.sendReply({
            embeds: [embed],
        })
        endCommand();
    }
});

export default LaughCommand;