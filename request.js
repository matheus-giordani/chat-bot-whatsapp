require('dotenv').config()
const OpenAI = require('openai')
const fs = require('fs')


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function requestOpenAI(question){

    return await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "user",
                "content": `me de os pontos mais importantes dessa conversa em portugues ${question}`
            }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

} 



module.exports = requestOpenAI