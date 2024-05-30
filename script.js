document.addEventListener('DOMContentLoaded', () => {
    const askButton = document.getElementById('askButton');
    const userInput = document.getElementById('userInput');
    const conversation = document.getElementById('conversation');

    askButton.addEventListener('click', async () => {
        const question = userInput.value.trim();

        if (question === '') {
            alert('Please enter a question.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question, sessionId: 'uniqueSessionId' }) // Assuming sessionId is sent by the client
            });

            const data = await response.json();

            // Create new paragraph elements for user's question and chatbot's response
            const userQuestion = document.createElement('p');
            userQuestion.textContent = `User: ${question}`;
            
            const chatbotResponse = document.createElement('p');
            chatbotResponse.textContent = `Chatbot: ${data.response}`;

            // Append new conversation content to the conversation container
            conversation.appendChild(userQuestion);
            conversation.appendChild(chatbotResponse);

            // Clear the input field after submitting the question
            userInput.value = '';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
