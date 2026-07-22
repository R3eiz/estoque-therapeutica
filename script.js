const STORAGE_KEY = "therapeutica-estoque-v3";
const LEGACY_PRODUCTS_KEY = "produtos-therapeutica";
const LEGACY_MOVEMENTS_KEY = "movimentacoes-therapeutica";

const FILIAIS_PADRAO = [
    { id: "blumenau", nome: "Blumenau", cidade: "Blumenau, SC" },
    { id: "lucas", nome: "Lucas", cidade: "Lucas do Rio Verde, MT" },
    { id: "sinop", nome: "Sinop", cidade: "Sinop, MT" }
];

const titulosPaginas = {
    dashboard: "Dashboard",
    produtos: "Produtos",
    movimentacao: "Movimentação",
    "estoque-baixo": "Estoque baixo",
    pedidos: "Pedidos",
    "portal-filial": "Portal da filial",
    "estoque-filial": "Meu estoque",
    "novo-pedido-filial": "Novo pedido",
    "meus-pedidos": "Meus pedidos",
    filiais: "Filiais",
    historico: "Histórico",
    usuarios: "Usuários",
    configuracoes: "Configurações"
};

const elementos = {
    navegacao: [...document.querySelectorAll(".item-menu")],
    paginas: [...document.querySelectorAll(".pagina")],
    menuMatriz: document.querySelector("#menu-matriz"),
    menuFilial: document.querySelector("#menu-filial"),
    seletorPortal: document.querySelector("#seletor-portal"),
    tituloPagina: document.querySelector("#titulo-pagina"),
    toast: document.querySelector("#toast"),
    indicadorProdutos: document.querySelector("#indicador-produtos"),
    indicadorUnidades: document.querySelector("#indicador-unidades"),
    indicadorEstoqueBaixo: document.querySelector("#indicador-estoque-baixo"),
    indicadorPedidos: document.querySelector("#indicador-pedidos"),
    dashboardMovimentacoes: document.querySelector("#dashboard-movimentacoes"),
    dashboardAlertas: document.querySelector("#dashboard-alertas"),
    buscaProdutos: document.querySelector("#busca-produtos"),
    filtroCategoria: document.querySelector("#filtro-categoria"),
    tabelaProdutos: document.querySelector("#tabela-produtos"),
    tabelaEstoqueBaixo: document.querySelector("#tabela-estoque-baixo"),
    tabelaPedidos: document.querySelector("#tabela-pedidos"),
    listaFiliais: document.querySelector("#lista-filiais"),
    buscaHistorico: document.querySelector("#busca-historico"),
    filtroHistorico: document.querySelector("#filtro-historico"),
    tabelaHistorico: document.querySelector("#tabela-historico"),
    movimentoTitulo: document.querySelector("#movimentacao-titulo"),
    movimentoSubtitulo: document.querySelector("#movimentacao-subtitulo"),
    movimentoDescricao: document.querySelector("#movimentacao-descricao"),
    formularioMovimentacao: document.querySelector("#formulario-movimentacao"),
    movimentoProduto: document.querySelector("#movimento-produto"),
    movimentoQuantidade: document.querySelector("#movimento-quantidade"),
    movimentoObservacao: document.querySelector("#movimento-observacao"),
    infoProdutoMovimento: document.querySelector("#info-produto-movimento"),
    mensagemMovimentacao: document.querySelector("#mensagem-movimentacao"),
    botaoConfirmarMovimento: document.querySelector("#botao-confirmar-movimento"),
    modalProduto: document.querySelector("#modal-produto"),
    formularioProduto: document.querySelector("#formulario-produto"),
    tituloModalProduto: document.querySelector("#titulo-modal-produto"),
    mensagemProduto: document.querySelector("#mensagem-produto"),
    produtoId: document.querySelector("#produto-id"),
    produtoCodigo: document.querySelector("#produto-codigo"),
    produtoNome: document.querySelector("#produto-nome"),
    produtoCategoria: document.querySelector("#produto-categoria"),
    produtoQuantidade: document.querySelector("#produto-quantidade"),
    produtoMinimo: document.querySelector("#produto-minimo"),
    produtoUnidade: document.querySelector("#produto-unidade"),
    ajudaQuantidadeProduto: document.querySelector("#ajuda-quantidade-produto"),
    modalPedido: document.querySelector("#modal-pedido"),
    formularioPedido: document.querySelector("#formulario-pedido"),
    mensagemPedido: document.querySelector("#mensagem-pedido"),
    pedidoFilial: document.querySelector("#pedido-filial"),
    pedidoProduto: document.querySelector("#pedido-produto"),
    pedidoEstoqueAtual: document.querySelector("#pedido-estoque-atual"),
    pedidoQuantidade: document.querySelector("#pedido-quantidade"),
    pedidoObservacao: document.querySelector("#pedido-observacao"),
    botaoIrAlertas: document.querySelector("#botao-ir-alertas"),
    botaoExportar: document.querySelector("#botao-exportar"),
    arquivoImportar: document.querySelector("#arquivo-importar"),
    botaoLimparDados: document.querySelector("#botao-limpar-dados"),
    tituloPortalFilial: document.querySelector("#titulo-portal-filial"),
    tituloEstoqueFilial: document.querySelector("#titulo-estoque-filial"),
    indicadorFilialItens: document.querySelector("#indicador-filial-itens"),
    indicadorFilialQuantidade: document.querySelector("#indicador-filial-quantidade"),
    indicadorFilialPedidos: document.querySelector("#indicador-filial-pedidos"),
    tabelaEstoqueFilial: document.querySelector("#tabela-estoque-filial"),
    formularioItemPedido: document.querySelector("#formulario-item-pedido"),
    itemPedidoProduto: document.querySelector("#item-pedido-produto"),
    itemPedidoEstoque: document.querySelector("#item-pedido-estoque"),
    itemPedidoQuantidade: document.querySelector("#item-pedido-quantidade"),
    itemPedidoObservacao: document.querySelector("#item-pedido-observacao"),
    mensagemItemPedido: document.querySelector("#mensagem-item-pedido"),
    itensCarrinhoPedido: document.querySelector("#itens-carrinho-pedido"),
    quantidadeItensCarrinho: document.querySelector("#quantidade-itens-carrinho"),
    observacaoPedidoCompleto: document.querySelector("#observacao-pedido-completo"),
    mensagemPedidoFilial: document.querySelector("#mensagem-pedido-filial"),
    botaoLimparCarrinho: document.querySelector("#botao-limpar-carrinho"),
    botaoEnviarPedidoLista: document.querySelector("#botao-enviar-pedido-lista"),
    listaMeusPedidos: document.querySelector("#lista-meus-pedidos")
};

let paginaAtual = "dashboard";
let tipoMovimentacaoAtual = "entrada";
let produtoSelecionadoMovimentacao = "";
let portalAtual = "matriz";
let itensDoPedidoAtual = [];
let temporizadorToast;
let estado = carregarEstado();

function gerarId(prefixo) {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return `${prefixo}-${crypto.randomUUID()}`;
    }

    return `${prefixo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function numeroInteiroNaoNegativo(valor) {
    const numero = Number(valor);
    return Number.isFinite(numero) ? Math.max(0, Math.floor(numero)) : 0;
}

function lerJSON(chave, valorPadrao) {
    try {
        const valor = localStorage.getItem(chave);
        return valor ? JSON.parse(valor) : valorPadrao;
    } catch {
        return valorPadrao;
    }
}

function estadoPadrao() {
    return {
        versao: 3,
        produtos: [],
        movimentacoes: [],
        pedidos: [],
        filiais: FILIAIS_PADRAO.map((filial) => ({ ...filial })),
        estoqueFiliais: {},
        atualizadoEm: new Date().toISOString()
    };
}

function normalizarTipoMovimentacao(tipo) {
    const texto = String(tipo || "ajuste")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    if (texto.includes("entrada")) return "entrada";
    if (texto.includes("saida")) return "saida";
    if (texto.includes("transfer")) return "transferencia";
    return "ajuste";
}

function normalizarProduto(produto) {
    const nome = String(produto?.name ?? produto?.nome ?? "").trim();

    return {
        id: String(produto?.id || gerarId("prod")),
        codigo: String(produto?.codigo ?? produto?.code ?? "").trim(),
        nome,
        categoria: String(produto?.categoria ?? produto?.category ?? "Outros").trim() || "Outros",
        quantidade: numeroInteiroNaoNegativo(produto?.quantidade ?? produto?.quantity),
        estoqueMinimo: numeroInteiroNaoNegativo(produto?.estoqueMinimo ?? produto?.minStock),
        unidade: String(produto?.unidade ?? produto?.unit ?? "Unidade").trim() || "Unidade",
        ativo: produto?.ativo !== false && produto?.active !== false,
        criadoEm: produto?.criadoEm ?? produto?.createdAt ?? new Date().toISOString(),
        atualizadoEm: produto?.atualizadoEm ?? produto?.updatedAt ?? new Date().toISOString(),
        arquivadoEm: produto?.arquivadoEm ?? null
    };
}

function normalizarMovimentacao(movimentacao) {
    return {
        id: String(movimentacao?.id || gerarId("mov")),
        produtoId: String(movimentacao?.produtoId ?? movimentacao?.productId ?? ""),
        produtoNome: String(movimentacao?.produtoNome ?? movimentacao?.produto ?? movimentacao?.productName ?? "Produto não identificado"),
        tipo: normalizarTipoMovimentacao(movimentacao?.tipo ?? movimentacao?.type),
        quantidade: numeroInteiroNaoNegativo(movimentacao?.quantidade ?? movimentacao?.quantity),
        unidade: String(movimentacao?.unidade ?? movimentacao?.unit ?? "Unidade"),
        saldoAntes: movimentacao?.saldoAntes ?? movimentacao?.balanceBefore ?? null,
        saldoDepois: movimentacao?.saldoDepois ?? movimentacao?.balanceAfter ?? null,
        observacao: String(movimentacao?.observacao ?? movimentacao?.note ?? ""),
        filialId: String(movimentacao?.filialId ?? ""),
        pedidoId: String(movimentacao?.pedidoId ?? ""),
        criadoEm: movimentacao?.criadoEm ?? movimentacao?.data ?? movimentacao?.createdAt ?? new Date().toISOString()
    };
}

function normalizarPedido(pedido) {
    const situacoesValidas = ["pendente", "aguardando_compra", "aprovado", "recusado"];
    const situacao = situacoesValidas.includes(pedido?.situacao ?? pedido?.status)
        ? pedido.situacao ?? pedido.status
        : "pendente";

    const itensRecebidos = Array.isArray(pedido?.itens) ? pedido.itens : [pedido];
    const itens = itensRecebidos
        .map((item) => ({
            produtoId: String(item?.produtoId ?? item?.productId ?? pedido?.produtoId ?? ""),
            produtoNome: String(item?.produtoNome ?? item?.productName ?? pedido?.produtoNome ?? pedido?.productName ?? "Produto não identificado"),
            unidade: String(item?.unidade ?? item?.unit ?? pedido?.unidade ?? pedido?.unit ?? "Unidade"),
            estoqueInformado: numeroInteiroNaoNegativo(item?.estoqueInformado ?? item?.reportedStock ?? pedido?.estoqueInformado ?? pedido?.reportedStock),
            quantidadeSolicitada: numeroInteiroNaoNegativo(item?.quantidadeSolicitada ?? item?.requestedQuantity ?? pedido?.quantidadeSolicitada ?? pedido?.requestedQuantity),
            observacao: String(item?.observacao ?? item?.note ?? "")
        }))
        .filter((item) => item.produtoId || item.produtoNome !== "Produto não identificado");

    return {
        id: String(pedido?.id || gerarId("ped")),
        filialId: String(pedido?.filialId ?? ""),
        itens,
        observacao: String(pedido?.observacao ?? pedido?.note ?? ""),
        observacaoMatriz: String(pedido?.observacaoMatriz ?? pedido?.managerNote ?? ""),
        situacao,
        criadoEm: pedido?.criadoEm ?? pedido?.createdAt ?? new Date().toISOString(),
        analisadoEm: pedido?.analisadoEm ?? pedido?.handledAt ?? null
    };
}

function normalizarEstado(dados) {
    const base = estadoPadrao();
    const fonte = dados && typeof dados === "object" ? dados : {};
    const produtos = Array.isArray(fonte.produtos) ? fonte.produtos : [];
    const movimentacoes = Array.isArray(fonte.movimentacoes) ? fonte.movimentacoes : [];
    const pedidos = Array.isArray(fonte.pedidos) ? fonte.pedidos : [];
    const filiaisRecebidas = Array.isArray(fonte.filiais) ? fonte.filiais : [];
    const filiaisPorId = new Map(filiaisRecebidas.map((filial) => [String(filial.id), filial]));

    base.produtos = produtos.map(normalizarProduto).filter((produto) => produto.nome);
    base.movimentacoes = movimentacoes.map(normalizarMovimentacao);
    base.pedidos = pedidos.map(normalizarPedido);
    base.filiais = FILIAIS_PADRAO.map((filial) => ({ ...filial, ...filiaisPorId.get(filial.id) }));
    base.estoqueFiliais = fonte.estoqueFiliais && typeof fonte.estoqueFiliais === "object"
        ? fonte.estoqueFiliais
        : {};
    base.atualizadoEm = fonte.atualizadoEm ?? new Date().toISOString();

    return base;
}

function carregarEstado() {
    const salvo = lerJSON(STORAGE_KEY, null);

    if (salvo) {
        return normalizarEstado(salvo);
    }

    const produtosAntigos = lerJSON(LEGACY_PRODUCTS_KEY, []);
    const movimentacoesAntigas = lerJSON(LEGACY_MOVEMENTS_KEY, []);
    const migrado = normalizarEstado({
        produtos: Array.isArray(produtosAntigos) ? produtosAntigos : [],
        movimentacoes: Array.isArray(movimentacoesAntigas) ? movimentacoesAntigas : []
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrado));
    return migrado;
}

function salvarEstado() {
    estado.atualizadoEm = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

function escaparHTML(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatarNumero(valor) {
    return new Intl.NumberFormat("pt-BR").format(numeroInteiroNaoNegativo(valor));
}

function formatarData(valor) {
    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return "Data não disponível";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(data);
}

function produtosAtivos() {
    return estado.produtos.filter((produto) => produto.ativo);
}

function buscarProduto(id) {
    return estado.produtos.find((produto) => produto.id === id);
}

function buscarFilial(id) {
    return estado.filiais.find((filial) => filial.id === id);
}

function estaNoPortalFilial() {
    return portalAtual !== "matriz";
}

function filialAtual() {
    return estaNoPortalFilial() ? buscarFilial(portalAtual) : null;
}

function itensDoPedido(pedido) {
    return Array.isArray(pedido.itens) ? pedido.itens : [];
}

function pedidosAbertos() {
    return estado.pedidos.filter((pedido) => pedido.situacao === "pendente" || pedido.situacao === "aguardando_compra");
}

function produtosComEstoqueBaixo() {
    return produtosAtivos().filter((produto) => produto.quantidade <= produto.estoqueMinimo);
}

function chaveEstoqueFilial(filialId, produtoId) {
    return `${filialId}:${produtoId}`;
}

function situacaoProduto(produto) {
    if (produto.quantidade === 0) {
        return { texto: "Sem estoque", classe: "status-sem-estoque" };
    }

    if (produto.quantidade <= produto.estoqueMinimo) {
        return { texto: "Estoque baixo", classe: "status-baixo" };
    }

    return { texto: "Normal", classe: "status-normal" };
}

function textoTipoMovimentacao(tipo) {
    return {
        entrada: "Entrada",
        saida: "Saída",
        transferencia: "Transferência",
        ajuste: "Ajuste"
    }[tipo] || "Ajuste";
}

function classeTipoMovimentacao(tipo) {
    return `tipo-${tipo || "ajuste"}`;
}

function textoSituacaoPedido(situacao) {
    return {
        pendente: "Pendente",
        aguardando_compra: "Aguardando compra",
        aprovado: "Aprovado",
        recusado: "Recusado"
    }[situacao] || "Pendente";
}

function classeSituacaoPedido(situacao) {
    return `tipo-${situacao || "pendente"}`;
}

function notificar(mensagem, tipo = "sucesso") {
    clearTimeout(temporizadorToast);
    elementos.toast.textContent = mensagem;
    elementos.toast.classList.toggle("toast-erro", tipo === "erro");
    elementos.toast.classList.add("toast-visivel");

    temporizadorToast = setTimeout(() => {
        elementos.toast.classList.remove("toast-visivel");
    }, 3600);
}

function abrirModal(modal) {
    modal.classList.add("modal-aberto");
    modal.setAttribute("aria-hidden", "false");
}

function fecharModal(modal) {
    modal.classList.remove("modal-aberto");
    modal.setAttribute("aria-hidden", "true");
}

function atualizarPaginaMovimentacao() {
    const entrada = tipoMovimentacaoAtual === "entrada";

    elementos.movimentoSubtitulo.textContent = entrada ? "Recebimento de produtos" : "Consumo, perda ou transferência";
    elementos.movimentoTitulo.textContent = entrada ? "Registrar entrada" : "Registrar saída";
    elementos.movimentoDescricao.textContent = entrada
        ? "Registre produtos que chegaram à matriz, incluindo compras e reposições."
        : "Registre itens consumidos na matriz ou enviados para outros destinos.";
    elementos.botaoConfirmarMovimento.textContent = entrada ? "Confirmar entrada" : "Confirmar saída";
}

function navegar(pagina, opcoes = {}) {
    const paginasFilial = ["portal-filial", "estoque-filial", "novo-pedido-filial", "meus-pedidos"];

    if (estaNoPortalFilial() && !paginasFilial.includes(pagina)) {
        pagina = "portal-filial";
    }

    if (!estaNoPortalFilial() && paginasFilial.includes(pagina)) {
        pagina = "dashboard";
    }

    paginaAtual = pagina in titulosPaginas ? pagina : "dashboard";

    if (opcoes.tipoMovimentacao) {
        tipoMovimentacaoAtual = opcoes.tipoMovimentacao;
    }

    if (opcoes.produtoId !== undefined) {
        produtoSelecionadoMovimentacao = opcoes.produtoId;
    }

    elementos.paginas.forEach((item) => {
        item.classList.toggle("pagina-ativa", item.id === `pagina-${paginaAtual}`);
    });

    elementos.menuMatriz.hidden = estaNoPortalFilial();
    elementos.menuFilial.hidden = !estaNoPortalFilial();

    elementos.navegacao.forEach((item) => {
        const correspondePagina = item.dataset.pagina === paginaAtual;
        const correspondeTipo = paginaAtual !== "movimentacao" || item.dataset.tipoMovimentacao === tipoMovimentacaoAtual;
        item.classList.toggle("menu-ativo", correspondePagina && correspondeTipo);
    });

    elementos.tituloPagina.textContent = paginaAtual === "movimentacao"
        ? (tipoMovimentacaoAtual === "entrada" ? "Entradas" : "Saídas")
        : titulosPaginas[paginaAtual];

    atualizarPaginaMovimentacao();
    renderizarTudo();

    // A renderização atualiza elementos de todas as telas. Aplicamos a página
    // ativa novamente ao final para manter a troca de portal sempre explícita.
    elementos.paginas.forEach((item) => {
        item.classList.toggle("pagina-ativa", item.id === `pagina-${paginaAtual}`);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function registrarMovimentacao({ produto, tipo, quantidade, saldoAntes, saldoDepois, observacao = "", filialId = "", pedidoId = "" }) {
    estado.movimentacoes.unshift({
        id: gerarId("mov"),
        produtoId: produto.id,
        produtoNome: produto.nome,
        tipo,
        quantidade,
        unidade: produto.unidade,
        saldoAntes,
        saldoDepois,
        observacao,
        filialId,
        pedidoId,
        criadoEm: new Date().toISOString()
    });
}

function renderizarIndicadores() {
    const ativos = produtosAtivos();
    const totalUnidades = ativos.reduce((total, produto) => total + produto.quantidade, 0);

    elementos.indicadorProdutos.textContent = formatarNumero(ativos.length);
    elementos.indicadorUnidades.textContent = formatarNumero(totalUnidades);
    elementos.indicadorEstoqueBaixo.textContent = formatarNumero(produtosComEstoqueBaixo().length);
    elementos.indicadorPedidos.textContent = formatarNumero(pedidosAbertos().length);
}

function renderizarDashboard() {
    const movimentacoes = estado.movimentacoes.slice(0, 5);
    const alertas = produtosComEstoqueBaixo().slice(0, 5);

    elementos.dashboardMovimentacoes.innerHTML = movimentacoes.length
        ? movimentacoes.map((movimentacao) => {
            const sinal = movimentacao.tipo === "entrada" ? "+" : movimentacao.tipo === "saida" ? "−" : "→";
            const classe = movimentacao.tipo === "entrada"
                ? "valor-positivo"
                : movimentacao.tipo === "saida"
                    ? "valor-negativo"
                    : "valor-transferencia";

            return `
                <div class="resumo-linha">
                    <div>
                        <strong>${escaparHTML(movimentacao.produtoNome)}</strong>
                        <span>${textoTipoMovimentacao(movimentacao.tipo)} · ${formatarData(movimentacao.criadoEm)}</span>
                    </div>
                    <span class="${classe}">${sinal} ${formatarNumero(movimentacao.quantidade)} ${escaparHTML(movimentacao.unidade)}</span>
                </div>
            `;
        }).join("")
        : "<p class=\"resumo-vazio\">Nenhuma movimentação registrada ainda.</p>";

    elementos.dashboardAlertas.innerHTML = alertas.length
        ? alertas.map((produto) => `
            <div class="resumo-linha">
                <div>
                    <strong>${escaparHTML(produto.nome)}</strong>
                    <span>Mínimo definido: ${formatarNumero(produto.estoqueMinimo)} ${escaparHTML(produto.unidade)}</span>
                </div>
                <span class="valor-negativo">${formatarNumero(produto.quantidade)} ${escaparHTML(produto.unidade)}</span>
            </div>
        `).join("")
        : "<p class=\"resumo-vazio\">Todos os produtos estão acima do estoque mínimo.</p>";
}

function renderizarFiltroCategorias() {
    const valorAtual = elementos.filtroCategoria.value;
    const categorias = [...new Set(produtosAtivos().map((produto) => produto.categoria))].sort((a, b) => a.localeCompare(b, "pt-BR"));

    elementos.filtroCategoria.innerHTML = `
        <option value="">Todas as categorias</option>
        ${categorias.map((categoria) => `<option value="${escaparHTML(categoria)}">${escaparHTML(categoria)}</option>`).join("")}
    `;

    if (categorias.includes(valorAtual)) {
        elementos.filtroCategoria.value = valorAtual;
    }
}

function renderizarProdutos() {
    const busca = elementos.buscaProdutos.value.trim().toLocaleLowerCase("pt-BR");
    const categoria = elementos.filtroCategoria.value;
    const produtos = produtosAtivos()
        .filter((produto) => {
            const texto = `${produto.nome} ${produto.categoria} ${produto.codigo}`.toLocaleLowerCase("pt-BR");
            return (!busca || texto.includes(busca)) && (!categoria || produto.categoria === categoria);
        })
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

    elementos.tabelaProdutos.innerHTML = produtos.length
        ? produtos.map((produto) => {
            const status = situacaoProduto(produto);
            const codigo = produto.codigo ? `<span class="codigo-produto">${escaparHTML(produto.codigo)}</span>` : "";

            return `
                <tr>
                    <td><strong>${escaparHTML(produto.nome)}</strong>${codigo}</td>
                    <td>${escaparHTML(produto.categoria)}</td>
                    <td><strong>${formatarNumero(produto.quantidade)}</strong></td>
                    <td>${formatarNumero(produto.estoqueMinimo)}</td>
                    <td>${escaparHTML(produto.unidade)}</td>
                    <td><span class="selo-status ${status.classe}">${status.texto}</span></td>
                    <td>
                        <div class="acoes-tabela">
                            <button type="button" class="botao-acao acao-entrada" data-acao="movimentar" data-produto-id="${produto.id}" data-tipo="entrada">Entrada</button>
                            <button type="button" class="botao-acao acao-saida" data-acao="movimentar" data-produto-id="${produto.id}" data-tipo="saida">Saída</button>
                            <button type="button" class="botao-acao" data-acao="editar-produto" data-produto-id="${produto.id}">Editar</button>
                            <button type="button" class="botao-acao acao-perigo" data-acao="arquivar-produto" data-produto-id="${produto.id}">Arquivar</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("")
        : "<tr><td colspan=\"7\" class=\"tabela-vazia\">Nenhum produto encontrado.</td></tr>";
}

function renderizarFormularioMovimentacao() {
    const ativos = produtosAtivos().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    const valorExistente = produtoSelecionadoMovimentacao || elementos.movimentoProduto.value;

    elementos.movimentoProduto.innerHTML = ativos.length
        ? `<option value="">Selecione um produto</option>${ativos.map((produto) => `
            <option value="${produto.id}">${escaparHTML(produto.nome)} · ${formatarNumero(produto.quantidade)} ${escaparHTML(produto.unidade)}</option>
        `).join("")}`
        : "<option value=\"\">Nenhum produto cadastrado</option>";

    if (ativos.some((produto) => produto.id === valorExistente)) {
        elementos.movimentoProduto.value = valorExistente;
        produtoSelecionadoMovimentacao = valorExistente;
    } else {
        produtoSelecionadoMovimentacao = "";
    }

    elementos.movimentoProduto.disabled = ativos.length === 0;
    elementos.botaoConfirmarMovimento.disabled = ativos.length === 0;
    atualizarInformacaoProdutoMovimento();
}

function atualizarInformacaoProdutoMovimento() {
    const produto = buscarProduto(elementos.movimentoProduto.value);

    if (!produto) {
        elementos.infoProdutoMovimento.textContent = produtosAtivos().length
            ? "Selecione um produto para ver o estoque atual."
            : "Cadastre um produto antes de registrar uma movimentação.";
        return;
    }

    elementos.infoProdutoMovimento.innerHTML = `Estoque atual na matriz: <strong>${formatarNumero(produto.quantidade)} ${escaparHTML(produto.unidade)}</strong>. Estoque mínimo: <strong>${formatarNumero(produto.estoqueMinimo)} ${escaparHTML(produto.unidade)}</strong>.`;
}

function renderizarEstoqueBaixo() {
    const produtos = produtosComEstoqueBaixo().sort((a, b) => a.quantidade - b.quantidade || a.nome.localeCompare(b.nome, "pt-BR"));

    elementos.tabelaEstoqueBaixo.innerHTML = produtos.length
        ? produtos.map((produto) => `
            <tr>
                <td><strong>${escaparHTML(produto.nome)}</strong></td>
                <td>${escaparHTML(produto.categoria)}</td>
                <td><strong>${formatarNumero(produto.quantidade)}</strong></td>
                <td>${formatarNumero(produto.estoqueMinimo)}</td>
                <td>${escaparHTML(produto.unidade)}</td>
                <td><button type="button" class="botao-acao acao-entrada" data-acao="movimentar" data-produto-id="${produto.id}" data-tipo="entrada">Registrar entrada</button></td>
            </tr>
        `).join("")
        : "<tr><td colspan=\"6\" class=\"tabela-vazia\">Nenhum produto está com estoque baixo.</td></tr>";
}

function renderizarPedidos() {
    const pedidos = [...estado.pedidos].sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

    elementos.tabelaPedidos.innerHTML = pedidos.length
        ? pedidos.map((pedido) => {
            const filial = buscarFilial(pedido.filialId);
            const aberto = pedido.situacao === "pendente" || pedido.situacao === "aguardando_compra";
            const itens = itensDoPedido(pedido);
            const listaItens = itens.map((item) => `
                <div class="item-pedido-resumo">
                    <strong>${escaparHTML(item.produtoNome)}</strong>
                    <span>Filial: ${formatarNumero(item.estoqueInformado)} · Pedido: ${formatarNumero(item.quantidadeSolicitada)} ${escaparHTML(item.unidade)}</span>
                </div>
            `).join("");
            const acoes = aberto
                ? `
                    <div class="acoes-tabela">
                        <button type="button" class="botao-acao acao-aprovar" data-acao="aprovar-pedido" data-pedido-id="${pedido.id}">Aprovar</button>
                        ${pedido.situacao === "pendente" ? `<button type="button" class="botao-acao" data-acao="aguardar-compra" data-pedido-id="${pedido.id}">Comprar</button>` : ""}
                        <button type="button" class="botao-acao acao-perigo" data-acao="recusar-pedido" data-pedido-id="${pedido.id}">Recusar</button>
                    </div>
                `
                : `<span class="detalhe-celula">${pedido.observacaoMatriz ? escaparHTML(pedido.observacaoMatriz) : "Finalizado"}</span>`;

            return `
                <tr>
                    <td>${formatarData(pedido.criadoEm)}</td>
                    <td><strong>${escaparHTML(filial?.nome || "Filial não identificada")}</strong></td>
                    <td>${listaItens}${pedido.observacao ? `<span class="detalhe-celula">${escaparHTML(pedido.observacao)}</span>` : ""}</td>
                    <td><span class="selo-tipo ${classeSituacaoPedido(pedido.situacao)}">${textoSituacaoPedido(pedido.situacao)}</span></td>
                    <td>${acoes}</td>
                </tr>
            `;
        }).join("")
        : "<tr><td colspan=\"5\" class=\"tabela-vazia\">Nenhum pedido criado ainda.</td></tr>";
}

function renderizarFiliais() {
    elementos.listaFiliais.innerHTML = estado.filiais.map((filial) => {
        const pedidos = estado.pedidos.filter((pedido) => pedido.filialId === filial.id);
        const abertos = pedidos.filter((pedido) => pedido.situacao === "pendente" || pedido.situacao === "aguardando_compra").length;
        const produtosControlados = Object.keys(estado.estoqueFiliais).filter((chave) => chave.startsWith(`${filial.id}:`)).length;

        return `
            <article class="filial-card">
                <p class="subtitulo-secao">Filial Therapeutica</p>
                <h3>${escaparHTML(filial.nome)}</h3>
                <p>${escaparHTML(filial.cidade)}</p>
                <div class="metricas-filial">
                    <div class="metrica-filial"><strong>${formatarNumero(abertos)}</strong><span>pedidos abertos</span></div>
                    <div class="metrica-filial"><strong>${formatarNumero(produtosControlados)}</strong><span>itens informados</span></div>
                </div>
                <button type="button" class="botao-secundario" data-acao="abrir-portal-filial" data-filial-id="${filial.id}">Abrir portal</button>
            </article>
        `;
    }).join("");
}

function renderizarHistorico() {
    const busca = elementos.buscaHistorico.value.trim().toLocaleLowerCase("pt-BR");
    const tipo = elementos.filtroHistorico.value;
    const movimentacoes = estado.movimentacoes.filter((movimentacao) => {
        const texto = `${movimentacao.produtoNome} ${movimentacao.observacao}`.toLocaleLowerCase("pt-BR");
        return (!busca || texto.includes(busca)) && (!tipo || movimentacao.tipo === tipo);
    });

    elementos.tabelaHistorico.innerHTML = movimentacoes.length
        ? movimentacoes.map((movimentacao) => {
            const filial = movimentacao.filialId ? buscarFilial(movimentacao.filialId) : null;
            const saldo = movimentacao.saldoAntes !== null && movimentacao.saldoDepois !== null
                ? `Saldo: ${formatarNumero(movimentacao.saldoAntes)} → ${formatarNumero(movimentacao.saldoDepois)}`
                : "Saldo anterior não registrado";
            const destino = filial ? `Destino: ${filial.nome}` : movimentacao.observacao || "Sem observação";

            return `
                <tr>
                    <td>${formatarData(movimentacao.criadoEm)}</td>
                    <td><span class="selo-tipo ${classeTipoMovimentacao(movimentacao.tipo)}">${textoTipoMovimentacao(movimentacao.tipo)}</span></td>
                    <td><strong>${escaparHTML(movimentacao.produtoNome)}</strong><span class="detalhe-celula">${saldo}</span></td>
                    <td>${formatarNumero(movimentacao.quantidade)} ${escaparHTML(movimentacao.unidade)}</td>
                    <td>${escaparHTML(destino)}${movimentacao.observacao && filial ? `<span class="detalhe-celula">${escaparHTML(movimentacao.observacao)}</span>` : ""}</td>
                </tr>
            `;
        }).join("")
        : "<tr><td colspan=\"5\" class=\"tabela-vazia\">Nenhuma movimentação encontrada.</td></tr>";
}

function renderizarPortalFilial() {
    const filial = filialAtual();

    if (!filial) return;

    const chavesDaFilial = Object.keys(estado.estoqueFiliais).filter((chave) => chave.startsWith(`${filial.id}:`));
    const quantidadeConhecida = chavesDaFilial.reduce((total, chave) => total + numeroInteiroNaoNegativo(estado.estoqueFiliais[chave]?.quantidade ?? estado.estoqueFiliais[chave]), 0);
    const pedidosDaFilial = estado.pedidos.filter((pedido) => pedido.filialId === filial.id);
    const abertos = pedidosDaFilial.filter((pedido) => pedido.situacao === "pendente" || pedido.situacao === "aguardando_compra").length;

    elementos.tituloPortalFilial.textContent = `Portal Therapeutica · ${filial.nome}`;
    elementos.tituloEstoqueFilial.textContent = `Estoque da filial ${filial.nome}`;
    elementos.indicadorFilialItens.textContent = formatarNumero(chavesDaFilial.length);
    elementos.indicadorFilialQuantidade.textContent = formatarNumero(quantidadeConhecida);
    elementos.indicadorFilialPedidos.textContent = formatarNumero(abertos);

    const itensEstoque = chavesDaFilial.map((chave) => {
        const produtoId = chave.split(":")[1];
        const produto = buscarProduto(produtoId);
        const registro = estado.estoqueFiliais[chave];
        const quantidade = numeroInteiroNaoNegativo(registro?.quantidade ?? registro);
        const atualizadoEm = registro?.atualizadoEm ?? "";

        return { produto, quantidade, atualizadoEm };
    }).filter((item) => item.produto);

    elementos.tabelaEstoqueFilial.innerHTML = itensEstoque.length
        ? itensEstoque.sort((a, b) => a.produto.nome.localeCompare(b.produto.nome, "pt-BR")).map((item) => `
            <tr>
                <td><strong>${escaparHTML(item.produto.nome)}</strong></td>
                <td>${escaparHTML(item.produto.categoria)}</td>
                <td><strong>${formatarNumero(item.quantidade)}</strong></td>
                <td>${escaparHTML(item.produto.unidade)}</td>
                <td>${item.atualizadoEm ? formatarData(item.atualizadoEm) : "Informado no pedido"}</td>
            </tr>
        `).join("")
        : "<tr><td colspan=\"5\" class=\"tabela-vazia\">Nenhum estoque individual foi informado ainda. Envie um pedido para registrar o saldo atual da filial.</td></tr>";

    const produtos = produtosAtivos().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    const selecionado = elementos.itemPedidoProduto.value;
    elementos.itemPedidoProduto.innerHTML = produtos.length
        ? `<option value="">Selecione um produto</option>${produtos.map((produto) => `<option value="${produto.id}">${escaparHTML(produto.nome)} · Unidade: ${escaparHTML(produto.unidade)}</option>`).join("")}`
        : "<option value=\"\">Nenhum produto disponível</option>";

    if (produtos.some((produto) => produto.id === selecionado)) {
        elementos.itemPedidoProduto.value = selecionado;
    }

    elementos.itemPedidoProduto.disabled = produtos.length === 0;
    renderizarCarrinhoPedido();

    elementos.listaMeusPedidos.innerHTML = pedidosDaFilial.length
        ? pedidosDaFilial.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)).map((pedido) => `
            <article class="pedido-filial-card">
                <div class="cabecalho-pedido-filial">
                    <div>
                        <h3>Pedido de ${formatarData(pedido.criadoEm)}</h3>
                        <p>${pedido.observacao ? escaparHTML(pedido.observacao) : "Sem observação geral."}</p>
                    </div>
                    <span class="selo-tipo ${classeSituacaoPedido(pedido.situacao)}">${textoSituacaoPedido(pedido.situacao)}</span>
                </div>
                <div class="itens-pedido-resumo">
                    ${itensDoPedido(pedido).map((item) => `
                        <div class="item-pedido-resumo">
                            <strong>${escaparHTML(item.produtoNome)}</strong>
                            <span>Estoque informado: ${formatarNumero(item.estoqueInformado)} · Solicitado: ${formatarNumero(item.quantidadeSolicitada)} ${escaparHTML(item.unidade)}</span>
                        </div>
                    `).join("")}
                </div>
                ${pedido.observacaoMatriz ? `<p><strong>Resposta da matriz:</strong> ${escaparHTML(pedido.observacaoMatriz)}</p>` : ""}
            </article>
        `).join("")
        : "<p class=\"resumo-vazio\">Nenhum pedido foi enviado por esta filial.</p>";
}

function renderizarCarrinhoPedido() {
    elementos.quantidadeItensCarrinho.textContent = `${itensDoPedidoAtual.length} ${itensDoPedidoAtual.length === 1 ? "item" : "itens"}`;
    elementos.itensCarrinhoPedido.innerHTML = itensDoPedidoAtual.length
        ? itensDoPedidoAtual.map((item, indice) => `
            <div class="linha-carrinho">
                <div>
                    <strong>${escaparHTML(item.produtoNome)}</strong>
                    <span>Estoque atual: ${formatarNumero(item.estoqueInformado)} · Solicitação: ${formatarNumero(item.quantidadeSolicitada)} ${escaparHTML(item.unidade)}</span>
                    ${item.observacao ? `<span>${escaparHTML(item.observacao)}</span>` : ""}
                </div>
                <button type="button" class="botao-remover-item" data-acao="remover-item-pedido" data-indice-item="${indice}">Remover</button>
            </div>
        `).join("")
        : "<p class=\"resumo-vazio\">Adicione produtos para montar a lista do pedido.</p>";
}

function renderizarTudo() {
    renderizarIndicadores();
    renderizarDashboard();
    renderizarFiltroCategorias();
    renderizarProdutos();
    renderizarFormularioMovimentacao();
    renderizarEstoqueBaixo();
    renderizarPedidos();
    renderizarFiliais();
    renderizarHistorico();
    renderizarPortalFilial();
}

function abrirModalProduto(produtoId = "") {
    elementos.formularioProduto.reset();
    elementos.mensagemProduto.textContent = "";
    elementos.produtoId.value = "";
    elementos.produtoQuantidade.disabled = false;
    elementos.ajudaQuantidadeProduto.textContent = "Depois use entradas e saídas para alterar o estoque.";
    elementos.tituloModalProduto.textContent = "Cadastrar produto";

    const produto = produtoId ? buscarProduto(produtoId) : null;

    if (produto) {
        elementos.tituloModalProduto.textContent = "Editar produto";
        elementos.produtoId.value = produto.id;
        elementos.produtoCodigo.value = produto.codigo;
        elementos.produtoNome.value = produto.nome;
        elementos.produtoCategoria.value = produto.categoria;
        elementos.produtoQuantidade.value = produto.quantidade;
        elementos.produtoMinimo.value = produto.estoqueMinimo;
        elementos.produtoUnidade.value = produto.unidade;
        elementos.produtoQuantidade.disabled = true;
        elementos.ajudaQuantidadeProduto.textContent = "Para preservar o histórico, altere a quantidade usando Entrada ou Saída.";
    }

    abrirModal(elementos.modalProduto);
    setTimeout(() => elementos.produtoNome.focus(), 0);
}

function abrirModalPedido(filialId = "") {
    const produtos = produtosAtivos();

    if (!produtos.length) {
        notificar("Cadastre pelo menos um produto antes de criar um pedido.", "erro");
        return;
    }

    elementos.formularioPedido.reset();
    elementos.mensagemPedido.textContent = "";
    elementos.pedidoFilial.innerHTML = FILIAIS_PADRAO.map((filial) => `<option value="${filial.id}">${escaparHTML(filial.nome)} · ${escaparHTML(filial.cidade)}</option>`).join("");
    elementos.pedidoProduto.innerHTML = produtos
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
        .map((produto) => `<option value="${produto.id}">${escaparHTML(produto.nome)} · Matriz: ${formatarNumero(produto.quantidade)} ${escaparHTML(produto.unidade)}</option>`)
        .join("");

    if (buscarFilial(filialId)) {
        elementos.pedidoFilial.value = filialId;
    }

    abrirModal(elementos.modalPedido);
    setTimeout(() => elementos.pedidoEstoqueAtual.focus(), 0);
}

function arquivarProduto(produtoId) {
    const produto = buscarProduto(produtoId);

    if (!produto) return;

    const pedidoAberto = pedidosAbertos().some((pedido) => itensDoPedido(pedido).some((item) => item.produtoId === produto.id));

    if (pedidoAberto) {
        notificar("Este produto tem pedido aberto e não pode ser arquivado agora.", "erro");
        return;
    }

    const confirmou = window.confirm(`Arquivar o produto “${produto.nome}”? O histórico será preservado.`);

    if (!confirmou) return;

    produto.ativo = false;
    produto.arquivadoEm = new Date().toISOString();
    produto.atualizadoEm = produto.arquivadoEm;
    salvarEstado();
    renderizarTudo();
    notificar("Produto arquivado. O histórico foi preservado.");
}

function aprovarPedido(pedidoId) {
    const pedido = estado.pedidos.find((item) => item.id === pedidoId);

    if (!pedido || !["pendente", "aguardando_compra"].includes(pedido.situacao)) return;

    const itens = itensDoPedido(pedido);
    const itensIndisponiveis = itens.filter((item) => {
        const produto = buscarProduto(item.produtoId);
        return !produto || !produto.ativo || produto.quantidade < item.quantidadeSolicitada;
    });

    if (itensIndisponiveis.length) {
        notificar("A matriz não possui saldo suficiente para todos os itens. Registre uma entrada ou marque o pedido como aguardando compra.", "erro");
        return;
    }

    const filial = buscarFilial(pedido.filialId);
    const confirmou = window.confirm(`Aprovar a transferência de ${itens.length} item(ns) para ${filial?.nome || "a filial"}?`);

    if (!confirmou) return;

    pedido.situacao = "aprovado";
    pedido.analisadoEm = new Date().toISOString();
    pedido.observacaoMatriz = "Pedido aprovado e transferência registrada.";

    itens.forEach((item) => {
        const produto = buscarProduto(item.produtoId);
        const saldoAntes = produto.quantidade;

        produto.quantidade -= item.quantidadeSolicitada;
        produto.atualizadoEm = new Date().toISOString();
        estado.estoqueFiliais[chaveEstoqueFilial(pedido.filialId, produto.id)] = {
            quantidade: item.estoqueInformado + item.quantidadeSolicitada,
            atualizadoEm: new Date().toISOString()
        };

        registrarMovimentacao({
            produto,
            tipo: "transferencia",
            quantidade: item.quantidadeSolicitada,
            saldoAntes,
            saldoDepois: produto.quantidade,
            observacao: item.observacao || pedido.observacao || "Transferência aprovada para filial.",
            filialId: pedido.filialId,
            pedidoId: pedido.id
        });
    });

    salvarEstado();
    renderizarTudo();
    notificar("Pedido aprovado e estoque central atualizado.");
}

function marcarAguardandoCompra(pedidoId) {
    const pedido = estado.pedidos.find((item) => item.id === pedidoId);

    if (!pedido || pedido.situacao !== "pendente") return;

    const observacao = window.prompt("Informe uma observação para a filial (opcional):", "Aguardando compra para reposição da matriz.");

    if (observacao === null) return;

    pedido.situacao = "aguardando_compra";
    pedido.observacaoMatriz = observacao.trim() || "Aguardando compra para reposição da matriz.";
    pedido.analisadoEm = new Date().toISOString();
    salvarEstado();
    renderizarTudo();
    notificar("Pedido marcado como aguardando compra.");
}

function recusarPedido(pedidoId) {
    const pedido = estado.pedidos.find((item) => item.id === pedidoId);

    if (!pedido || !["pendente", "aguardando_compra"].includes(pedido.situacao)) return;

    const motivo = window.prompt("Informe o motivo da recusa:");

    if (motivo === null) return;

    pedido.situacao = "recusado";
    pedido.observacaoMatriz = motivo.trim() || "Pedido recusado pela matriz.";
    pedido.analisadoEm = new Date().toISOString();
    salvarEstado();
    renderizarTudo();
    notificar("Pedido recusado.");
}

function exportarBackup() {
    const backup = {
        ...estado,
        exportadoEm: new Date().toISOString(),
        aplicacao: "Estoque Therapeutica"
    };
    const arquivo = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    const data = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `backup-therapeutica-${data}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notificar("Backup baixado com sucesso.");
}

async function importarBackup(evento) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) return;

    try {
        const conteudo = await arquivo.text();
        const dados = JSON.parse(conteudo);

        if (!dados || typeof dados !== "object") {
            throw new Error("Arquivo inválido");
        }

        const confirmou = window.confirm("Importar este backup substituirá os dados atuais deste navegador. Deseja continuar?");

        if (!confirmou) return;

        estado = normalizarEstado(dados);
        salvarEstado();
        renderizarTudo();
        navegar("dashboard");
        notificar("Backup importado com sucesso.");
    } catch {
        notificar("Não foi possível importar esse arquivo JSON.", "erro");
    } finally {
        evento.target.value = "";
    }
}

function limparDados() {
    const confirmou = window.confirm("Limpar todos os produtos, pedidos e histórico deste protótipo? Esta ação não pode ser desfeita sem um backup.");

    if (!confirmou) return;

    estado = estadoPadrao();
    salvarEstado();
    produtoSelecionadoMovimentacao = "";
    renderizarTudo();
    navegar("dashboard");
    notificar("Dados locais removidos.");
}

function lidarComAcao(acao, elemento) {
    switch (acao) {
        case "novo-produto":
            abrirModalProduto();
            break;
        case "nova-entrada":
            navegar("movimentacao", { tipoMovimentacao: "entrada" });
            break;
        case "ver-historico":
            navegar("historico");
            break;
        case "ver-alertas":
            navegar("estoque-baixo");
            break;
        case "movimentar":
            navegar("movimentacao", {
                tipoMovimentacao: elemento.dataset.tipo,
                produtoId: elemento.dataset.produtoId
            });
            break;
        case "editar-produto":
            abrirModalProduto(elemento.dataset.produtoId);
            break;
        case "arquivar-produto":
            arquivarProduto(elemento.dataset.produtoId);
            break;
        case "novo-pedido":
            abrirModalPedido();
            break;
        case "novo-pedido-filial":
            abrirModalPedido(elemento.dataset.filialId);
            break;
        case "abrir-portal-filial":
            portalAtual = elemento.dataset.filialId;
            elementos.seletorPortal.value = portalAtual;
            itensDoPedidoAtual = [];
            navegar("portal-filial");
            break;
        case "abrir-novo-pedido-filial":
            navegar("novo-pedido-filial");
            break;
        case "ver-estoque-filial":
            navegar("estoque-filial");
            break;
        case "remover-item-pedido":
            itensDoPedidoAtual.splice(Number(elemento.dataset.indiceItem), 1);
            renderizarCarrinhoPedido();
            break;
        case "aprovar-pedido":
            aprovarPedido(elemento.dataset.pedidoId);
            break;
        case "aguardar-compra":
            marcarAguardandoCompra(elemento.dataset.pedidoId);
            break;
        case "recusar-pedido":
            recusarPedido(elemento.dataset.pedidoId);
            break;
        default:
            break;
    }
}

elementos.navegacao.forEach((item) => {
    item.addEventListener("click", () => {
        navegar(item.dataset.pagina, { tipoMovimentacao: item.dataset.tipoMovimentacao });
    });
});

document.addEventListener("click", (evento) => {
    const fechar = evento.target.closest("[data-fechar-modal]");

    if (fechar) {
        const modal = document.querySelector(`#${fechar.dataset.fecharModal}`);
        if (modal) fecharModal(modal);
        return;
    }

    const botaoAcao = evento.target.closest("[data-acao]");
    if (botaoAcao) {
        lidarComAcao(botaoAcao.dataset.acao, botaoAcao);
    }
});

[elementos.modalProduto, elementos.modalPedido].forEach((modal) => {
    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) fecharModal(modal);
    });
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        fecharModal(elementos.modalProduto);
        fecharModal(elementos.modalPedido);
    }
});

elementos.buscaProdutos.addEventListener("input", renderizarProdutos);
elementos.filtroCategoria.addEventListener("change", renderizarProdutos);
elementos.buscaHistorico.addEventListener("input", renderizarHistorico);
elementos.filtroHistorico.addEventListener("change", renderizarHistorico);
elementos.movimentoProduto.addEventListener("change", () => {
    produtoSelecionadoMovimentacao = elementos.movimentoProduto.value;
    atualizarInformacaoProdutoMovimento();
});

elementos.formularioProduto.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const id = elementos.produtoId.value;
    const nome = elementos.produtoNome.value.trim();
    const codigo = elementos.produtoCodigo.value.trim();
    const categoria = elementos.produtoCategoria.value;
    const unidade = elementos.produtoUnidade.value;
    const quantidade = numeroInteiroNaoNegativo(elementos.produtoQuantidade.value);
    const estoqueMinimo = numeroInteiroNaoNegativo(elementos.produtoMinimo.value);

    if (!nome || !categoria || !unidade) {
        elementos.mensagemProduto.textContent = "Preencha todos os campos obrigatórios.";
        return;
    }

    const duplicado = produtosAtivos().find((produto) => produto.id !== id && produto.nome.toLocaleLowerCase("pt-BR") === nome.toLocaleLowerCase("pt-BR"));

    if (duplicado) {
        elementos.mensagemProduto.textContent = "Já existe um produto ativo com esse nome.";
        return;
    }

    if (id) {
        const produto = buscarProduto(id);
        if (!produto) return;

        produto.codigo = codigo;
        produto.nome = nome;
        produto.categoria = categoria;
        produto.estoqueMinimo = estoqueMinimo;
        produto.unidade = unidade;
        produto.atualizadoEm = new Date().toISOString();
        salvarEstado();
        fecharModal(elementos.modalProduto);
        renderizarTudo();
        notificar("Produto atualizado.");
        return;
    }

    const produto = {
        id: gerarId("prod"),
        codigo,
        nome,
        categoria,
        quantidade,
        estoqueMinimo,
        unidade,
        ativo: true,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        arquivadoEm: null
    };

    estado.produtos.push(produto);

    if (quantidade > 0) {
        registrarMovimentacao({
            produto,
            tipo: "entrada",
            quantidade,
            saldoAntes: 0,
            saldoDepois: quantidade,
            observacao: "Estoque inicial no cadastro do produto."
        });
    }

    salvarEstado();
    fecharModal(elementos.modalProduto);
    renderizarTudo();
    notificar("Produto cadastrado com sucesso.");
});

elementos.formularioMovimentacao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const produto = buscarProduto(elementos.movimentoProduto.value);
    const quantidade = Number(elementos.movimentoQuantidade.value);
    const observacao = elementos.movimentoObservacao.value.trim();

    elementos.mensagemMovimentacao.textContent = "";

    if (!produto || !produto.ativo) {
        elementos.mensagemMovimentacao.textContent = "Selecione um produto válido.";
        return;
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        elementos.mensagemMovimentacao.textContent = "Informe uma quantidade inteira maior que zero.";
        return;
    }

    if (tipoMovimentacaoAtual === "saida" && quantidade > produto.quantidade) {
        elementos.mensagemMovimentacao.textContent = "A saída não pode ser maior que o estoque disponível na matriz.";
        return;
    }

    const saldoAntes = produto.quantidade;
    produto.quantidade += tipoMovimentacaoAtual === "entrada" ? quantidade : -quantidade;
    produto.atualizadoEm = new Date().toISOString();

    registrarMovimentacao({
        produto,
        tipo: tipoMovimentacaoAtual,
        quantidade,
        saldoAntes,
        saldoDepois: produto.quantidade,
        observacao
    });

    salvarEstado();
    elementos.movimentoQuantidade.value = "";
    elementos.movimentoObservacao.value = "";
    renderizarTudo();
    notificar(tipoMovimentacaoAtual === "entrada" ? "Entrada registrada." : "Saída registrada.");
});

elementos.formularioPedido.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const filial = buscarFilial(elementos.pedidoFilial.value);
    const produto = buscarProduto(elementos.pedidoProduto.value);
    const estoqueInformado = Number(elementos.pedidoEstoqueAtual.value);
    const quantidadeSolicitada = Number(elementos.pedidoQuantidade.value);
    const observacao = elementos.pedidoObservacao.value.trim();

    elementos.mensagemPedido.textContent = "";

    if (!filial || !produto || !produto.ativo) {
        elementos.mensagemPedido.textContent = "Selecione uma filial e um produto válidos.";
        return;
    }

    if (!Number.isInteger(estoqueInformado) || estoqueInformado < 0 || !Number.isInteger(quantidadeSolicitada) || quantidadeSolicitada <= 0) {
        elementos.mensagemPedido.textContent = "Informe números inteiros válidos para o estoque atual e a quantidade solicitada.";
        return;
    }

    estado.pedidos.unshift({
        id: gerarId("ped"),
        filialId: filial.id,
        itens: [{
            produtoId: produto.id,
            produtoNome: produto.nome,
            unidade: produto.unidade,
            estoqueInformado,
            quantidadeSolicitada,
            observacao: ""
        }],
        observacao,
        observacaoMatriz: "",
        situacao: "pendente",
        criadoEm: new Date().toISOString(),
        analisadoEm: null
    });

    salvarEstado();
    fecharModal(elementos.modalPedido);
    renderizarTudo();
    notificar("Pedido enviado para análise da matriz.");
});

elementos.seletorPortal.addEventListener("change", () => {
    portalAtual = elementos.seletorPortal.value;
    itensDoPedidoAtual = [];
    navegar(estaNoPortalFilial() ? "portal-filial" : "dashboard");
});

elementos.formularioItemPedido.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const produto = buscarProduto(elementos.itemPedidoProduto.value);
    const estoqueInformado = Number(elementos.itemPedidoEstoque.value);
    const quantidadeSolicitada = Number(elementos.itemPedidoQuantidade.value);
    const observacao = elementos.itemPedidoObservacao.value.trim();

    elementos.mensagemItemPedido.textContent = "";

    if (!filialAtual() || !produto || !produto.ativo) {
        elementos.mensagemItemPedido.textContent = "Selecione um produto válido.";
        return;
    }

    if (!Number.isInteger(estoqueInformado) || estoqueInformado < 0 || !Number.isInteger(quantidadeSolicitada) || quantidadeSolicitada <= 0) {
        elementos.mensagemItemPedido.textContent = "Informe quantidades inteiras válidas.";
        return;
    }

    if (itensDoPedidoAtual.some((item) => item.produtoId === produto.id)) {
        elementos.mensagemItemPedido.textContent = "Esse produto já está na lista. Remova-o para informar uma quantidade diferente.";
        return;
    }

    itensDoPedidoAtual.push({
        produtoId: produto.id,
        produtoNome: produto.nome,
        unidade: produto.unidade,
        estoqueInformado,
        quantidadeSolicitada,
        observacao
    });

    elementos.formularioItemPedido.reset();
    renderizarCarrinhoPedido();
});

elementos.botaoLimparCarrinho.addEventListener("click", () => {
    itensDoPedidoAtual = [];
    elementos.mensagemPedidoFilial.textContent = "";
    renderizarCarrinhoPedido();
});

elementos.botaoEnviarPedidoLista.addEventListener("click", () => {
    const filial = filialAtual();
    const observacao = elementos.observacaoPedidoCompleto.value.trim();

    elementos.mensagemPedidoFilial.textContent = "";

    if (!filial) {
        elementos.mensagemPedidoFilial.textContent = "Selecione uma filial antes de enviar o pedido.";
        return;
    }

    if (!itensDoPedidoAtual.length) {
        elementos.mensagemPedidoFilial.textContent = "Adicione pelo menos um item à lista.";
        return;
    }

    const itens = itensDoPedidoAtual.map((item) => ({ ...item }));
    const agora = new Date().toISOString();

    estado.pedidos.unshift({
        id: gerarId("ped"),
        filialId: filial.id,
        itens,
        observacao,
        observacaoMatriz: "",
        situacao: "pendente",
        criadoEm: agora,
        analisadoEm: null
    });

    itens.forEach((item) => {
        estado.estoqueFiliais[chaveEstoqueFilial(filial.id, item.produtoId)] = {
            quantidade: item.estoqueInformado,
            atualizadoEm: agora
        };
    });

    itensDoPedidoAtual = [];
    elementos.observacaoPedidoCompleto.value = "";
    salvarEstado();
    renderizarTudo();
    notificar("Lista de pedido enviada para a matriz.");
    navegar("meus-pedidos");
});

elementos.botaoIrAlertas.addEventListener("click", () => navegar(estaNoPortalFilial() ? "estoque-filial" : "estoque-baixo"));
elementos.botaoExportar.addEventListener("click", exportarBackup);
elementos.arquivoImportar.addEventListener("change", importarBackup);
elementos.botaoLimparDados.addEventListener("click", limparDados);

elementos.seletorPortal.value = portalAtual;
navegar("dashboard");
