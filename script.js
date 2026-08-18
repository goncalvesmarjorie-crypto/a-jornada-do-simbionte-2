// =================================================
// A JORNADA DO SIMBIONTE PERDIDO
// SCRIPT.JS 2.0
// =================================================


// ===============================
// VARIÁVEIS DO JOGO
// ===============================


let historico = [];

let escolhas = [];

let simbiose = 0;

let segredos = 0;

let conquistas = [];

let fugas = 0;

let aceitouVenom = false;

let portalAberto = false;

let tanqueAberto = false;




// ===============================
// ELEMENTOS
// ===============================


const botoesProximo =
document.querySelectorAll(".btn-proximo");


const botoesVoltar =
document.querySelectorAll(".btn-voltar");



const textoSimbiose =
document.getElementById("nivelSimbiose");


const textoSegredos =
document.getElementById("segredos");





// ===============================
// INICIAR JOGO
// ===============================


carregarJogo();

atualizarInterface();






// ===============================
// AVANÇAR HISTÓRIA
// ===============================


botoesProximo.forEach(botao=>{


botao.addEventListener("click",function(){



let atual =
document.querySelector(".ativo");



if(!atual)return;

tocarEfeito("clique.mp3");
tocarEfeito("escolha.mp3");




// guarda caminho

historico.push(atual.id);



// guarda escolha

let escolha =
this.innerText;



escolhas.push(escolha);



analisarEscolha(escolha);



// próximo passo

let proximo =
"passo-" +
this.dataset.proximo;



atual.classList.remove("ativo");



let destino =
document.getElementById(proximo);



if(destino){

destino.classList.add("ativo");

atualizarAudioDaCena(destino.id);

}




salvarJogo();


atualizarInterface();



verificarFinais();



});



});








// ===============================
// BOTÃO VOLTAR
// ===============================


botoesVoltar.forEach(botao=>{


botao.addEventListener("click",()=>{

tocarEfeito("voltar.mp3");


let atual =
document.querySelector(".ativo");



if(atual)
atual.classList.remove("ativo");



let anterior =
historico.pop();



if(anterior){


document
.getElementById(anterior)
.classList.add("ativo");

atualizarAudioDaCena(anterior);


}



});

});









// ===============================
// ANALISAR ESCOLHAS
// ===============================


function analisarEscolha(texto){



if(texto.includes("Aceitar o simbionte")){


aceitouVenom=true;

simbiose+=50;

transformacao();


ganharConquista(
"O simbionte escolheu você"
);



}



if(texto.includes("tocar")){


simbiose+=15;

segredos++;

ganharConquista(
"Primeiro contato"
);



}



if(texto.includes("Abrir o tanque")){


tanqueAberto=true;

simbiose+=25;


ganharConquista(
"O despertar"
);



}



if(texto.includes("portal") ||
texto.includes("Portal")){


portalAberto=true;

segredos++;


}



if(texto.includes("Fugir")){


fugas++;


}



if(texto.includes("arquivo") ||
texto.includes("Arquivo")){


segredos++;

ganharConquista(
"Arquivo proibido encontrado"
);



}



}









// ===============================
// TRANSFORMAÇÃO VENOM
// ===============================



function transformacao(){



let tela =
document.getElementById(
"transformacao"
);



let frase =
document.getElementById(
"fraseVenom"
);



if(!tela)return;

tocarEfeito("transformacao-venom.mp3");



tela.style.display="flex";



let texto =
"NÓS...\nNÓS SOMOS UM.";




frase.textContent="";



let i=0;



let efeito =
setInterval(()=>{


frase.textContent += texto[i];


i++;


if(i>=texto.length){


clearInterval(efeito);



setTimeout(()=>{


tela.style.display="none";


document.body.classList.add(
"venom"
);

const cenaAtual = document.querySelector(".ativo");

if(cenaAtual) atualizarAudioDaCena(cenaAtual.id);



},2500);



}



},150);



}










// ===============================
// FINAIS
// ===============================



function verificarFinais(){



// FINAL VERDADEIRO


if(

aceitouVenom &&
portalAberto &&
tanqueAberto &&
simbiose>=80

){



setTimeout(()=>{


irParaFinal(
"passo-36"
);



},1000);



ganharConquista(
"Simbiose perfeita"
);



}





// FINAL RUIM


if(

simbiose>=100 &&
fugas>=2

){


setTimeout(()=>{


irParaFinal(
"passo-32"
);



},1000);



}





}







function irParaFinal(id){


let atual =
document.querySelector(".ativo");



if(atual)
atual.classList.remove("ativo");



let final =
document.getElementById(id);



if(final)
final.classList.add("ativo");



}









// ===============================
// CONQUISTAS
// ===============================



function ganharConquista(nome){



if(!conquistas.includes(nome)){


conquistas.push(nome);



console.log(
"🏆 Conquista:",
nome
);



}

}




// ===============================
// INTERFACE
// ===============================



function atualizarInterface(){



if(textoSimbiose)

textoSimbiose.innerHTML =
simbiose+"%";



if(textoSegredos)

textoSegredos.innerHTML =
segredos;



const textoProgresso = document.getElementById("progresso");

if(textoProgresso){

textoProgresso.textContent = Math.min(100, Math.round((escolhas.length / 12) * 100))+"%";

}



const iconeSegredo = document.querySelector(".status-segredos .icone-status");

if(iconeSegredo && segredos > 0){

iconeSegredo.classList.add("segredo-desbloqueado");

}



}









// ===============================
// EASTER EGGS
// ===============================


let cliques=0;



document.addEventListener(
"click",
function(e){



if(

e.target.innerText &&

e.target.innerText
.toLowerCase()
.includes("simbionte")

){



cliques++;



if(cliques===5){


segredos++;



alert(

"🖤 Ele percebeu seus cliques...\n\nVocê encontrou um segredo."

);



ganharConquista(
"Curioso"
);



atualizarInterface();



}



}



});









// ===============================
// CÓDIGO SECRETO VENOM
// ===============================


let codigo="";



document.addEventListener(
"keydown",
function(e){



codigo +=
e.key.toLowerCase();



if(codigo.includes("venom")){



alert(

"🖤 SENHA ACEITA\n\nO simbionte despertou."

);



simbiose=100;


segredos=99;



document.body.classList.add(
"venom"
);



transformacao();



codigo="";



}



});








// ===============================
// SOM
// ===============================



const trilha = document.getElementById("som");
const VOLUME_PADRAO = 0.55;
let volumeAudio = Number(localStorage.getItem("simbionte-volume"));

if(!Number.isFinite(volumeAudio) || localStorage.getItem("simbionte-volume") === null) volumeAudio = VOLUME_PADRAO;

const trilhasPorPasso = {
  "passo-0": "ambiente-biblioteca.mp3",
  "passo-1": "ambiente-biblioteca.mp3",
  "passo-4": "ambiente-floresta.mp3",
  "passo-5": "ambiente-cidade.mp3",
  "passo-6": "ambiente-laboratorio.mp3",
  "passo-7": "tensao.mp3",
  "passo-11": "tensao.mp3",
  "passo-15": "tensao.mp3"
};

const efeitosPorPasso = {
  "passo-8": "sussurro-simbionte.mp3",
  "passo-10": "portal.mp3",
  "passo-12": "criatura.mp3",
  "passo-13": "erro.mp3",
  "passo-14": "segredo.mp3",
  "passo-16": "final.mp3"
};

function tocarEfeito(nome){
  const efeito = new Audio("audio/" + nome);
  efeito.volume = volumeAudio;
  efeito.play().catch(()=>{});
}

function atualizarAudioDaCena(id){
  const faixa = document.body.classList.contains("venom")
    ? "voz-venom.mp3"
    : trilhasPorPasso[id];

  if(trilha){
    trilha.loop = true;
    trilha.volume = volumeAudio;

    if(faixa && !trilha.src.endsWith("audio/" + faixa)){
      trilha.src = "audio/" + faixa;
      trilha.play().catch(()=>{});
    } else if(!faixa){
      trilha.pause();
      trilha.removeAttribute("src");
    }
  }

  if(efeitosPorPasso[id]) tocarEfeito(efeitosPorPasso[id]);
}

function criarControleDeVolume(){
  const controle = document.createElement("label");
  controle.className = "controle-volume";
  controle.innerHTML = "🔊 Volume <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" aria-label=\"Volume do áudio\">";
  controle.prepend(criarIcone("som", "icone-volume"));

  const seletor = controle.querySelector("input");
  seletor.value = volumeAudio;
  seletor.addEventListener("input", ()=>{
    volumeAudio = Number(seletor.value);
    if(trilha) trilha.volume = volumeAudio;
    localStorage.setItem("simbionte-volume", volumeAudio);
  });

  document.querySelector("header").append(controle);
}

criarControleDeVolume();

const passoInicial = document.querySelector(".ativo");
if(passoInicial) atualizarAudioDaCena(passoInicial.id);









// ===============================
// SALVAR PROGRESSO
// ===============================



function salvarJogo(){


localStorage.setItem(

"simbionte",

JSON.stringify({

historico,
escolhas,
simbiose,
segredos,
conquistas

})

);



}









// ===============================
// CARREGAR
// ===============================



function carregarJogo(){


let salvo =
localStorage.getItem(
"simbionte"
);



if(salvo){


let dados =
JSON.parse(salvo);



historico =
dados.historico || [];


escolhas =
dados.escolhas || [];


simbiose =
dados.simbiose || 0;


segredos =
dados.segredos || 0;


conquistas =
dados.conquistas || [];



}

}







console.log(
"🖤 Sistema do Simbionte 2.0 carregado..."
);
// =====================================
// BOTÃO JOGAR NOVAMENTE
// =====================================


const botoesInicio =
document.querySelectorAll(".btn-inicio");



botoesInicio.forEach(botao=>{


    botao.addEventListener("click",()=>{


        // tira tela atual

        const atual =
        document.querySelector(".ativo");


        if(atual){

            atual.classList.remove("ativo");

        }



        // volta para começo

        document
        .getElementById("passo-0")
        .classList.add("ativo");



        // limpa memória

        historico = [];

        escolhas = [];

        simbiose = 0;

        segredos = 0;

        conquistas = [];

        fugas = 0;



        aceitouVenom = false;

        portalAberto = false;

        tanqueAberto = false;



        // remove modo venom

        document.body.classList.remove(
            "venom"
        );



        if(trilha){

            trilha.pause();

            trilha.currentTime = 0;

        }



        atualizarAudioDaCena("passo-0");



        // apaga save

        localStorage.removeItem(
            "simbionte"
        );



        atualizarInterface();



    });


});



// =====================================
// ÍCONES DA INTERFACE
// =====================================



function criarIcone(nome, classe=""){

const icone = document.createElement("img");

icone.src = "icons/"+nome+".svg";

icone.alt = "";

icone.setAttribute("aria-hidden", "true");

icone.className = "icone-jogo "+classe;

return icone;

}



function prepararStatusComIcones(){

const status = document.querySelector(".status");

if(!status || status.dataset.iconesProntos) return;

status.dataset.iconesProntos = "true";

const itens = status.querySelectorAll("div");

const configurar = (item, nome, classe, texto)=>{

if(!item) return;

const textoOriginal = Array.from(item.childNodes).find(no=>no.nodeType === Node.TEXT_NODE);

if(textoOriginal) textoOriginal.textContent = " "+texto+" ";

item.classList.add("status-item", classe);

item.insertBefore(criarIcone(nome, "icone-status"), item.firstChild);

};

configurar(itens[0], "simbionte", "status-simbiose", "Simbiose:");

configurar(itens[1], "cadeado", "status-segredos", "Segredos:");

const progresso = document.createElement("div");

progresso.className = "status-item status-progresso";

progresso.append(criarIcone("final", "icone-status"), document.createTextNode(" Progresso: "));

const valor = document.createElement("span");

valor.id = "progresso";

valor.textContent = "0%";

progresso.append(valor);

status.append(progresso);

const venomTopo = criarIcone("venom", "venom-topo");

venomTopo.id = "iconeVenomTopo";

document.querySelector("header").append(venomTopo);

}



function adicionarIconesNosBotoes(){

const regras = [

{palavras:["secreto", "segredo", "proibido"], icone:"segredo", classe:"acao-secreta"},

{palavras:["aceitar", "união", "ligação", "simbionte"], icone:"simbionte", classe:"acao-simbionte"},

{palavras:["computador", "senha", "dados", "acessar"], icone:"computador"},

{palavras:["arquivo", "registro", "gravação"], icone:"arquivo"},

{palavras:["fragmento"], icone:"fragmento"},

{palavras:["investigar", "examinar", "procurar", "rastrear", "seguir"], icone:"olho"},

{palavras:["portal"], icone:"portal"},

{palavras:["criatura"], icone:"criatura"},

{palavras:["laboratório", "tanque"], icone:"laboratorio"},

{palavras:["floresta"], icone:"floresta"},

{palavras:["cidade"], icone:"cidade"},

{palavras:["destruir", "fugir", "fechar", "rejeitar", "ignorar"], icone:"perigo", classe:"acao-perigo"}

];

document.querySelectorAll("button").forEach(botao=>{

if(botao.dataset.iconePronto) return;

let icone = "olho";

let classe = "";

if(botao.classList.contains("btn-voltar")){

icone = "voltar";

}else if(botao.classList.contains("btn-inicio")){

icone = "inicio";

}else{

const texto = botao.textContent.toLowerCase();

const regra = regras.find(item=>item.palavras.some(palavra=>texto.includes(palavra)));

if(regra){

icone = regra.icone;

classe = regra.classe || "";

}

}

botao.classList.add("botao-com-icone", classe);

botao.prepend(criarIcone(icone));

botao.dataset.iconePronto = "true";

});

}



prepararStatusComIcones();

adicionarIconesNosBotoes();

atualizarInterface();
