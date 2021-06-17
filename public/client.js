const socket = io();
let name;
let textarea = document.querySelector("#textarea");
let feedback = document.querySelector("#feedback");
let messageArea = document.querySelector(".message__area");
do {
  name = prompt("Please enter your name: ");
} while (!name);

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  } else {
    socket.emit("typing", name);
  }
});
textarea.addEventListener("keypress", (e) => {
  socket.emit("typing", name);
});
function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };

  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Send to server
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");
  feedback.innerHTML = "";

  let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Recieve messages
socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
socket.on("typing", function (data) {
  feedback.innerHTML = "<p><em>" + data + " is typing a message...<em></p>";
});
