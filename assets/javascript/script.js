const crea =document.querySelector("[data-crea-quiz]")
const container = document.querySelector("[data-quiz-containeer]")
const correggi = document.querySelector("[data-correggi-quiz]")
const nuovoQuiz = document.querySelector("[data-nuovo-quiz]")

function nascondiPulsante(pulsante){
  pulsante.style.display = "none"
}

function numeroCasuale(nelementi) {
  return Math.floor(Math.random() * nelementi);
}

function veroFalso(rispostaContainer, rispostaEsatta, count){
  const checkboxTrue = document.createElement("input");
  checkboxTrue.type = "radio";
  checkboxTrue.name= "r"+ count
  checkboxTrue.id = `risposta-${Math.random().toString(36).substr(2, 9)}`;
  checkboxTrue.setAttribute('data-correct', rispostaEsatta  === "True" ? 'true' : 'false');
  const checkboxFalse = document.createElement("input");
  checkboxFalse.type = "radio";
  checkboxFalse.name= "r"+ count
  checkboxFalse.id = `risposta-${Math.random().toString(36).substr(2, 9)}`;
  checkboxFalse.setAttribute('data-correct', rispostaEsatta  === "False" ? 'true' : 'false');
  const labelTrue = document.createElement("label");
  labelTrue.setAttribute("for", checkboxTrue.id); // Collega l'etichetta alla checkbox tramite l'ID
  labelTrue.textContent = "vero";
  const labelFalse = document.createElement("label");
  labelFalse.setAttribute("for", checkboxFalse.id); // Collega l'etichetta alla checkbox tramite l'ID
  labelFalse.textContent = "falso";
  rispostaContainer.appendChild(labelTrue)
  labelTrue.appendChild(checkboxTrue)
  rispostaContainer.appendChild(labelFalse)
  labelFalse.appendChild(checkboxFalse)
}

function inserisciRisposte(rispostaContainer, unaRisposta, rispostaEsatta, count){
  const checkboxRisposta = document.createElement("input");
  checkboxRisposta.type = "radio";
  checkboxRisposta.name= "r"+ count
  checkboxRisposta.id = `risposta-${Math.random().toString(36).substr(2, 9)}`;
  checkboxRisposta.setAttribute('data-correct', unaRisposta === rispostaEsatta ? 'true' : 'false');
  const labelRisposta = document.createElement("label");
  labelRisposta.setAttribute("for", checkboxRisposta.id); // Collega l'etichetta alla checkbox tramite l'ID
  labelRisposta.textContent = unaRisposta;
  rispostaContainer.appendChild(labelRisposta)
  labelRisposta.appendChild(checkboxRisposta)
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
    nascondiPulsante(crea)
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

function correggiRisposte(contenitoreRisposte, i){
  let rispostaGiustaRadio = document.querySelector(`input[name="r${i}"][data-correct="true"]`)
  let idLabelGiusto = rispostaGiustaRadio.id
  let rispostaGiustaLabel = document.querySelector(`label[for="${idLabelGiusto}"]`)
   let correzione = document.createElement("h3")
   correzione.textContent ="la risposta corretta era: "+ rispostaGiustaLabel.textContent
   contenitoreRisposte[i-1].appendChild(correzione)
}

function controllaRisposte(){
  const contenitoreRisposte = document.querySelectorAll(".-container-risposta")
  let risposteGiuste = 0
  for (let i = 1;i<=10;i++){
    const rispostaSelezionata = document.querySelector(`input[name="r${i}"]:checked` )
    if (rispostaSelezionata == null){
      return alert("non hai selezionato la risposta nella domanda "+i)
    }else if (rispostaSelezionata.getAttribute("data-correct") == "true"){
      risposteGiuste+=1
    } else if (rispostaSelezionata.getAttribute("data-correct") != "true") {
      correggiRisposte(contenitoreRisposte,i)
    } 
  }
  console.log("hai fatto "+risposteGiuste+" risposte giuste")  
  nascondiPulsante(correggi)
  mostraPulsante(nuovoQuiz)
}

function mostraPulsante(pulsante){
pulsante.style.display = "block"
}




crea.addEventListener("click", ()=>{
  creaQuiz()
  mostraPulsante(correggi)
})

correggi.addEventListener("click", ()=>{ 
  controllaRisposte()
 })

nuovoQuiz.addEventListener("click",()=>{
  mostraPulsante(crea)
})

