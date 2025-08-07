// DOM Elements
const nameInput = document.getElementById('nameInput');
const roastBtn = document.getElementById('roastBtn');
const loadingSection = document.getElementById('loadingSection');
const resultSection = document.getElementById('resultSection');
const roastContent = document.getElementById('roastContent');
const newRoastBtn = document.getElementById('newRoastBtn');
const errorSection = document.getElementById('errorSection');
const errorText = document.getElementById('errorText');
const retryBtn = document.getElementById('retryBtn');
const inputSection = document.querySelector('.input-section');

// API Configuration
const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'Bearer YOUR_OPENAI_API_KEY'; // Replace with your actual API key
const MODEL = 'gpt-3.5-turbo';
const TEMPERATURE = 1.0; // Increased for more creativity

// Event Listeners
roastBtn.addEventListener('click', handleRoastRequest);
newRoastBtn.addEventListener('click', resetAndShowInput);
retryBtn.addEventListener('click', resetAndShowInput);
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleRoastRequest();
    }
});

// Main function to handle roast request
async function handleRoastRequest() {
    const name = nameInput.value.trim();
    
    // Validation
    if (!name) {
        showError('Please enter a name first! Even if it\'s embarrassing! 😅');
        return;
    }
    
    if (name.length > 50) {
        showError('That name is too long! Keep it simple, like your personality! 😂');
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        const roast = await getRoastFromAI(name);
        showResult(roast);
    } catch (error) {
        console.error('Error getting roast:', error);
        showError('Oops! The AI is having a moment. Maybe it\'s too shocked by your name! 😅');
    }
}

// Function to call OpenAI API
async function getRoastFromAI(name) {
    // Create different roast styles for variety
    const roastStyles = [
        `Roast "${name}" like a stand-up comedian. Make it witty, clever, and absolutely savage. Focus on wordplay and clever insults. Keep it under 200 words.`,
        `Destroy "${name}" with brutal honesty and savage humor. Be creative, unexpected, and absolutely ruthless. Make it memorable and entertaining. Keep it under 200 words.`,
        `Create a hilarious roast for "${name}" that's both clever and cruel. Use creative metaphors, wordplay, and unexpected angles. Make it absolutely savage. Keep it under 200 words.`,
        `Give "${name}" the most brutal, creative, and savage roast possible. Be witty, clever, and absolutely merciless. Use humor that's both smart and savage. Keep it under 200 words.`,
        `Roast "${name}" with maximum creativity and brutality. Make it clever, unexpected, and absolutely devastating. Use wordplay, metaphors, and savage humor. Keep it under 200 words.`,
        `Create a savage roast for "${name}" that's both intelligent and cruel. Be creative, witty, and absolutely ruthless. Make it memorable and entertaining. Keep it under 200 words.`,
        `Destroy "${name}" with the most creative and savage roast possible. Be clever, unexpected, and absolutely merciless. Use humor that's both smart and brutal. Keep it under 200 words.`,
        `Give "${name}" a roast that's both witty and savage. Be creative, clever, and absolutely ruthless. Make it memorable and entertaining. Keep it under 200 words.`
    ];
    
    // Randomly select a roast style
    const randomStyle = roastStyles[Math.floor(Math.random() * roastStyles.length)];
    
    // Add some randomization to make responses even more varied
    const randomTemperature = 0.9 + Math.random() * 0.1; // Between 0.9 and 1.0
    const randomMaxTokens = 250 + Math.floor(Math.random() * 100); // Between 250 and 350
    
    const requestBody = {
        model: MODEL,
        messages: [
            {
                role: 'user',
                content: randomStyle
            }
        ],
        temperature: randomTemperature,
        max_tokens: randomMaxTokens
    };
    
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': API_KEY
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from AI');
    }
    
    return data.choices[0].message.content.trim();
}

// Function to show loading state
function showLoading() {
    hideAllSections();
    loadingSection.style.display = 'block';
    roastBtn.disabled = true;
}

// Function to show result
function showResult(roast) {
    hideAllSections();
    roastContent.textContent = roast;
    resultSection.style.display = 'block';
    roastBtn.disabled = false;
}

// Function to show error
function showError(message) {
    hideAllSections();
    errorText.textContent = message;
    errorSection.style.display = 'block';
    roastBtn.disabled = false;
}

// Function to hide all sections
function hideAllSections() {
    inputSection.style.display = 'none';
    loadingSection.style.display = 'none';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
}

// Function to reset and show input section
function resetAndShowInput() {
    hideAllSections();
    inputSection.style.display = 'block';
    nameInput.value = '';
    nameInput.focus();
    roastBtn.disabled = false;
}

// Add some fun animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Add typing effect to title
    const title = document.querySelector('.title');
    title.style.opacity = '0';
    title.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        title.style.transition = 'all 0.8s ease';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    }, 300);
    
    // Add hover effect to input
    nameInput.addEventListener('focus', () => {
        nameInput.style.transform = 'scale(1.02)';
    });
    
    nameInput.addEventListener('blur', () => {
        nameInput.style.transform = 'scale(1)';
    });
    
    // Add some fun random emojis to the roast button on hover
    roastBtn.addEventListener('mouseenter', () => {
        const emojis = ['🔥', '💀', '😈', '⚡', '💥', '🎭', '🤡', '👻'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        roastBtn.innerHTML = `🔥 ROAST ME! ${randomEmoji} 🔥`;
    });
    
    roastBtn.addEventListener('mouseleave', () => {
        roastBtn.innerHTML = '🔥 ROAST ME! 🔥';
    });
});

// Add some fun easter eggs
let clickCount = 0;
document.querySelector('.title').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        alert('🔥 You really like clicking things, don\'t you? Maybe that\'s why you need this roast! 🔥');
        clickCount = 0;
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to roast
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRoastRequest();
    }
    
    // Escape to reset
    if (e.key === 'Escape') {
        resetAndShowInput();
    }
});

// Add some fun console messages
console.log('🔥 Roast Me AI loaded! 🔥');
console.log('💡 Tips: Press Ctrl+Enter to roast, Escape to reset');
console.log('🎭 Remember: It\'s all in good fun! (mostly) 😈');
