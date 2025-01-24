const crea =document.querySelector("[data-crea-quiz]")
const container = document.querySelector("[data-quiz-containeer]")
const correggi = document.querySelector("[data-correggi-quiz]")

function nascondiPulsante(){
  crea.style.display = "none"
}

function numeroCasuale(nelementi) {
  return Math.floor(Math.random() * nelementi);
}

function veroFalso(rispostaContainer, rispostaEsatta, count){
  const checkboxTrue = document.createElement("input");
  checkboxTrue.type = "radio";
  checkboxTrue.name= count
  checkboxTrue.id = `risposta-${Math.random().toString(36).substr(2, 9)}`;
  checkboxTrue.setAttribute('data-correct', rispostaEsatta  === "True" ? 'true' : 'false');
  const checkboxFalse = document.createElement("input");
  checkboxFalse.type = "radio";
  checkboxFalse.name= count
  checkboxFalse.id = `risposta-${Math.random().toString(36).substr(2, 9)}`;
  checkboxFalse.setAttribute('data-correct', rispostaEsatta  === "False" ? 'true' : 'false');
  const labelTrue = document.createElement("label");
  labelTrue.setAttribute("for", checkboxTrue.id); // Collega l'etichetta alla checkbox tramite l'ID
  labelTrue.textContent = "vero";
  const labelFalse = document.createElement("label");
  labelFalse.setAttribute("for", checkboxFalse.id); // Collega l'etichetta alla checkbox tramite l'ID
  labelFalse.textContent = "falso";
  rispostaContainer.appendChild(labelTrue)
  rispostaContainer.appendChild(checkboxTrue)
  rispostaContainer.appendChild(labelFalse)
  rispostaContainer.appendChild(checkboxFalse)
}

function inserisciRisposte(rispostaContainer, unaRisposta, rispostaEsatta, count){
  const checkboxRisposta = document.createElement("input");
  checkboxRisposta.type = "radio";
  checkboxRisposta.name= count
  checkboxRisposta.id = `risposta-${Math.random().toString(36).substr(2, 9)}`;
  checkboxRisposta.setAttribute('data-correct', unaRisposta === rispostaEsatta ? 'true' : 'false');
  const labelRisposta = document.createElement("label");
  labelRisposta.setAttribute("for", checkboxRisposta.id); // Collega l'etichetta alla checkbox tramite l'ID
  labelRisposta.textContent = unaRisposta;
  rispostaContainer.appendChild(labelRisposta)
  rispostaContainer.appendChild(checkboxRisposta)
}


function rispostaMultipla(rispostaContainer, risposta, count){
 let risposteTutte =[risposta.correct_answer, risposta.incorrect_answers[0],risposta.incorrect_answers[1], risposta.incorrect_answers[2]] 
 for (let i = risposteTutte.length; i > 0; i--) {
  let n = numeroCasuale(i); 
  inserisciRisposte(rispostaContainer, risposteTutte[n],risposta.correct_answer, count)
  risposteTutte.splice(n, 1);
}
}


function creaDomanda(risposta, counter){
  container.style.display="block"
  let domandaContainer = document.createElement("div")
  domandaContainer.className=("domanda-container")
  container.appendChild(domandaContainer)
  let domanda = document.createElement("p")
  domanda.className=("domanda")
  domandaContainer.appendChild(domanda)
  domanda.textContent= `${counter+1}. ${risposta[counter].question}` 
  let rispostaContainer=document.createElement("div")
  rispostaContainer.className="-container-risposta"
  domandaContainer.appendChild(rispostaContainer)
  if(risposta[counter].type == "boolean"){
    veroFalso(rispostaContainer, risposta[counter].correct_answer,counter+1)
  } else if(risposta[counter].type == "multiple"){
    rispostaMultipla(rispostaContainer, risposta[counter], counter+1)
  }
}


async function getDomanda(response){
for(let i = 0; i<response.data.results.length;i++){
  creaDomanda(response.data.results, i)
}
}
async function creaQuiz() {
  try {
    nascondiPulsante()
    const result = await axios.get("https://opentdb.com/api.php?amount=10");
      getDomanda(result)
  } catch (error) {
    if (error.response && error.response.status === 429) {
      setTimeout(()=>{
       creaQuiz()
      }, 100)
      console.log("Troppe richieste, prova più tardi.");
    } else {
      console.error("Errore durante la richiesta:", error.message);
    }
  }
}


crea.addEventListener("click", ()=>{
  creaQuiz()
})

correggi.addEventListener("click", ()=>{
  const risposteSelezionate = document.querySelectorAll('input[type="radio"]:checked');
  let risposteGiuste = 0
  risposteSelezionate.forEach(function(Element){
    if(Element.getAttribute("data-correct") == "true"){
      risposteGiuste+=1
    }
  })
  console.log(risposteGiuste)
})