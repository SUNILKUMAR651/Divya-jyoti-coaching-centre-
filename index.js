document.addEventListener("DOMContentLoaded", function() {
    let navbar = document.getElementById("navbar");
    window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(51, 51, 51, 0.9)";
        } else {
            navbar.style.background = "#333";
        }
    });
});
let index = 0;
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

function showSlide(n) {
    index = (n + totalSlides) % totalSlides;
    slider.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    showSlide(index + 1);
}

function prevSlide() {
    showSlide(index - 1);
}

setInterval(nextSlide, 3000);
// const OPENROUTER_API_KEY = "ssk-or-v1-e0478496e421d4a6ef33a1d0c267d7ae15bc0151bbda16da5fbc5c458573ce41";
// const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// function toggleChat() {
//     const container = document.getElementById('chatContainer');
//     const button = document.getElementById('chatButton');
//     container.style.display = container.style.display === 'none' ? 'flex' : 'none';
//     button.style.display = container.style.display === 'none' ? 'block' : 'none';
// }

// function appendMessage(message, isUser) {
//     const chatMessages = document.getElementById('chatMessages');
//     const messageDiv = document.createElement('div');
//     messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
//     messageDiv.textContent = message;
//     chatMessages.appendChild(messageDiv);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// }
// async function sendMessage() {
//     const userInput = document.getElementById('userInput');
//     const message = userInput.value.trim();
//     if (!message) return;
//     appendMessage(message, true);
//     userInput.value = '';
//     try {
//         const response = await fetch(OPENROUTER_API_URL, {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 "model": "deepseek/deepseek-chat:free",
//                 "messages": [{
//                     "role": "user",
//                     "content": message
//                 }]
//             })
//         });
//         const data = await response.json();
//         const botResponse = data.choices[0].message.content;
//         appendMessage(botResponse, false);
//     } catch (error) {
//         console.error("Error fetching response from OpenRouter API:", error);
//         appendMessage("Sorry, I encountered an error. Please try again.", false);
//     }
// }
// document.getElementById('userInput').addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') sendMessage();
// });
const API_KEY = 'AIzaSyBE_SHqiTopclvQLPmMGzIB5O-oEgU7xAM'; // replace with your actual Gemini API Key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const chatContainer = document.getElementById('chat-container');
const chatToggle = document.getElementById('chat-toggle');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

chatToggle.addEventListener('click', () => {
    chatContainer.style.display = (chatContainer.style.display === 'flex') ? 'none' : 'flex';
});

async function generateResponse(prompt) {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });

    if (!response.ok) throw new Error('Failed to generate response');
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function cleanMarkdown(text) {
    return text.replace(/#{1,6}\s?/g, '').replace(/\*\*/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');

    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'user.jpg' : 'bot.jpg';
    profileImage.alt = isUser ? 'User' : 'Bot';

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    messageElement.appendChild(profileImage);
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage(userMessage, true);
        userInput.value = '';
        sendButton.disabled = true;
        userInput.disabled = true;

        try {
            const botMessage = await generateResponse(userMessage);
            addMessage(cleanMarkdown(botMessage), false);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, I encountered an error. Please try again.', false);
        } finally {
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus();
        }
    }
}

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});