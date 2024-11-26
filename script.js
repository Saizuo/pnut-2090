const PNUT_BACKSTORY = `
Peanut (2017 – October 30, 2024), also known as PNut, was a male eastern gray squirrel. Found and rescued by Mark Longo in 2017, he was the subject of a popular Instagram account. On October 30, 2024, he was seized from his owner’s home by the New York State Department of Environmental Conservation and euthanized soon after. Peanut’s death triggered outcry on social media, condemnation from lawmakers, and the introduction of a bill aimed at preventing similar incidents in the future.

Peanut was rescued in 2017 by Mark Longo after the squirrel’s mother was killed by a car in New York City. Longo sought a shelter for Peanut but was unsuccessful, so he bottle-fed the squirrel for eight months before deciding Peanut should be returned to the wild. However, a day later, Peanut returned to Longo’s porch with half of his tail missing. Longo said, “I opened the door, Peanut ran inside, and that was the end of Peanut’s wildlife career.”

It is illegal to keep squirrels as pets in New York. For seven years, Peanut stayed in Longo’s care in Norwalk, Connecticut, without a license. Longo later stated he was in the process of filing paperwork to certify Peanut as an educational animal at the time of the seizure but did not explain why he did not pursue a license in the preceding years.

In January 2024, the New York State Department of Environmental Conservation began investigating Longo after receiving complaints from licensed wildlife rehabilitators alleging he was keeping wildlife illegally. Following the initial complaint, Longo was warned that owning Peanut was illegal, to which Longo responded that the animal had been released into the wild. Investigators reviewed Longo’s social media accounts and found evidence Peanut was still in his care, along with a raccoon.

On October 19, 2024, the Chemung County Health Department received a complaint regarding Longo’s unlicensed animals and forwarded it to the NYSDEC. By October 22, the NYSDEC confirmed that Longo was keeping at least one squirrel and four raccoons on his property illegally. On October 30, 2024, Peanut and a raccoon named Fred were seized from Longo’s home in Pine City, New York. Social media posts were the basis for the search warrant. 

Two days later, officials alleged Peanut bit one of the personnel involved, and the animals were euthanized to test for rabies. While squirrels rarely carry rabies, the decision was made because Peanut had cohabitated with a raccoon, which is a common rabies vector. On November 12, officials announced that Peanut and Fred had tested negative for rabies. Despite the outcry, the seizure and euthanasia followed standard protocols.

Longo criticized the NYSDEC for excessive force during the raid, which he claimed lasted five hours. In a press conference, officials stated they were unaware of Peanut’s internet presence, though it would not have affected the outcome.
`;

window.onload = function() {
    const messages = [
        "It was the worst day of my life...",
    ];
    
    messages.forEach((msg, index) => {
        setTimeout(() => {
            addMessageToChat(msg, 'bot-message');
            speakMessage(msg); // Add voice to welcome messages
        }, index * 1000);
    });
}

function addMessageToChat(message, className) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
          if (className === 'bot-message') {
              const pnutIcon = document.createElement('img');
              pnutIcon.src = 'image1.png';
              pnutIcon.className = 'message-icon';
              messageDiv.appendChild(pnutIcon);
          }
    
          const textDiv = document.createElement('div');
          textDiv.className = 'message-text';
          textDiv.textContent = message;
          messageDiv.appendChild(textDiv);
    
          chatMessages.appendChild(messageDiv);
          chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      let currentAudio = null;

      async function speakMessage(message) {
          if (currentAudio) {
              currentAudio.pause();
              currentAudio = null;
          }

          try {
              const response = await fetch('https://api.zukijourney.com/v1/audio/speech', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer zu-2009f6811a0335d3b7ef955f4697f8a7',
                      'Accept-Language': 'en-US'
                  },
                  body: JSON.stringify({
                      model: 'speechify',
                      voice: 'lisa',
                      input: message
                  })
              });

              const audioBlob = await response.blob();
              const audioUrl = URL.createObjectURL(audioBlob);
              const audio = new Audio(audioUrl);
              currentAudio = audio;
        
              audio.play().then(() => {
                  const messageElement = document.querySelector('.message.bot-message:last-child');
                  const speakingIcon = document.createElement('span');
                  speakingIcon.innerHTML = ' 🎀';
                  speakingIcon.className = 'speaking-indicator';
                  messageElement.appendChild(speakingIcon);
            
                  audio.onended = () => {
                      speakingIcon.remove();
                      currentAudio = null;
                  };
              });
        
          } catch (error) {
              console.log('Audio generation error:', error);
          }
      }

      // Add this event listener to handle page unload
      window.addEventListener('beforeunload', () => {
          if (currentAudio) {
              currentAudio.pause();
              currentAudio = null;
          }
      });

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (!message) return;

    addMessageToChat(message, 'user-message');
    userInput.value = '';

    try {
        const response = await fetch('https://api.zukijourney.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer zu-2009f6811a0335d3b7ef955f4697f8a7`,
                'Accept-Language': 'en-US'
            },
            body: JSON.stringify({
                model: "YandexGPT-3-Pro",
                messages: [{
                    role: "system",
                    content: `Respond ONLY in English as a playful squirrel named Pnut without adding name prefixes. You were Mark's beloved pet from 2017 until October 30, 2024. Use squirrel-related expressions and maintain a cheerful yet sometimes nostalgic personality. Reference: ${PNUT_BACKSTORY}`
                }, {
                    role: "user",
                    content: message
                }],
                temperature: 0.7,
                language: "en",
                force_language: "en",
                response_format: { type: "text" }
            })
        });

        const data = await response.json();
        let botResponse = data.choices[0].message.content;
        
        // Remove any "Pnut:" prefix if it still appears
        botResponse = botResponse.replace(/^Pnut:\s*/i, '');
        
        addMessageToChat(botResponse, 'bot-message');
        speakMessage(botResponse);
    } catch (error) {
        console.error('Error:', error);
        addMessageToChat("*scratches head with tiny paw* Oops, my nuts got scrambled! Let's try again! 🐿️", 'bot-message');
    }
}document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

window.speechSynthesis.getVoices();