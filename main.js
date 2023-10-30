const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const requestOpenAI = require('./request.js');

const listGroups = process.env.GROUP_NAMES.split(',')

const client = new Client({ authStrategy: new LocalAuth(), puppeteer: {
    args: ['--no-sandbox'],
} });

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    const chat = await message.getChat()
    const contact = await message.getContact()
    console.log(chat.unreadCount, new Date(message.timestamp * 1000), chat.name, message.body, contact.name, contact.id);

    if (listGroups.includes(chat.name)) {
        fs.appendFileSync(`logs/${chat.name}.log`, `${new Date(message.timestamp * 1000)} - ${contact.name}: ${message.body}\n`)

        if (chat.unreadCount >= 20) {
            const file = fs.readFileSync(`logs/${chat.name}.log`, { encoding: 'utf8', flag: 'r' })
            requestOpenAI(file).then(async (response) => {


                client.sendMessage('5511972553036@c.us',
                    `${response.choices[0].message.content}`)
                    .then(() => {
                        try {
                            fs.unlinkSync(`logs/${chat.name}.log`)
                            chat.sendSeen();
                        }
                        catch (error) {




                        }

                    })

            })
        }
    }
});


client.initialize();
