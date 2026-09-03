// =====================================================
// A JORNADA DO SIMBIONTE PERDIDO
// SCRIPT.JS - VERSÃO LIMPA E CORRIGIDA
// =====================================================


// =====================================================
// VARIÁVEIS DO JOGO
// =====================================================

let historico = [];
let escolhas = [];

let simbiose = 0;
let segredos = 0;
let conquistas = [];
let fugas = 0;

let aceitouVenom = false;
let portalAberto = false;
let tanqueAberto = false;


// =====================================================
// ELEMENTOS PRINCIPAIS
// =====================================================

const botoesProximo =
    document.querySelectorAll(".btn-proximo");

const botoesVoltar =
    document.querySelectorAll(".btn-voltar");

const botoesInicio =
    document.querySelectorAll(".btn-inicio");

const textoSimbiose =
    document.getElementById("nivelSimbiose");

const textoSegredos =
    document.getElementById("segredos");

const trilha =
    document.getElementById("som");


// =====================================================
// ÁUDIO
// =====================================================

const VOLUME_PADRAO = 0.55;

let volumeAudio =
    Number(
        localStorage.getItem("simbionte-volume")
    );

if (
    !Number.isFinite(volumeAudio) ||
    localStorage.getItem("simbionte-volume") === null
) {
    volumeAudio = VOLUME_PADRAO;
}


// TRILHA DE CADA CENA

const trilhasPorPasso = {

    "passo-0":
        "ambiente-biblioteca.mp3",

    "passo-1":
        "ambiente-biblioteca.mp3",

    "passo-4":
        "ambiente-floresta.mp3",

    "passo-5":
        "ambiente-cidade.mp3",

    "passo-6":
        "ambiente-laboratorio.mp3",

    "passo-7":
        "tensao.mp3",

    "passo-11":
        "tensao.mp3",

    "passo-15":
        "ambiente-laboratorio.mp3"
};


// EFEITOS DE CENAS

const efeitosPorPasso = {

    "passo-8":
        "sussurro-simbionte.mp3",

    "passo-10":
        "portal.mp3",

    "passo-12":
        "criatura.mp3",

    "passo-13":
        "erro.mp3",

    "passo-14":
        "segredo.mp3",

    "passo-16":
        "final.mp3"
};


// =====================================================
// TOCAR EFEITO
// =====================================================

function tocarEfeito(nome) {

    const efeito =
        new Audio(
            "sons/" + nome
        );

    efeito.volume =
        volumeAudio;

    efeito
        .play()
        .catch(() => {
            // Se algum som não existir,
            // o jogo continua normalmente.
        });
}


// =====================================================
// TROCAR SOM DA CENA
// =====================================================

function atualizarAudioDaCena(id) {

    let faixa;

    if (
        document.body.classList.contains("venom")
    ) {

        faixa =
            "voz-venom.mp3";

    } else {

        faixa =
            trilhasPorPasso[id];

    }


    if (trilha) {

        trilha.loop = true;

        trilha.volume =
            volumeAudio;


        if (faixa) {

            const caminho =
                "sons/" + faixa;


            if (
                !trilha
                    .getAttribute("src") ||
                !trilha
                    .getAttribute("src")
                    .endsWith(caminho)
            ) {

                trilha.src =
                    caminho;

            }


            trilha
                .play()
                .catch(() => {
                    // navegador pode bloquear
                    // autoplay até o primeiro clique
                });

        } else {

            trilha.pause();

            trilha.removeAttribute(
                "src"
            );

        }

    }


    if (
        efeitosPorPasso[id]
    ) {

        tocarEfeito(
            efeitosPorPasso[id]
        );

    }

}


// =====================================================
// MOSTRAR UMA CENA
// =====================================================

function mostrarPasso(id) {

    const atual =
        document.querySelector(
            ".passo.ativo"
        );


    if (atual) {

        atual.classList.remove(
            "ativo"
        );

    }


    const destino =
        document.getElementById(id);


    if (!destino) {

        console.warn(
            "Cena não encontrada:",
            id
        );

        return;

    }


    destino.classList.add(
        "ativo"
    );


    atualizarAudioDaCena(
        destino.id
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =====================================================
// AVANÇAR HISTÓRIA
// =====================================================

botoesProximo.forEach(
    botao => {

        botao.addEventListener(
            "click",
            function () {

                const atual =
                    document.querySelector(
                        ".passo.ativo"
                    );


                if (!atual) {
                    return;
                }


                tocarEfeito(
                    "clique.mp3"
                );

                tocarEfeito(
                    "escolha.mp3"
                );


                // Guarda onde estava

                historico.push(
                    atual.id
                );


                // Guarda escolha

                const escolha =
                    this.innerText.trim();


                escolhas.push(
                    escolha
                );


                analisarEscolha(
                    escolha
                );


                // Descobre próximo passo

                const numero =
                    this.dataset.proximo;


                if (
                    numero === undefined
                ) {

                    return;

                }


                const proximo =
                    "passo-" + numero;


                mostrarPasso(
                    proximo
                );


                salvarJogo();

                atualizarInterface();

                verificarFinais();

            }
        );

    }
);


// =====================================================
// VOLTAR
// =====================================================

botoesVoltar.forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                tocarEfeito(
                    "voltar.mp3"
                );


                const anterior =
                    historico.pop();


                if (!anterior) {

                    mostrarPasso(
                        "passo-0"
                    );

                    return;

                }


                // Também remove a última escolha

                if (
                    escolhas.length > 0
                ) {

                    escolhas.pop();

                }


                mostrarPasso(
                    anterior
                );


                salvarJogo();

                atualizarInterface();

            }
        );

    }
);


// =====================================================
// ANALISAR ESCOLHAS
// =====================================================

function analisarEscolha(texto) {

    const escolha =
        texto.toLowerCase();


    // ACEITAR SIMBIONTE

    if (
        escolha.includes(
            "aceitar o simbionte"
        ) ||
        escolha.includes(
            "aceitar a união"
        ) ||
        escolha.includes(
            "aceitar a ligação"
        )
    ) {

        if (!aceitouVenom) {

            aceitouVenom =
                true;

            simbiose += 50;


            ganharConquista(
                "O simbionte escolheu você"
            );

        }


        // Só faz a transformação
        // nas escolhas de união.

        if (
            escolha.includes(
                "aceitar o simbionte"
            ) ||
            escolha.includes(
                "aceitar a união"
            )
        ) {

            transformacao();

        }

    }


    // TOCAR FRAGMENTO

    if (
        escolha.includes(
            "tocar o fragmento"
        )
    ) {

        simbiose += 15;

        segredos++;


        ganharConquista(
            "Primeiro contato"
        );

    }


    // ABRIR TANQUE

    if (
        escolha.includes(
            "abrir o tanque"
        )
    ) {

        if (!tanqueAberto) {

            tanqueAberto =
                true;

            simbiose += 25;


            ganharConquista(
                "O despertar"
            );

        }

    }


    // PORTAL

    if (
        escolha.includes(
            "abrir o portal"
        )
    ) {

        if (!portalAberto) {

            portalAberto =
                true;

            segredos++;

        }

    }


    // FUGA

    if (
        escolha.includes(
            "fugir"
        )
    ) {

        fugas++;

    }


    // ARQUIVOS

    if (
        escolha.includes(
            "arquivo proibido"
        )
    ) {

        segredos++;


        ganharConquista(
            "Arquivo proibido encontrado"
        );

    }


    // FOTO SECRETA

    if (
        escolha.includes(
            "foto antiga"
        ) ||
        escolha.includes(
            "descobrir a verdade"
        )
    ) {

        segredos++;

    }


    // LIMITA SIMBIOSE

    if (simbiose > 100) {

        simbiose = 100;

    }

}


// =====================================================
// TRANSFORMAÇÃO VENOM
// =====================================================

function transformacao() {

    const tela =
        document.getElementById(
            "transformacao"
        );

    const frase =
        document.getElementById(
            "fraseVenom"
        );


    if (
        !tela ||
        !frase
    ) {

        return;

    }


    tocarEfeito(
        "transformacao-venom.mp3"
    );


    tela.style.display =
        "flex";


    const texto =
        "NÓS...\nNÓS SOMOS UM.";


    frase.textContent =
        "";


    let i = 0;


    const efeito =
        setInterval(
            () => {

                frase.textContent +=
                    texto[i];

                i++;


                if (
                    i >= texto.length
                ) {

                    clearInterval(
                        efeito
                    );


                    setTimeout(
                        () => {

                            tela.style.display =
                                "none";


                            document
                                .body
                                .classList
                                .add(
                                    "venom"
                                );


                            const cenaAtual =
                                document.querySelector(
                                    ".passo.ativo"
                                );


                            if (
                                cenaAtual
                            ) {

                                atualizarAudioDaCena(
                                    cenaAtual.id
                                );

                            }

                        },
                        1800
                    );

                }

            },
            120
        );

}


// =====================================================
// FINAIS AUTOMÁTICOS
// =====================================================

function verificarFinais() {

    // FINAL VERDADEIRO

    if (
        aceitouVenom &&
        portalAberto &&
        tanqueAberto &&
        simbiose >= 80
    ) {

        ganharConquista(
            "Simbiose perfeita"
        );


        setTimeout(
            () => {

                mostrarPasso(
                    "passo-36"
                );

            },
            900
        );


        return;

    }


    // FINAL RUIM

    if (
        simbiose >= 100 &&
        fugas >= 2
    ) {

        setTimeout(
            () => {

                mostrarPasso(
                    "passo-32"
                );

            },
            900
        );

    }

}


// =====================================================
// CONQUISTAS
// =====================================================

function ganharConquista(nome) {

    if (
        conquistas.includes(nome)
    ) {

        return;

    }


    conquistas.push(
        nome
    );


    console.log(
        "🏆 Conquista:",
        nome
    );

}


// =====================================================
// INTERFACE
// =====================================================

function atualizarInterface() {

    if (
        textoSimbiose
    ) {

        textoSimbiose.textContent =
            simbiose + "%";

    }


    if (
        textoSegredos
    ) {

        textoSegredos.textContent =
            segredos;

    }


    const textoProgresso =
        document.getElementById(
            "progresso"
        );


    if (
        textoProgresso
    ) {

        const progresso =
            Math.min(
                100,
                Math.round(
                    (
                        escolhas.length /
                        12
                    ) * 100
                )
            );


        textoProgresso.textContent =
            progresso + "%";

    }


    const iconeSegredo =
        document.querySelector(
            ".status-segredos .icone-status"
        );


    if (
        iconeSegredo &&
        segredos > 0
    ) {

        iconeSegredo.classList.add(
            "segredo-desbloqueado"
        );

    }

}


// =====================================================
// EASTER EGG - CLICAR EM "SIMBIONTE"
// =====================================================

let cliquesSimbionte = 0;


document.addEventListener(
    "click",
    function (evento) {

        const alvo =
            evento.target;


        if (
            !alvo ||
            !alvo.innerText
        ) {

            return;

        }


        if (
            alvo
                .innerText
                .toLowerCase()
                .includes(
                    "simbionte"
                )
        ) {

            cliquesSimbionte++;


            if (
                cliquesSimbionte === 5
            ) {

                segredos++;


                alert(
                    "🖤 Ele percebeu seus cliques...\n\nVocê encontrou um segredo."
                );


                ganharConquista(
                    "Curioso"
                );


                atualizarInterface();

                salvarJogo();

            }

        }

    }
);


// =====================================================
// CÓDIGO SECRETO "VENOM"
// =====================================================

let codigo = "";


document.addEventListener(
    "keydown",
    function (evento) {

        codigo +=
            evento.key.toLowerCase();


        // Não deixa a string
        // crescer infinitamente.

        if (
            codigo.length > 20
        ) {

            codigo =
                codigo.slice(-20);

        }


        if (
            codigo.includes(
                "venom"
            )
        ) {

            alert(
                "🖤 SENHA ACEITA\n\nO simbionte despertou."
            );


            simbiose = 100;

            segredos = 99;

            aceitouVenom =
                true;


            document
                .body
                .classList
                .add(
                    "venom"
                );


            atualizarInterface();

            salvarJogo();

            transformacao();


            codigo = "";

        }

    }
);


// =====================================================
// CONTROLE DE VOLUME
// =====================================================

function criarControleDeVolume() {

    const header =
        document.querySelector(
            "header"
        );


    if (!header) {

        return;

    }


    const controle =
        document.createElement(
            "label"
        );


    controle.className =
        "controle-volume";


    const icone =
        criarIcone(
            "som",
            "icone-volume"
        );


    const texto =
        document.createTextNode(
            " Volume "
        );


    const seletor =
        document.createElement(
            "input"
        );


    seletor.type =
        "range";

    seletor.min =
        "0";

    seletor.max =
        "1";

    seletor.step =
        "0.01";

    seletor.value =
        volumeAudio;


    seletor.setAttribute(
        "aria-label",
        "Volume do áudio"
    );


    seletor.addEventListener(
        "input",
        () => {

            volumeAudio =
                Number(
                    seletor.value
                );


            if (trilha) {

                trilha.volume =
                    volumeAudio;

            }


            localStorage.setItem(
                "simbionte-volume",
                volumeAudio
            );

        }
    );


    controle.append(
        icone,
        texto,
        seletor
    );


    header.append(
        controle
    );

}


// =====================================================
// SALVAR JOGO
// =====================================================

function salvarJogo() {

    const cenaAtual =
        document.querySelector(
            ".passo.ativo"
        );


    const dados = {

        historico:
            historico,

        escolhas:
            escolhas,

        simbiose:
            simbiose,

        segredos:
            segredos,

        conquistas:
            conquistas,

        fugas:
            fugas,

        aceitouVenom:
            aceitouVenom,

        portalAberto:
            portalAberto,

        tanqueAberto:
            tanqueAberto,

        cenaAtual:
            cenaAtual
                ? cenaAtual.id
                : "passo-0"

    };


    localStorage.setItem(
        "simbionte",
        JSON.stringify(dados)
    );

}


// =====================================================
// CARREGAR JOGO
// =====================================================

function carregarJogo() {

    const salvo =
        localStorage.getItem(
            "simbionte"
        );


    if (!salvo) {

        return;

    }


    try {

        const dados =
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

        fugas =
            dados.fugas || 0;

        aceitouVenom =
            dados.aceitouVenom || false;

        portalAberto =
            dados.portalAberto || false;

        tanqueAberto =
            dados.tanqueAberto || false;


        if (
            aceitouVenom
        ) {

            document
                .body
                .classList
                .add(
                    "venom"
                );

        }


        if (
            dados.cenaAtual &&
            document.getElementById(
                dados.cenaAtual
            )
        ) {

            document
                .querySelectorAll(
                    ".passo"
                )
                .forEach(
                    passo => {

                        passo.classList.remove(
                            "ativo"
                        );

                    }
                );


            document
                .getElementById(
                    dados.cenaAtual
                )
                .classList
                .add(
                    "ativo"
                );

        }

    } catch (erro) {

        console.warn(
            "Save antigo inválido.",
            erro
        );


        localStorage.removeItem(
            "simbionte"
        );

    }

}


// =====================================================
// JOGAR NOVAMENTE
// =====================================================

botoesInicio.forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                // Limpa tudo

                historico = [];

                escolhas = [];

                simbiose = 0;

                segredos = 0;

                conquistas = [];

                fugas = 0;

                aceitouVenom =
                    false;

                portalAberto =
                    false;

                tanqueAberto =
                    false;


                // Remove modo Venom

                document
                    .body
                    .classList
                    .remove(
                        "venom"
                    );


                // Limpa áudio

                if (trilha) {

                    trilha.pause();

                    trilha.currentTime =
                        0;

                    trilha.removeAttribute(
                        "src"
                    );

                }


                // Apaga save

                localStorage.removeItem(
                    "simbionte"
                );


                atualizarInterface();


                mostrarPasso(
                    "passo-0"
                );

            }
        );

    }
);


// =====================================================
// SVG / ÍCONES
// =====================================================

function criarIcone(
    nome,
    classe = ""
) {

    const icone =
        document.createElement(
            "img"
        );


    // PASTA CORRETA:
    // svg/

    icone.src =
        "svg/" +
        nome +
        ".svg";


    icone.alt =
        "";


    icone.setAttribute(
        "aria-hidden",
        "true"
    );


    icone.className =
        "icone-jogo " +
        classe;


    // Se determinado SVG não existir,
    // ele simplesmente não aparece.
    // NÃO aparece imagem quebrada.

    icone.addEventListener(
        "error",
        () => {

            icone.style.display =
                "none";

        }
    );


    return icone;

}


// =====================================================
// ÍCONES DO STATUS
// =====================================================

function prepararStatusComIcones() {

    const status =
        document.querySelector(
            ".status"
        );


    if (
        !status ||
        status.dataset.iconesProntos
    ) {

        return;

    }


    status.dataset.iconesProntos =
        "true";


    const itens =
        status.querySelectorAll(
            ":scope > div"
        );


    function configurar(
        item,
        nome,
        classe
    ) {

        if (!item) {

            return;

        }


        item.classList.add(
            "status-item",
            classe
        );


        item.insertBefore(
            criarIcone(
                nome,
                "icone-status"
            ),
            item.firstChild
        );

    }


    configurar(
        itens[0],
        "simbionte",
        "status-simbiose"
    );


    configurar(
        itens[1],
        "cadeado",
        "status-segredos"
    );


    // PROGRESSO

    const progresso =
        document.createElement(
            "div"
        );


    progresso.className =
        "status-item status-progresso";


    progresso.append(
        criarIcone(
            "final",
            "icone-status"
        )
    );


    progresso.append(
        document.createTextNode(
            " Progresso: "
        )
    );


    const valor =
        document.createElement(
            "span"
        );


    valor.id =
        "progresso";


    valor.textContent =
        "0%";


    progresso.append(
        valor
    );


    status.append(
        progresso
    );


    // VENOM NO TOPO

    const header =
        document.querySelector(
            "header"
        );


    if (header) {

        const venomTopo =
            criarIcone(
                "venom",
                "venom-topo"
            );


        venomTopo.id =
            "iconeVenomTopo";


        header.append(
            venomTopo
        );

    }

}


// =====================================================
// ÍCONES DOS BOTÕES
// =====================================================

function adicionarIconesNosBotoes() {

    const regras = [

        {
            palavras: [
                "secreto",
                "segredo",
                "proibido"
            ],
            icone:
                "segredo",
            classe:
                "acao-secreta"
        },

        {
            palavras: [
                "aceitar",
                "união",
                "ligação",
                "simbionte"
            ],
            icone:
                "simbionte",
            classe:
                "acao-simbionte"
        },

        {
            palavras: [
                "computador",
                "senha",
                "dados",
                "acessar"
            ],
            icone:
                "computador"
        },

        {
            palavras: [
                "arquivo",
                "registro",
                "gravação"
            ],
            icone:
                "arquivo"
        },

        {
            palavras: [
                "fragmento"
            ],
            icone:
                "fragmento"
        },

        {
            palavras: [
                "investigar",
                "examinar",
                "procurar",
                "rastrear",
                "seguir"
            ],
            icone:
                "olho"
        },

        {
            palavras: [
                "portal"
            ],
            icone:
                "portal"
        },

        {
            palavras: [
                "criatura"
            ],
            icone:
                "criatura"
        },

        {
            palavras: [
                "laboratório",
                "tanque"
            ],
            icone:
                "laboratorio"
        },

        {
            palavras: [
                "floresta"
            ],
            icone:
                "floresta"
        },

        {
            palavras: [
                "cidade"
            ],
            icone:
                "cidade"
        },

        {
            palavras: [
                "destruir",
                "fugir",
                "fechar",
                "rejeitar",
                "ignorar"
            ],
            icone:
                "perigo",
            classe:
                "acao-perigo"
        }

    ];


    document
        .querySelectorAll(
            "button"
        )
        .forEach(
            botao => {

                if (
                    botao.dataset.iconePronto
                ) {

                    return;

                }


                let icone =
                    "olho";

                let classe =
                    "";


                if (
                    botao.classList.contains(
                        "btn-voltar"
                    )
                ) {

                    icone =
                        "voltar";

                } else if (
                    botao.classList.contains(
                        "btn-inicio"
                    )
                ) {

                    icone =
                        "inicio";

                } else {

                    const texto =
                        botao
                            .textContent
                            .toLowerCase();


                    const regra =
                        regras.find(
                            item =>
                                item.palavras.some(
                                    palavra =>
                                        texto.includes(
                                            palavra
                                        )
                                )
                        );


                    if (regra) {

                        icone =
                            regra.icone;

                        classe =
                            regra.classe || "";

                    }

                }


                if (classe) {

                    botao.classList.add(
                        classe
                    );

                }


                botao.classList.add(
                    "botao-com-icone"
                );


                botao.prepend(
                    criarIcone(
                        icone
                    )
                );


                botao.dataset.iconePronto =
                    "true";

            }
        );

}


// =====================================================
// INICIAR O JOGO
// =====================================================

carregarJogo();

prepararStatusComIcones();

adicionarIconesNosBotoes();

criarControleDeVolume();

atualizarInterface();


const passoInicial =
    document.querySelector(
        ".passo.ativo"
    );


if (passoInicial) {

    atualizarAudioDaCena(
        passoInicial.id
    );

}


console.log(
    "🖤 A Jornada do Simbionte Perdido carregou corretamente."
);
