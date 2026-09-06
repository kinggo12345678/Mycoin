const START_BALANCE = 1000;
const TX_KEY = "mycoin_demo_transactions";
const BALANCE_KEY = "mycoin_demo_balance";
let balance = Number(localStorage.getItem(BALANCE_KEY));
if (!Number.isFinite(balance) || balance < 0) balance = START_BALANCE;

function save(){
  localStorage.setItem(BALANCE_KEY, String(balance));
}
function updateBalance(){
  document.getElementById("balance").textContent = balance.toLocaleString() + " MYC";
}
function getTransactions(){
  try { return JSON.parse(localStorage.getItem(TX_KEY)) || []; }
  catch { return []; }
}
function saveTransactions(items){
  localStorage.setItem(TX_KEY, JSON.stringify(items.slice(0, 20)));
}
function renderTransactions(){
  const list = document.getElementById("transactions");
  const items = getTransactions();
  list.innerHTML = "";
  if (!items.length){
    list.innerHTML = '<li class="empty">No transactions yet.</li>';
    return;
  }
  items.forEach(tx => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${tx.type === "receive" ? "📥 Received" : "📤 Sent"} ${tx.amount} MYC</span><span>${tx.time}</span>`;
    list.appendChild(li);
  });
}
function addTx(type, amount){
  const items = getTransactions();
  items.unshift({type, amount, time: new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})});
  saveTransactions(items);
  renderTransactions();
}
function setMessage(text){
  document.getElementById("message").textContent = text;
}
function send(){
  if(balance < 100){
    setMessage("Insufficient demo balance.");
    return;
  }
  balance -= 100;
  save();
  updateBalance();
  addTx("send", 100);
  setMessage("100 MYC sent successfully in demo mode.");
}
function receive(){
  balance += 100;
  save();
  updateBalance();
  addTx("receive", 100);
  setMessage("100 MYC received successfully in demo mode.");
}
function clearHistory(){
  localStorage.removeItem(TX_KEY);
  renderTransactions();
  setMessage("Transaction history cleared.");
}
updateBalance();
renderTransactions();
