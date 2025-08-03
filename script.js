const API_URL = "https://eureka-quizwith-gemini-api.vercel.app/api/answer";

const hintText = "男は以前、漂流して人肉を食べさせられた経験がある。";
const answerText = "男は漂流で人肉を食べさせられ、その味をスープで思い出し泣いた。";

const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

document.getElementById("hintBtn").addEventListener("click", () => {
  alert(`ヒント:\n${hintText}`);
});

document.getElementById("answerBtn").addEventListener("click", () => {
  if (confirm("本当に答えを表示しますか？")) {
    alert(`答え:\n${answerText}`);
  }
});

function appendMessage(text, className) {
  const p = document.createElement("p");
  p.textContent = text;
  p.className = className;
  chatLog.appendChild(p);
  chatLog.scrollTop = chatLog.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;

  appendMessage(`あなた: ${question}`, "user");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);

    const data = await res.json();
    appendMessage(`ウミガメAI: ${data.answer}`, "bot");
  } catch (err) {
    appendMessage(`エラー: ${err.message}`, "bot");
  }

  chatInput.value = "";
});
