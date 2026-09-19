<?php
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Rules';
?>

<style>
.tibia-paragraph {
    font-family: 'Martel', 'Georgia', 'Times New Roman', serif;
    font-size: 13px;
    color: #4a2505;
    line-height: 1.6;
    margin-bottom: 12px;
}
.tibia-dropcap {
    font-size: 26px;
    font-weight: bold;
    color: #7f0000;
    font-family: 'Martel', 'Georgia', 'Times New Roman', serif;
    float: left;
    line-height: 22px;
    padding-right: 4px;
    padding-top: 1px;
}

/* Accordion estilisado estilo Tibia oficial */
.rule-accordion {
    margin-bottom: 8px;
    background: #fdfaf4;
    border: 1px solid #e3d3ba;
    border-radius: 4px;
    font-family: 'Verdana', sans-serif;
}
.rule-accordion:last-child {
    margin-bottom: 0;
}
.rule-accordion[open] {
    border: 1px solid #a83c3c;
    background: #faf6ef;
}
.rule-accordion summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    outline: none;
    background: #fdfaf4;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    position: relative;
}
.rule-accordion[open] summary {
    background: #f6e3df;
    border-bottom: 1px solid #d2b3ad;
    border-radius: 4px 4px 0 0;
}
.rule-accordion summary::-webkit-details-marker {
    display: none;
}
.rule-accordion-arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    background: #8b1c1c;
    color: #fff;
    border-radius: 3px;
    font-size: 10px;
    flex-shrink: 0;
    margin-right: 12px;
    transform: rotate(90deg);
}
.rule-accordion[open] .rule-accordion-arrow {
    transform: rotate(-90deg);
}
.rule-accordion summary > div {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-right: 110px;
}
.rule-accordion-title {
    font-weight: bold;
    font-size: 11px;
    color: #4a2505;
    text-transform: uppercase;
}
.rule-accordion-brief {
    font-size: 11px;
    color: #6d5b4a;
    margin-top: 2px;
}
.rule-accordion summary::after {
    content: "Click to read";
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    border: 1px solid #c8b9a2;
    border-radius: 12px;
    padding: 4px 10px;
    font-size: 10px;
    font-weight: bold;
    color: #8b1c1c;
    background: transparent;
}
.rule-accordion[open] summary::after {
    content: "Close";
    border-color: #a83c3c;
}
.rule-accordion-body {
    padding: 12px 16px;
    font-size: 12px;
    color: #3b1e04;
    line-height: 1.6;
    background: #fdfaf4;
    border-radius: 0 0 4px 4px;
}
</style>

<!-- ================================================================= -->
<!-- BOX 1: REGULAMENTO GERAL DO NOSLEIRAOT                            -->
<!-- ================================================================= -->
<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">Regulamento Geral — NosleiraOT</div>
            <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
        </div>
    </div>
    
    <table class="Table3" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td>
                    <div class="InnerTableContainer">
                        <table style="width:100%;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                    <tbody>
                                                        <!-- INTRODUÇÃO COM LETRA CAPITULAR MEDIEVAL -->
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px; color: #4a2505;">
                                                                📜 Apresentação & Propósito
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px;">
                                                                <div class="tibia-paragraph">
                                                                    <span class="tibia-dropcap">O</span> <b>NosleiraOT</b> busca oferecer um ambiente online equilibrado, divertido e respeitoso, onde todos os jogadores possam aproveitar o servidor em condições justas.
                                                                </div>
                                                                <div class="tibia-paragraph">
                                                                    <span class="tibia-dropcap">P</span>ara manter a organização da comunidade e preservar uma boa experiência de jogo, todos os jogadores devem conhecer e respeitar as normas estabelecidas neste regulamento.
                                                                </div>
                                                                <div class="tibia-paragraph" style="margin-bottom: 0;">
                                                                    <span class="tibia-dropcap">A</span> equipe do <b>NosleiraOT</b> poderá agir sempre que identificar atitudes que prejudiquem outros jogadores, comprometam o funcionamento do servidor ou afetem negativamente a comunidade. Essas medidas podem ser aplicadas tanto dentro do jogo quanto no site, Discord e demais canais oficiais relacionados ao servidor.
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <!-- PENALIDADES -->
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px; color: #4a2505;">
                                                                ⚖️ Penalidades
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 14px; line-height: 1.6; font-size: 13px;">
                                                                As punições são definidas de acordo com a gravidade da infração, suas consequências e, quando aplicável, o histórico do jogador.<br><br>
                                                                Entre as medidas que podem ser aplicadas estão:
                                                                <ul style="margin-top: 8px; margin-bottom: 12px; padding-left: 25px;">
                                                                    <li style="margin-bottom: 5px;">⚠️ <b>Advertência</b>;</li>
                                                                    <li style="margin-bottom: 5px;">🚫 <b>Restrição temporária</b> de determinadas funções;</li>
                                                                    <li style="margin-bottom: 5px;">🔒 <b>Suspensão da conta</b> ou personagem;</li>
                                                                    <li style="margin-bottom: 5px;">⏳ <b>Banimento temporário</b>;</li>
                                                                    <li style="margin-bottom: 5px;">🔴 <b>Banimento de até 999 dias</b>;</li>
                                                                    <li style="margin-bottom: 5px;">❌ <b>Banimento permanente</b> (Delete).</li>
                                                                </ul>
                                                                <span style="background-color: rgba(255, 0, 0, 0.08); border-left: 3px solid #cc0000; padding: 8px 12px; display: block; margin-top: 5px;">
                                                                    <b>Atenção:</b> Em casos de punições prolongadas, especialmente banimentos de <b>999 dias</b>, o personagem poderá ser removido definitivamente do servidor após o período determinado pela administração.
                                                                </span>
                                                            </td>
                                                        </tr>

                                                        <!-- MEDIDAS ADMINISTRATIVAS -->
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px; color: #4a2505;">
                                                                🛠️ Medidas Administrativas
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 14px; line-height: 1.6; font-size: 13px;">
                                                                Quando uma infração resultar em ganhos indevidos, alterações na economia ou qualquer outro tipo de desequilíbrio, a equipe poderá realizar correções para restaurar a situação anterior.<br><br>
                                                                Dependendo do caso, poderão ser realizadas ações como:
                                                                <ul style="margin-top: 8px; margin-bottom: 8px; padding-left: 25px;">
                                                                    <li style="margin-bottom: 5px;">🔹 Remoção de itens obtidos irregularmente;</li>
                                                                    <li style="margin-bottom: 5px;">🔹 Retirada de recursos ou benefícios adquiridos por meios proibidos;</li>
                                                                    <li style="margin-bottom: 5px;">🔹 Ajustes nos atributos ou progresso do personagem;</li>
                                                                    <li style="margin-bottom: 5px;">🔹 Correção de valores ou recompensas;</li>
                                                                    <li style="margin-bottom: 5px;">🔹 Reversão de ações realizadas de maneira irregular;</li>
                                                                <div align="center" style="font-family: 'Martel', Georgia, 'Times New Roman', serif; font-size: 13px; font-weight: bold; color: #4a2505; padding: 12px 18px; background: linear-gradient(180deg, #f8f1e5 0%, #ebdcc7 100%); border: 1px solid #c4ab84; border-left: 4px solid #7f0000; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.08); margin-top: 12px;">
                                                                    ✨ A aplicação de uma penalidade não impede a adoção de outras medidas administrativas para corrigir ou reparar os efeitos causados pela infração. ✨
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <!-- RESPONSABILIDADE DO JOGADOR & CONDUTAS PROIBIDAS -->
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px; color: #4a2505;">
                                                                📌 Responsabilidade do Jogador & Condutas Proibidas
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 14px; line-height: 1.6; font-size: 13px;">
                                                                <b>Responsabilidade do Jogador:</b><br>
                                                                É responsabilidade de cada jogador conhecer e cumprir as regras do <b>NosleiraOT</b>. A alegação de desconhecimento das normas não será considerada justificativa para o descumprimento delas.<br>
                                                                As regras poderão ser atualizadas sempre que necessário para acompanhar mudanças no servidor, corrigir situações não previstas ou melhorar a experiência da comunidade.<br><br>
                                                                <b>Condutas Proibidas:</b><br>
                                                                As situações apresentadas neste regulamento representam as principais condutas que podem gerar punições, porém <b>não constituem uma lista limitada</b>. Comportamentos que, mesmo não estando descritos especificamente, prejudiquem a comunidade, explorem falhas do servidor ou comprometam a integridade do jogo também poderão ser analisados e punidos pela administração.<br><br>
                                                                <div align="center" style="font-family: 'Martel', Georgia, 'Times New Roman', serif; font-size: 14px; font-weight: bold; color: #4a2505; padding: 14px 20px; background: linear-gradient(180deg, #f8f1e5 0%, #ebdcc7 100%); border: 1px solid #c4ab84; border-left: 4px solid #7f0000; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.08); margin-top: 10px;">
                                                                    ✨ O objetivo das regras é garantir que o <span style="color: #7f0000;">NosleiraOT</span> permaneça um ambiente competitivo, organizado e agradável para todos. ✨
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<br><br>

<!-- ================================================================= -->
<!-- BOX 2: REGRAS ESPECÍFICAS DO SERVIDOR (EXPANDÍVEIS COM SETINHA)    -->
<!-- ================================================================= -->
<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">Regras de Conduta do Servidor</div>
            <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
        </div>
    </div>
    
    <table class="Table3" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td>
                    <div class="InnerTableContainer">
                        <table style="width:100%;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                    <tbody>
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px; color: #4a2505;">
                                                                📜 Rules of Play & Coexistence (Click to expand the details)
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 14px; border-left: 4px solid #8b1c1c;">

                                                                <!-- REGRA 1 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">1) Comentários sobre Resets</span>
                                                                            <span class="rule-accordion-brief">Não comentar sobre Reset's muito menos afirmar que vai resetar.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É estritamente proibido espalhar boatos, notícias falsas ou afirmar em qualquer canal do jogo/site/Discord que o servidor irá resetar. Esta conduta prejudica a comunidade e desestimula outros jogadores.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 2 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">2) Doações e Free Itens</span>
                                                                            <span class="rule-accordion-brief">Não fazer free itens, gerar banimentos e em casos extremos deleted.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        A realização massiva de "free itens" que afete a economia do servidor ou beneficie contas de forma irregular é proibida, podendo acarretar banimento temporário ou exclusão permanente (delete).
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 3 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">3) Bloqueio de Hunts e Respawn</span>
                                                                            <span class="rule-accordion-brief">Proibido bloquear vias de acesso ou o respawn de monstros.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É proibido bloquear a hunt (vias de acesso ou não) de forma a impedir que outro jogador evolua (up) ou saia do local de hunt, assim como impedir o respawn dos monstros de maneira intencional.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 4 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">4) Bloqueio de Quests & Quests Custom</span>
                                                                            <span class="rule-accordion-brief">Não bloquear acessos a Quests e proibidíssimo upar em Quests Custom.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Não bloquear acessos a Quests ou atrapalhar a realização de Quests causando danos ao time. É estritamente proibido evoluir (upar) em Quests Custons criadas pelo servidor! Infrações geram banimento.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 5 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">5) Respeito à Equipe & Canal Help</span>
                                                                            <span class="rule-accordion-brief">Ofender tutores no Help ou desrespeitar a staff gera banimento.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Ofender tutores no canal HELP gera banimento imediato por ofensas. Desrespeitar orientações ou alertas de Gamemasters (GMs) e CMs sobre irregularidades também ocasionará punições severas.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 6 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">6) Abuse de Novatos & Zonas Neutras</span>
                                                                            <span class="rule-accordion-brief">Conduta abusiva perante novatos ou em zonas neutras (barcos/templos).</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Ter conduta abusiva perante jogador novato matando-o, auxiliando a matar, impedindo ou atrapalhando sua progressão no jogo poderá resultar em punição. Também ficará sujeito a punição o jogador que abusar de situações que envolvam lojas de potes, templos, barcos, cidades iniciais, entradas e saídas de quests e hunts.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 7 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">7) Sistema de Trade OFF</span>
                                                                            <span class="rule-accordion-brief">Não gerar ofertas fraudulentas no sistema de Trade OFF.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É proibido tentar enganar outros jogadores através de ofertas falsas, trocas iludidoras ou fraudes utilizando o sistema de Trade OFF.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 8 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">8) Divulgação de Outros Servidores</span>
                                                                            <span class="rule-accordion-brief">É proibido anúncios de outros servidores.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Anunciar, divulgar ou fazer propaganda de outros servidores de Open Tibia em qualquer canal do NosleiraOT resultará em banimento imediato.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 9 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">9) Uso de Multicliente (MC)</span>
                                                                            <span class="rule-accordion-brief">MC é permitido, exceto para obter vantagens no PvP ou Raids.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        MC é totalmente permitido no servidor para treino e tarefas neutras, desde que não seja utilizado para obter benefícios nas battles de PvP ou durante eventos de Boss Raid.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 10 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">10) Responsabilidade pelas Contas</span>
                                                                            <span class="rule-accordion-brief">Jogadores são responsáveis por suas contas e itens.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Todos os jogadores são totalmente responsáveis por suas contas e itens. A administração não se responsabiliza por perdas causadas por compartilhamento de conta ou roubos de itens entre jogadores.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 11 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">11) Política de Doações</span>
                                                                            <span class="rule-accordion-brief">O servidor não devolve valores de doações.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Todas as doações são espontâneas para manter a infraestrutura do servidor online, não havendo reembolso ou devolução dos valores doados.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 12 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">12) Validade de Pontos do Shop</span>
                                                                            <span class="rule-accordion-brief">Pontos têm validade de 2 meses a contar da data de compra.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Os pontos adquiridos na loja do servidor possuem validade de 2 meses a partir do dia em que foram creditados na conta.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 13 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">13) Comércio de Scripts de Bot</span>
                                                                            <span class="rule-accordion-brief">Proibida a venda ou anúncio de scripts para BOT.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É proibido comercializar ou anunciar scripts de automação ou bots no servidor e nos seus canais oficiais.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 14 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">14) Venda por Dinheiro Real (RMT)</span>
                                                                            <span class="rule-accordion-brief">Proibida a venda de chars e itens por dinheiro real.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É proibida a venda de personagens e itens por dinheiro real ou qualquer outra moeda externa ao servidor. Enviar contatos (Whatsapp, PIX, etc.) para negociações externas poderá resultar em banimento permanente.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 15 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">15) Trocas entre Servidores</span>
                                                                            <span class="rule-accordion-brief">Proibida a venda ou troca de itens entre outros servidores.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É estritamente proibida a troca ou comercialização cruzada de itens e personagens entre o NosleiraOT e outros servidores.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 16 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">16) Proibição de Automações & Trapaças</span>
                                                                            <span class="rule-accordion-brief">Proibido o uso de Navigations, Magebombs, Macros ou Bots em qualquer situação.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Proibido o uso de NAVIGATIONS, MAGEBOMBS, MACROS ou qualquer tipo de BOT em qualquer circunstância. É extremamente proibido o uso de qualquer trapaça, automação ou recurso que infrinja as regras do servidor ou tente obter vantagem em cima de outros jogadores.<br><br>
                                                                        • O uso de MCs para obter vantagem em DANOS contra o adversário na battle também se enquadra na regra.<br>
                                                                        • Proibido o uso de MC para qualquer BOSS Raid.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 17 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">17) Uso Abusivo de Chars Low Level em Battle</span>
                                                                            <span class="rule-accordion-brief">Proibido usar chars low level intencionalmente em PvP para remover trap.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Utilizar de forma intencional personagens de nível muito inferior ao da batalha para obter vantagens no PvP (como remover traps ou desviar alvos) ocasionará banimento severo.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 18 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">18) Abuso no Guild Chat (/guildbc)</span>
                                                                            <span class="rule-accordion-brief">Proibido usar o Guild Chat para comércio ou ofensas extremadas.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É proibido utilizar a função de anúncio da guilda (/guildbc) para propagar mensagens de comércio e ofensas extremadas.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 19 (ATUALIZADA) -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">19) Uso de Bots, Scripts e Programas Externos</span>
                                                                            <span class="rule-accordion-brief">Proibido o uso de programas externos ou automação de ações.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É estritamente proibido o uso de bots, macros de voz, macros de teclado, scripts ou qualquer programa externo que automatize ações ou proporcione vantagem indevida no jogo.<br><br>
                                                                        <b>Penalidade:</b> O descumprimento desta regra poderá resultar em banimento severo ou permanente da conta e/ou personagem.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 20 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <span class="rule-accordion-arrow">❯</span>
                                                                        <div>
                                                                            <span class="rule-accordion-title">20) Manipulação de Level (Power Leveling Forçado)</span>
                                                                            <span class="rule-accordion-brief">[Enforced] Proibida a manipulação forçada de UP LV.</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        <b>[Enforced]</b> Jogadores que forem constatados manipulando o avanço de nível forçado através de personagens próprios ou de terceiros serão deletados. Em casos abusivos, todas as contas vinculadas poderão ser excluídas.
                                                                    </div>
                                                                </details>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<br><br>

<!-- ================================================================= -->
<!-- BOX 3: CANAL DE REPORT (CTRL + R)                                 -->
<!-- ================================================================= -->
<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">REPORT (CTRL + R)</div>
            <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
        </div>
    </div>
    
    <table class="Table3" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td>
                    <div class="InnerTableContainer">
                        <table style="width:100%;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                    <tbody>
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px; color: #4a2505;">
                                                                ⚔️ Diretrizes para Atendimento & Denúncias
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 14px; line-height: 1.6; font-size: 13px;">
                                                                <ul style="margin: 0; padding-left: 20px;">
                                                                    <li style="margin-bottom: 8px;">Quando for reportar somente escreva a "situação/dúvida/problema + nickname(s) se houver algum". Nada mais ou menos do que isso. Qualquer report que extrapole essa orientação poderá ficar sem atendimento.</li>
                                                                    <li style="margin-bottom: 8px;">Os GMs não precisam responder o seu report para efetuar o atendimento. Somente com a descrição do seu report já é possível atendê-lo, por isso é imprescindível reportar de forma adequada. Reports do tipo "gm on?", "alguém aí?", "mc aqui", não costumam ser atendidos e muito menos respondidos.</li>
                                                                    <li style="margin-bottom: 8px;">Reports realizados em canais impróprios (help channel, PM, Telegram, por exemplo) não serão atendidos. Se o player vier a reportar adequadamente após ter escrito em canal impróprio também poderá ficar sem atendimento.</li>
                                                                    <li style="margin-bottom: 8px;">Os GMs atendem exclusivamente pelo <b>CTRL + R</b> (report).</li>
                                                                    <li style="margin-bottom: 8px;">GMs não precisam prover explicação para quem reportou sobre atos realizados ou não realizados. Por exemplo, João reportou Maria por uso de MC em PvP. Se eventualmente Maria for notificada ou banida, os GMs não se obrigam a avisar João o que aconteceu ou não.</li>
                                                                    <li style="margin-bottom: 8px;">Reports realizados por players que não fazem/fizeram parte ou que estão longe da situação reportada poderão ficar sem atendimento.</li>
                                                                    <li style="margin-bottom: 8px;">Reports realizados por players que usam mais de um char para reportar a mesma situação ou problema ficarão sem atendimento. Não adianta reportar com dois ou mais chars a mesma coisa, você só estará se prejudicando. Não atendemos assim. Um report basta.</li>
                                                                    <li style="margin-bottom: 8px;">O player que ficar abrindo e fechando o mesmo report com a intenção de spamar não será atendido e poderá ser banido (Spam Report).</li>
                                                                    <li style="margin-bottom: 8px;">Associação de players que fazem o mesmo report poderão ficar sem atendimento se constatado que:
                                                                        <ol style="margin-top: 5px; margin-bottom: 5px;">
                                                                            <li>Há players que não fazem/fizeram parte da situação;</li>
                                                                            <li>Todos colaram o mesmo report;</li>
                                                                            <li>Há informações incompletas;</li>
                                                                            <li>Há falsidade no conteúdo do report. Vários reportarem a mesma situação não significa que isso será verdade.</li>
                                                                        </ol>
                                                                    </li>
                                                                    <li style="margin-bottom: 8px;">Reports (ctrl+r) são atendidos por GMs. Tickets (site) é atendido pelo ADM. Se você abrir report perguntando sobre ADM provavelmente não será respondido nem atendido.</li>
                                                                    <li style="margin-bottom: 8px;">Caso decida abrir report para perguntar algo que não seja relacionado às regras, tente antes perguntar no help channel. Muitas dúvidas podem ser respondidas tranquilamente por um tutor ou até mesmo outro player.</li>
                                                                    <li style="margin-bottom: 8px;">Realizar vários reports erroneamente faz com que você perca credibilidade com GMs. Caso tenha dúvidas não acuse ninguém, peça para o GM averiguar a situação.</li>
                                                                    <li style="margin-bottom: 8px;">Reports mal intencionados poderão resultar em banimento (False Report).</li>
                                                                    <li style="margin-bottom: 8px;">Não combata uma injustiça com outra. Você poderá ser banido por isso.</li>
                                                                    <li style="margin-bottom: 8px;">Tenha paciência ao reportar. A justiça pode tardar, mas não falha.</li>
                                                                    <li style="margin-bottom: 8px;"><b>Todas as orientações supracitadas são vitais para um bom funcionamento das regras.</b></li>
                                                                </ul>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>
