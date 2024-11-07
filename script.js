
document.addEventListener("DOMContentLoaded", () => {
  const typingForm = document.querySelector(".typing-form");
  const chatList = document.querySelector(".chat-list");

  let userMessage = null;
  let isRequestInProgress = false;

  // API Configuration
  const API_KEY = "AIzaSyC2xOUHd_L3K05HqzXFaBNso9VcQgGocHg";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;


  // Create a new message element and return it..
  const createMessageElement = (content, ...classes) => {
      const div = document.createElement("div");
      div.classList.add("message", ...classes);
      div.innerHTML = content;
      return div;
  };

  // Show typing effect
  const showTypingEffect = (text, textElement) => {
      const words = text.split(' ');
      let currentWordIndex = 0;

      const typingInterval = setInterval(() => {
          textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
          if (currentWordIndex === words.length) {
              clearInterval(typingInterval);
          }
      }, 75);
  };

  // Fetch response from the API based on user message
  const generateAPIResponse = async (incomingMessageDiv) => {
      const textElement = incomingMessageDiv.querySelector(".text");

      try {
          const response = await fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  contents: [{
                      role: "user",
                      parts: [{ text: userMessage }]
                  }]
              }),
          });

          const data = await response.json();
          const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
          showTypingEffect(apiResponse, textElement);

      } catch (error) {
          console.error('Error:', error);
          textElement.innerText = "Error fetching response. Please try again.";
      } finally {
          incomingMessageDiv.classList.remove("loading");
          isRequestInProgress = false; // Reset the flag
      }
  };


// Copy message text to the clipboard
const copyMessage = (copyButton) => {
    const messageTextElement = copyButton.parentElement.querySelector(".text");
    if (messageTextElement) {
        const messageText = messageTextElement.innerText;

        navigator.clipboard.writeText(messageText).then(() => {
            // Change the icon to check-circle after copying
            copyButton.classList.add("fa-check-circle");  // Add check-circle class
            copyButton.classList.remove("fa-copy");  // Remove the original copy icon class

            setTimeout(() => {
                // Reset the icon back to the original copy icon after a short delay
                copyButton.classList.add("fa-copy");  // Restore the copy icon
                copyButton.classList.remove("fa-check-circle");  // Remove check-circle icon
            }, 1000); // Adjust the delay as needed
        }).catch(err => console.error("Copy failed", err));
    } else {
        console.error("No message text found to copy.");
    }
};


  // Show loading animation
  const showLoadingAnimation = () => {
      const html = `<div class="message-content">
          <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_red_4ed1cbfcbc6c9e84c31b987da73fc4168aec8445.svg" alt="gemini img" class="image" style="width: 40px; height: 40px">
          <p class="text"></p>
          <div class="loading-indicator">
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
          </div>
          </div>
          <i class="copy fa-regular fa-copy"></i>`;

      const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
      chatList.appendChild(incomingMessageDiv);

      // Attach copy event listener directly
    const copyButton = incomingMessageDiv.querySelector(".copy");
    if (copyButton) {
        copyButton.addEventListener("click", () => copyMessage(copyButton));
    }


       // Simulate loading and remove loading class once done
    generateAPIResponse(incomingMessageDiv).then(() => {
        incomingMessageDiv.classList.remove("loading"); // Hide loading bar after loading completes
    });
};


  // Handle sending outgoing chat message
  const handleOutgoingChat = () => {
      if (isRequestInProgress) return;
      isRequestInProgress = true;

      userMessage = typingForm.querySelector(".typing-input").value.trim();
      if (!userMessage) {
          isRequestInProgress = false;
          return;
      }

      const html = `<div class="message-content">
          <img src="https://static.vecteezy.com/system/resources/previews/007/069/364/original/3d-user-icon-in-a-minimalistic-style-user-symbol-for-your-website-design-logo-app-ui-vector.jpg" alt="user img" class="image" style="width: 40px; height: 40px">
          <p class="text"></p>
          </div>`;

      const outgoingMessageDiv = createMessageElement(html, "outgoing");
      outgoingMessageDiv.querySelector(".text").innerText = userMessage;
      chatList.appendChild(outgoingMessageDiv);

      typingForm.reset();
      document.body.classList.add("hide-header");
      setTimeout(showLoadingAnimation, 500);  // Show loading animation after a delay
  };


  // Select the form and the submit button
const form = document.querySelector(".typing-form");
const submitButton = form.querySelector(".fa-arrow-up-from-bracket");

// JavaScript to toggle the theme between light and dark mode
const themeToggleButton = document.getElementById('themeToggleButton');
const body = document.body;

// Check if there's a saved theme preference in localStorage
const savedTheme = localStorage.getItem('theme');

// Apply the theme based on the saved preference or default to dark mode
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>'; // Sun icon for light mode
} else {
    body.classList.add('dark-mode');
    themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>'; // Moon icon for dark mode
}

// Add event listener to toggle the theme
themeToggleButton.addEventListener('click', () => {
    // Toggle between light and dark mode classes
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');

    // Toggle the icon based on the theme
    if (body.classList.contains('light-mode')) {
        themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon for dark mode
        localStorage.setItem('theme', 'light'); // Save light mode to localStorage
    } else {
        themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for light mode
        localStorage.setItem('theme', 'dark'); // Save dark mode to localStorage
    }
});


// Delete Button Functionality
const deleteButton = document.getElementById("deleteButton");

deleteButton.addEventListener("click", (event) => {
    // Prevent form submission
    event.preventDefault();

    // Clear all chat messages
    const chatList = document.querySelector(".chat-list");
    chatList.innerHTML = "";
});



// Form Submission for Sending Message
form.addEventListener("submit", (event) => {
    // Only send message if the submit button was clicked
    if (event.submitter === submitButton) {
        event.preventDefault(); // Prevent default submission
        // Add your message-sending logic here
        console.log("Message sent!");
    } else {
        // Prevent submission for other buttons
        event.preventDefault();
    }
});

// Prevent default form submission and handle outgoing chat
  typingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleOutgoingChat();
  });
});


