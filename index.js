import express from 'express';
import ollama from 'ollama';
import cors from 'cors';

const app = express();
const port = 3000;

// Initialize an empty object to store conversation contexts
let conversationContext = {};

app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
    const { question, sessionId } = req.body; // Assuming sessionId is sent by the client

    try {
        // Retrieve the conversation context for the current session
        const context = conversationContext[sessionId] || {};

        // Initialize an empty array for past messages if it doesn't exist
        const pastMessages = Array.isArray(context.messages) ? context.messages : [];
        console.log(question)
        // Send the current question along with the conversation context
        const response = await ollama.chat(
            
            {
            model: 'fratbro',
            messages: [
                { role: 'user', content: question },
                ...pastMessages // Include past messages in the conversation context
            ],
        });

        // Update the conversation context with the latest response
        conversationContext[sessionId] = {
            messages: [
                ...pastMessages,
                response.message // Add the chatbot's response to the conversation context
            ]
        };

        res.json({ response: response.message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
});


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
