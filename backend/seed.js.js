const db = require("./db");

const decks = {
  "Português": [
    ["O que caracteriza a variação linguística diastrática?", "É a variação ligada a grupos sociais — gírias, jargões profissionais, linguagem de faixa etária."],
    ["Diferença entre coesão e coerência?", "Coesão é a ligação gramatical entre as partes do texto; coerência é o sentido lógico que o texto constrói como um todo."],
    ["O que é um período composto por subordinação?", "Período em que uma oração depende sintaticamente da outra (uma é termo/complemento da principal)."],
    ["O que é variação diacrônica?", "É a mudança da língua ao longo do tempo — palavras e usos que surgem, mudam de sentido ou caem em desuso entre gerações."],
    ["Como reconhecer ambiguidade sintática num título ou manchete?", "Quando a ordem das palavras permite mais de uma leitura — geralmente resolvida reorganizando a frase ou acrescentando pontuação/preposição."],
    ["Quando ocorre a crase?", "Quando há, ao mesmo tempo, uma palavra que exige a preposição 'a' e um substantivo feminino que aceitaria o artigo 'a' antes dele."],
    ["O que é regência verbal?", "É a relação entre o verbo e seus complementos, definindo se e qual preposição deve ser usada (ex: 'assistir ao filme')."],
    ["O que é uma oração coordenada assindética?", "Oração coordenada que se liga à outra sem o uso de conjunção, apenas por vírgula."],
  ],
  "Literatura": [
    ["O que é o 'carpe diem' no Arcadismo?", "Tema literário que convida a aproveitar o presente, já que a beleza e a vida são passageiras — muito usado por Tomás Antônio Gonzaga e Gregório de Matos."],
    ["O que caracteriza a fase satírica de Gregório de Matos?", "Críticas ácidas aos costumes e à sociedade baiana da época, com ironia e linguagem direta — por isso ele é apelidado de 'Boca do Inferno'."],
    ["O que é o Barroco na literatura brasileira?", "Estilo marcado pelo conflito entre razão e fé, prazer e culpa (fusão de espiritual e material), com jogo de contrastes e rebuscamento de linguagem."],
    ["O que é uma epopeia (poema épico), como 'O Uraguai' ou 'Caramuru'?", "Poema narrativo longo que celebra feitos heroicos ou fundadores de um povo/nação, geralmente dividido em cantos."],
    ["O que é o fugere urbem no Arcadismo?", "Tema de fuga da vida urbana em busca da simplicidade da vida no campo, associado ao bucolismo."],
    ["O que é cultismo (no Barroco)?", "Um dos dois estilos do Barroco, caracterizado pelo jogo de palavras, metáforas complexas e rebuscamento formal da linguagem."],
  ],
  "História": [
    ["O que foi o Plano Cruzado (1986)?", "Pacote econômico do governo Sarney que criou uma nova moeda (o cruzado) e congelou preços para tentar conter a inflação."],
    ["Quem eram os patrícios na Roma monárquica?", "Os grandes proprietários de terra, com privilégios políticos e religiosos — formavam a elite da sociedade romana."],
    ["O que caracterizou os governos de caudilhos na América Latina?", "Lideranças fortes e autoritárias (por voto ou força) que geriam os conflitos sociais pós-independência com mão dura."],
    ["Qual foi a principal proposta de campanha de Fernando Collor (1989)?", "Discurso de modernização e combate à corrupção — a chamada 'caça aos marajás' do serviço público."],
    ["O que foi a Cortina de Ferro?", "Fronteira ideológica que dividia a Europa capitalista da Europa comunista durante a Guerra Fria, simbolizada pelo Muro de Berlim."],
    ["O que foi o Império do Mali?", "Um dos grandes reinos do Sudão Ocidental, prosperou através do comércio transaariano de ouro e sal, com Tombuctu como centro cultural."],
  ],
  "Geografia": [
    ["O que foi a 'Cortina de Ferro'?", "Fronteira ideológica e física que dividia a Europa Ocidental (capitalista) da Europa Oriental (comunista) durante a Guerra Fria."],
    ["O que é migração pendular?", "Deslocamento diário entre município de moradia e de trabalho/estudo, com retorno para casa no mesmo dia."],
    ["O que define um refugiado climático/ambiental?", "Pessoa forçada a deixar seu local de origem por eventos climáticos ou ambientais que colocam em risco sua vida ou condições básicas."],
    ["O que é georreferenciamento?", "Técnica cartográfica que associa uma informação a uma localização geográfica exata na superfície terrestre."],
    ["O que é uma escala cartográfica?", "A relação entre a distância representada no mapa e a distância real — ex: 1:100.000 significa 1 cm no mapa = 1 km na realidade."],
    ["O que é conurbação?", "Fenômeno em que cidades vizinhas crescem até se conectar fisicamente, formando uma malha urbana contínua."],
  ],
  "Matemática": [
    ["Fórmula de Bhaskara", "x = (−b ± √(b²−4ac)) / 2a, usada para encontrar as raízes de uma equação do 2º grau."],
    ["O que é PA (Progressão Aritmética)?", "Sequência em que cada termo é obtido somando uma razão constante ao termo anterior."],
    ["Teorema de Pitágoras", "Em um triângulo retângulo, a² = b² + c², onde a é a hipotenusa."],
    ["Como encontrar o vértice (ponto de mínimo/máximo) de uma função quadrática?", "x do vértice = −b/2a; substitua esse valor na função para achar o y do vértice (valor mínimo ou máximo)."],
    ["O que é o Sistema de Amortização Constante (SAC)?", "Sistema de financiamento em que o valor amortizado é igual em todas as parcelas (capital dividido pelo nº de parcelas), com juros decrescentes."],
    ["Fórmula do termo geral de uma PG", "aₙ = a₁ · q^(n−1), onde q é a razão da progressão geométrica."],
    ["Diferença entre juros simples e compostos?", "Juros simples incidem sempre sobre o capital inicial; juros compostos incidem sobre o capital acumulado (juros sobre juros)."],
    ["Como calcular a soma dos n primeiros termos de uma PA?", "Sₙ = (a₁ + aₙ) · n / 2."],
  ],
  "Biologia": [
    ["O que é mitose?", "Divisão celular que gera duas células-filhas geneticamente idênticas à célula-mãe."],
    ["Função da membrana plasmática", "Controlar a entrada e saída de substâncias da célula, mantendo a homeostase."],
    ["Qual a diferença entre as hipóteses de Oparin e Haldane sobre a origem da vida?", "Ambos propõem origem química da vida, mas divergem na fonte de carbono das biomoléculas iniciais."],
    ["O que acontece na fase clara da fotossíntese?", "A luz quebra a molécula de água (fotólise, no fotossistema II) liberando elétrons usados para produzir ATP e NADPH."],
    ["O que é um ecótono?", "Zona de transição entre dois ecossistemas diferentes, como o encontro das águas entre o Rio Negro e o Solimões."],
    ["O que é meiose?", "Divisão celular que gera quatro células com metade do material genético, usada na formação de gametas."],
    ["O que foi o experimento de Miller e Urey (1953)?", "Recriou em laboratório as condições da atmosfera primitiva e obteve aminoácidos, reforçando a hipótese de Oparin e Haldane."],
  ],
  "Química": [
    ["O que faz um catalisador numa reação química?", "Diminui a energia de ativação, abrindo um novo caminho para a reação e acelerando-a sem ser consumido no processo."],
    ["O que é um agente oxidante?", "Espécie que ganha elétrons numa reação, causando a oxidação de outra substância — seu número de oxidação diminui."],
    ["Lei da conservação da massa (Lavoisier)", "Em um sistema fechado, a massa total dos reagentes é igual à massa total dos produtos formados."],
    ["O que é uma ligação covalente?", "Ligação química em que os átomos compartilham pares de elétrons — comum entre não-metais."],
    ["Qual a ordem histórica dos modelos atômicos?", "Dalton → Thomson → Rutherford → Bohr."],
  ],
  "Física": [
    ["O que diz a primeira lei da Termodinâmica?", "A energia não pode ser criada nem destruída, apenas transformada — é a lei da conservação de energia aplicada a sistemas térmicos."],
    ["Como calcular a velocidade final em queda livre?", "v² = v₀² + 2·g·h (partindo do repouso, v₀ = 0), usando g = 10 m/s² e h a altura da queda."],
    ["Direção e sentido da força de atrito ao caminhar/subir uma ladeira", "Paralela ao piso e no mesmo sentido do movimento — é o atrito que nos impulsiona para frente."],
    ["O que diz a Segunda Lei de Newton?", "F = m · a — a força resultante é igual à massa vezes a aceleração do objeto."],
    ["O que diz a Terceira Lei de Newton?", "Para toda ação existe uma reação de mesma intensidade e direção, mas sentido oposto."],
  ],
};

const resumos = [
  {
    materia: "História",
    titulo: "Amazônia no período colonial",
    pontos: [
      "Ocupação portuguesa tardia em relação ao litoral",
      "Papel das drogas do sertão na economia regional",
      "Missões religiosas e o trabalho indígena",
    ],
  },
  {
    materia: "História",
    titulo: "Guerra Fria",
    pontos: [
      "Divisão do mundo entre bloco capitalista (EUA) e bloco comunista (URSS)",
      "Cortina de Ferro: fronteira ideológica na Europa, símbolo no Muro de Berlim",
      "Corrida armamentista e espacial entre as duas potências",
    ],
  },
  {
    materia: "Geografia",
    titulo: "Hidrografia da Amazônia",
    pontos: [
      "Bacia hidrográfica amazônica: maior do mundo em volume",
      "Rios de água branca, preta e clara",
      "Importância para transporte e biodiversidade",
    ],
  },
  {
    materia: "Geografia",
    titulo: "Urbanização brasileira",
    pontos: [
      "Êxodo rural acelerado a partir da industrialização",
      "Favelização e especulação imobiliária como consequências",
      "Impactos: impermeabilização do solo, enchentes, ilhas de calor",
    ],
  },
  {
    materia: "Matemática",
    titulo: "Progressões (PA e PG)",
    pontos: [
      "PA: soma-se sempre a mesma razão (r) entre os termos",
      "PG: multiplica-se sempre a mesma razão (q) entre os termos",
      "Termo geral: PA usa aₙ = a₁+(n−1)r; PG usa aₙ = a₁·q^(n−1)",
    ],
  },
  {
    materia: "Biologia",
    titulo: "Origem da vida",
    pontos: [
      "Oparin e Haldane: hipótese da evolução química ('caldo primordial')",
      "Diferença entre os dois: fonte de carbono proposta para as reações",
      "Miller e Urey (1953): testaram a hipótese em laboratório e obtiveram aminoácidos",
    ],
  },
  {
    materia: "Química",
    titulo: "Estequiometria",
    pontos: [
      "Baseada na equação química balanceada (Lei de Lavoisier)",
      "Coeficientes indicam a proporção em mols entre reagentes e produtos",
      "Reagente limitante: o que acaba primeiro e limita a quantidade de produto",
    ],
  },
  {
    materia: "Física",
    titulo: "Leis de Newton",
    pontos: [
      "1ª Lei (inércia): corpo mantém seu estado a menos que uma força atue sobre ele",
      "2ª Lei: F = m · a",
      "3ª Lei (ação e reação): toda força gera uma força de reação de mesma intensidade e sentido oposto",
    ],
  },
  {
    materia: "Redação",
    titulo: "Estrutura dissertativo-argumentativa",
    pontos: [
      "Introdução com contextualização e tese",
      "Desenvolvimento com argumentos e repertório sociocultural",
      "Conclusão com proposta de intervenção",
    ],
  },
];

const quiz = [
  { pergunta: "Qual figura de linguagem consiste na repetição de sons consonantais?", opcoes: ["Aliteração", "Metáfora", "Hipérbole", "Eufemismo"], correta: 0 },
  { pergunta: "Qual é o resultado de 2³ + 3²?", opcoes: ["13", "17", "15", "12"], correta: 1 },
  { pergunta: "Qual bioma é predominante no estado do Amazonas?", opcoes: ["Cerrado", "Caatinga", "Floresta Amazônica", "Mata Atlântica"], correta: 2 },
  { pergunta: "Quem proclamou a independência do Brasil?", opcoes: ["Tiradentes", "D. Pedro I", "D. João VI", "Getúlio Vargas"], correta: 1 },
  { pergunta: "O tema 'carpe diem' está associado a qual escola literária?", opcoes: ["Barroco", "Arcadismo", "Romantismo", "Realismo"], correta: 1 },
  { pergunta: "O Plano Cruzado (1986) teve como principal objetivo:", opcoes: ["Privatizar estatais", "Conter a inflação com nova moeda", "Abrir o país às importações", "Reformar a Previdência"], correta: 1 },
  { pergunta: "A 'Cortina de Ferro' dividia a Europa durante:", opcoes: ["A Primeira Guerra Mundial", "A Guerra Fria", "As Cruzadas", "A Revolução Industrial"], correta: 1 },
  { pergunta: "Na fase clara da fotossíntese, qual molécula é quebrada para liberar elétrons?", opcoes: ["Glicose", "Gás carbônico", "Água", "Clorofila"], correta: 2 },
  { pergunta: "O que faz um catalisador em uma reação química?", opcoes: ["Aumenta a temperatura", "Diminui a energia de ativação", "Consome-se na reação", "Aumenta a massa dos produtos"], correta: 1 },
  { pergunta: "A força de atrito, ao subirmos uma ladeira caminhando, aponta:", opcoes: ["Contra o movimento", "A favor do movimento", "Perpendicular ao piso", "Não existe nessa situação"], correta: 1 },
  { pergunta: "O valor do vértice de uma parábola y = x² − 6x + 4 tem x igual a:", opcoes: ["2", "3", "4", "6"], correta: 1 },
  { pergunta: "Migração pendular é aquela em que a pessoa:", opcoes: ["Muda de país definitivamente", "Vai e volta no mesmo dia entre municípios", "Migra sazonalmente por causa de colheitas", "Sai do campo para a cidade de forma permanente"], correta: 1 },
];

const materiais = [
  { titulo: "PAS/UnB — Site oficial", materia: "Geral", ano: 2026, tipo: "Site Oficial", url: "https://www.cebraspe.org.br/pas-unb/" },
  { titulo: "Subprograma 2024–2026 — 1ª Etapa", materia: "Geral", ano: 2024, tipo: "Provas", url: "https://www.cebraspe.org.br/pas/subprogramas/2024_2026/1" },
  { titulo: "Subprograma 2023–2025 — 1ª Etapa", materia: "Geral", ano: 2023, tipo: "Provas", url: "https://www.cebraspe.org.br/pas/subprogramas/2023_2025/1" },
  { titulo: "Subprograma 2022–2024 — 1ª Etapa", materia: "Geral", ano: 2022, tipo: "Provas", url: "https://www.cebraspe.org.br/pas/subprogramas/2022_2024/1" },
  { titulo: "Subprograma 2021–2023 — 1ª Etapa", materia: "Geral", ano: 2021, tipo: "Provas", url: "https://www.cebraspe.org.br/pas/subprogramas/2021_2023/1" },
  { titulo: "SaberPAS 1 — Material de estudo oficial", materia: "Geral", ano: 2026, tipo: "Material", url: "https://cdn.cebraspe.org.br/arquivos/PAS/SaberPAS_1.pdf" },
  { titulo: "Publicações — Matrizes de Referência e obras", materia: "Geral", ano: 2026, tipo: "Material", url: "https://www.cebraspe.org.br/pas-unb/publicacoes/" },
];

function seed() {
  const countDecks = db.prepare("SELECT COUNT(*) c FROM decks").get().c;
  if (countDecks > 0) {
    console.log("Banco já populado — nada a fazer. Apague impulse.db se quiser repopular do zero.");
    return;
  }

  const insertDeck = db.prepare("INSERT INTO decks (materia) VALUES (?)");
  const insertCard = db.prepare("INSERT INTO flashcards (deck_id, pergunta, resposta) VALUES (?, ?, ?)");
  const insertResumo = db.prepare("INSERT INTO resumos (materia, titulo) VALUES (?, ?)");
  const insertPonto = db.prepare("INSERT INTO resumo_pontos (resumo_id, ponto, ordem) VALUES (?, ?, ?)");
  const insertQuiz = db.prepare("INSERT INTO quiz_questions (pergunta, opcoes, correta) VALUES (?, ?, ?)");
  const insertMaterial = db.prepare("INSERT INTO materiais (titulo, materia, ano, tipo, url) VALUES (?, ?, ?, ?, ?)");

  const tx = db.transaction(() => {
    for (const [materia, cartas] of Object.entries(decks)) {
      const { lastInsertRowid: deckId } = insertDeck.run(materia);
      cartas.forEach(([pergunta, resposta]) => insertCard.run(deckId, pergunta, resposta));
    }
    for (const r of resumos) {
      const { lastInsertRowid: resumoId } = insertResumo.run(r.materia, r.titulo);
      r.pontos.forEach((p, i) => insertPonto.run(resumoId, p, i));
    }
    for (const q of quiz) {
      insertQuiz.run(q.pergunta, JSON.stringify(q.opcoes), q.correta);
    }
    for (const m of materiais) {
      insertMaterial.run(m.titulo, m.materia, m.ano, m.tipo, m.url || null);
    }
  });

  tx();
  console.log("Banco populado com sucesso: decks, resumos e perguntas de quiz.");
}

seed();
