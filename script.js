let balance = 1000;
function updateBalance(){
  document.getElementById("balance").textContent = balance.toLocaleString() + " MYC";
}
function addTx(text){
  const list=document.getElementById("transactions");
  if(list.children.length===1 && list.children[0].textContent==="No transactions yet.") list.innerHTML="";
  const li=document.createElement("li");
  li.textContent=text;
  list.prepend(li);
}
function send(){
  if(balance<100){
    document.getElementById("message").textContent="Insufficient demo balance.";
    return;
  }
  balance-=100;
  updateBalance();
  addTx("Sent 100 MYC (demo transaction)");
  document.getElementById("message").textContent="100 MYC sent in demo mode.";
}
function receive(){
  balance+=100;
  updateBalance();
  addTx("Received 100 MYC (demo transaction)");
  document.getElementById("message").textContent="100 MYC received in demo mode.";
}
updateBalance();
