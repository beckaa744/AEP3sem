const toggleBtn = document.getElementById("chat-toggle");
const chatbox = document.getElementById("chatbox");
const closeBtn = document.getElementById("close-chat");

toggleBtn.onclick = () => {
  chatbox.style.display = "flex";
};

closeBtn.onclick = () => {
  chatbox.style.display = "none";
};