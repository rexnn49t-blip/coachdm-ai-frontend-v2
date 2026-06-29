console.log("CoachDM AI Version 2");
async function generateReply() {

  const message = document.getElementById("message").value;
  const tone = document.getElementById("tone").value;
  const btn = document.querySelector(".generate-btn");

  if (!message.trim()) {
    alert("Please enter a lead message.");
    return;
  }

  btn.innerText = "Generating...";
  btn.disabled = true;

  document.getElementById("resultsSection").style.display = "grid";

  document.getElementById("dmReply").innerText =
    "⏳ Generating AI replies...";

  document.getElementById("followUp").innerText =
    "⏳ Please wait...";

  document.getElementById("booking").innerText =
    "⏳ Please wait...";

  document.getElementById("objection").innerText =
    "⏳ Please wait...";

  document.getElementById("callInvite").innerText =
    "⏳ Please wait...";

  try {

    const response = await fetch(
      "https://coachdm-ai.onrender.com/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          tone
        })
      }
    );

    const data = await response.json();

    const text = data.reply;

    const dm =
      text.match(/DM REPLY:(.*?)(FOLLOW UP:|$)/s);

    const follow =
      text.match(/FOLLOW UP:(.*?)(BOOKING MESSAGE:|$)/s);

    const booking =
      text.match(/BOOKING MESSAGE:(.*?)(OBJECTION HANDLING:|$)/s);

    const objection =
      text.match(/OBJECTION HANDLING:(.*?)(CALL INVITATION:|$)/s);

    const call =
      text.match(/CALL INVITATION:(.*)$/s);

    document.getElementById("dmReply").innerText =
      dm ? dm[1].trim() : "";

    document.getElementById("followUp").innerText =
      follow ? follow[1].trim() : "";

    document.getElementById("booking").innerText =
      booking ? booking[1].trim() : "";

    document.getElementById("objection").innerText =
      objection ? objection[1].trim() : "";

    document.getElementById("callInvite").innerText =
      call ? call[1].trim() : "";

  } catch (error) {

    console.error(error);

    alert("Error generating response");

  }
const history =
  JSON.parse(
    localStorage.getItem("coachHistory")
  ) || [];

history.unshift({
  message: message,
  tone: tone,
  date: new Date().toLocaleString()
});

localStorage.setItem(
  "coachHistory",
  JSON.stringify(history.slice(0,10))
);

loadHistory();
  btn.innerText = "Generate AI Response";
  btn.disabled = false;
}

function copyCard(id, button) {

  const text =
    document.getElementById(id).innerText;

  navigator.clipboard.writeText(text);

  showNotification("Copied successfully!");

  if (button) {

    button.innerText = "✓ Copied";

    setTimeout(() => {
      button.innerText = "Copy";
    }, 2000);

  }

}

function copyAll() {

  const text =
`DM Reply:
${document.getElementById("dmReply").innerText}

Follow Up:
${document.getElementById("followUp").innerText}

Booking Message:
${document.getElementById("booking").innerText}

Objection Handling:
${document.getElementById("objection").innerText}

Call Invitation:
${document.getElementById("callInvite").innerText}`;

  navigator.clipboard.writeText(text);

  showNotification("All responses copied!");

}

function fillExample(text) {

  document.getElementById("message").value =
    text;

}

function showNotification(text){

  const notification =
    document.createElement("div");

  notification.className =
    "notification";

  notification.innerText =
    text;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);

}

document.addEventListener("DOMContentLoaded", () => {

  const messageBox =
    document.getElementById("message");

  const charCount =
    document.getElementById("charCount");

  if (messageBox && charCount) {

    messageBox.addEventListener("input", () => {

      charCount.innerText =
        messageBox.value.length +
        " characters";

    });

  }

  const darkToggle =
    document.getElementById("darkToggle");

  if (darkToggle) {

    darkToggle.addEventListener(
      "click",
      () => {
        document.body.classList.toggle("dark");
      }
    );

  }
loadHistory();
});
function loadHistory(){

  const history =
    JSON.parse(
      localStorage.getItem("coachHistory")
    ) || [];

  const list =
    document.getElementById("historyList");

  if(!list) return;

  list.innerHTML = "";

  history.forEach(item => {

    const div =
      document.createElement("div");

    div.className =
      "history-item";

    div.innerHTML =
      `<strong>${item.date}</strong><br>
       ${item.message.substring(0,80)}...`;

    list.appendChild(div);

  });

}

function clearHistory(){

  localStorage.removeItem(
    "coachHistory"
  );

  loadHistory();

}

function exportResponses() {

  const text =
`DM Reply:
${document.getElementById("dmReply").innerText}

Follow Up:
${document.getElementById("followUp").innerText}

Booking Message:
${document.getElementById("booking").innerText}

Objection Handling:
${document.getElementById("objection").innerText}

Call Invitation:
${document.getElementById("callInvite").innerText}`;

  const blob = new Blob([text], {
    type: "text/plain"
  });

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    "coachdm-response.txt";

  link.click();

  showNotification(
    "Responses exported!"
  );

}