function sendMessage() {
  var userInput = document.getElementById("userInput").value;

  // Clear the input field
  document.getElementById("userInput").value = "";

  // Create a new message element
  var messageElement = document.createElement("div");
  messageElement.className = "message";
  messageElement.textContent = "You: " + userInput;

  // Add the message to the conversation
  document.querySelector(".conversation").appendChild(messageElement);

  // Make a GET request to your backend API with userInput
  // Handle the response and add bot's message to the conversation
}
