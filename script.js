const API_URL = "https://eureka-quizwith-gemini-api.vercel.app/api/answer";

let quizzes = [];

const quizSelect = document.getElementById("quizSelect");
const hintBtn = document.getElementById("hintBtn");
const answerBtn = document.getElementById("answerBtn");
const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

// JSONファイル読み込み＆セレクトボックスに反映
async function loadQuizzes() {
  try {
    const res = await fetch("problems.json");
    if (!res.ok) throw new Error("問題データの読み込みに失敗しました");
    quizzes = await res.json();

    quizzes.forEach((quiz, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = quiz.title;
      quizSelect.appendChild(option);
    });
  } catch (err) {
    alert(err.message);
  }
}

function appendMessage(text, className) {
  const p = document.createElement("p");
  p.textContent = text;
  p.className = className;
  chatLog.appendChild(p);
  chatLog.scrollTop = chatLog.scrollHeight;
}

hintBtn.addEventListener("click", () => {
  const idx = quizSelect.selectedIndex;
  if (quizzes.length === 0) {
    alert("問題が読み込まれていません");
    return;
  }
  alert(`ヒント:\n${quizzes[idx].hint}`);
});

answerBtn.addEventListener("click", () => {
  if (confirm("本当に答えを表示しますか？")) {
    const idx = quizSelect.selectedIndex;
    alert(`答え:\n${quizzes[idx].answer}`);
  }
});

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

// ページロード時に問題を読み込み
loadQuizzes();
