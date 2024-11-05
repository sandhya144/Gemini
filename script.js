
document.addEventListener("DOMContentLoaded", () => {
    const typingForm = document.querySelector(".typing-form");
    const chatList = document.querySelector(".chat-list");

    let userMessage = null;

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

    // //Fetch response from the API based on user message
    // const generateAPIResponse = async (incomingMessageDiv) => {
    //     const response = await fetch(API_URL, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             "prompt": userMessage,
    //             "max_tokens": 50,
    //             "temperature": 0.5,
    //             "top_p": 1,
    //             "frequency_penalty": 0,
    //             "presence_penalty": 0,
    //         }),
    //     });

    //     const data = await response.json();
    //     const generatedText = data.choices[0].text.trim();

    //     incomingMessageDiv.querySelector(".text").innerText = generatedText;
    //     incomingMessageDiv.classList.remove("loading");
    // }
    // generateAPIResponse();

    // Fetch response from the API based on user message
    const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text"); // Getting text element
  
    try {
      // Send a POST request to the API with the user's message
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
      console.log(data); // Log the API response data

    //   if (!response.ok) throw new Error(data.error.message);
  
    //   // Get the API response text and remove asterisks from it
    //   const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    //   showTypingEffect(apiResponse, textElement, incomingMessageDiv); // Show typing effect

    
    } catch (error) { // Handle error
      console.log(error);
    //   isResponseGenerating = false;
    //   textElement.innerText = error.message;
    //   textElement.parentElement.closest(".message").classList.add("error");
    // } finally {
    //   incomingMessageDiv.classList.remove("loading");
    }
  }
  


    // Showing loading animations while waiting for the API response...
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
        chatList.appendChild(incomingMessageDiv); // creating an element of outgoing message and adding it to chat list...

        generateAPIResponse(incomingMessageDiv);
     };
    
    // Handle sending outgoing chat message
    const handleOutgoingChat = () => {
        userMessage = typingForm.querySelector(".typing-input").value.trim();
        if (!userMessage) return; // Exit if there is no message
        console.log(userMessage);

        const html = `<div class="message-content">
            <img src="https://static.vecteezy.com/system/resources/previews/007/069/364/original/3d-user-icon-in-a-minimalistic-style-user-symbol-for-your-website-design-logo-app-ui-vector.jpg" alt="user img" class="image" style="width: 40px; height: 40px">
            <p class="text"></p>
            </div>`;

        const outgoingMessageDiv = createMessageElement(html, "outgoing");
        outgoingMessageDiv.querySelector(".text").innerText = userMessage;
        chatList.appendChild(outgoingMessageDiv); // creating an element of outgoing message and adding it to chat list...

        // creating loading animations..
        typingForm.reset(); // clear input
        setTimeout(showLoadingAnimation, 500); // show animation after a delay..
    };

    // Prevent default form submission and handle outgoing chat
    typingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        handleOutgoingChat();
    });

    // // Handle copying message content to clipboard
    // if (chatList) {
    //     chatList.addEventListener("click", (e) => {
    //         if (e.target.classList.contains("copy")) {
    //             const messageContent = e.target.previousElementSibling.querySelector(".text").innerText;
    //             navigator.clipboard.writeText(messageContent).then(() => {
    //                 alert("Message copied to clipboard!");
    //             }).catch(err => {
    //                 console.error("Failed to copy text: ", err);
    //             });
    //         }
    //     });
    // }
});

