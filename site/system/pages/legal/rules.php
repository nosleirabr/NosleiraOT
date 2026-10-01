<!-- Google Translate Widget (Oculto) -->
<div id="google_translate_element" style="display:none !important;"></div>

<script type="text/javascript">
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'pt,en,es,pl',
        autoDisplay: false
    }, 'google_translate_element');
}
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

<script type="text/javascript">
function changeLanguage(lang) {
    var domain = window.location.hostname;
    if (lang === 'pt') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + domain + ';';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + domain.replace(/^www\./, '') + ';';
        
        var combo = document.querySelector('.goog-te-combo');
        if (combo) {
            combo.value = 'pt';
            combo.dispatchEvent(new Event('change'));
        }
        location.reload();
        return;
    }

    var cookieValue = '/pt/' + lang;
    document.cookie = 'googtrans=' + cookieValue + '; path=/;';
    document.cookie = 'googtrans=' + cookieValue + '; path=/; domain=' + domain + ';';
    document.cookie = 'googtrans=' + cookieValue + '; path=/; domain=.' + domain.replace(/^www\./, '') + ';';

    var combo = document.querySelector('.goog-te-combo');
    if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
    } else {
        location.reload();
    }
}
</script>
<?php
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Rules';
?>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

/* Regras Gerais & Tipografia Elevada */
.tibia-paragraph {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 13px;
    color: #3d2208;
    line-height: 1.65;
    margin-bottom: 12px;
}
.tibia-dropcap {
    font-size: 28px;
    font-weight: 700;
    color: #7f0000;
    font-family: 'Cinzel', 'Georgia', serif;
    float: left;
    line-height: 24px;
    padding-right: 6px;
    padding-top: 1px;
}

/* Accordion estilisado estilo Tibia Premium */
.rule-accordion {
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(160, 130, 90, 0.2);
    padding-bottom: 4px;
}
.rule-accordion:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}
.rule-accordion summary {
    cursor: pointer;
    outline: none;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: linear-gradient(180deg, #fdf9f3 0%, #f4e8d7 100%);
    border: 1px solid #d8c6af;
    border-radius: 6px;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    user-select: none;
}
.rule-accordion summary::-webkit-details-marker {
    display: none;
}
.rule-accordion summary:hover {
    background: linear-gradient(180deg, #fffcf7 0%, #ebd7be 100%);
    border-color: #b89a72;
    box-shadow: 0 3px 8px rgba(127, 0, 0, 0.12);
    transform: translateY(-1px);
}
.rule-accordion[open] summary {
    background: linear-gradient(180deg, #f0dfc8 0%, #e3ceb0 100%);
    border-color: #8b0000;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    border-radius: 6px 6px 0 0;
}

.rule-summary-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
}

.rule-icon-box {
    width: 24px;
    height: 24px;
    min-width: 24px;
    background: linear-gradient(180deg, #9e1a1a 0%, #6e0000 100%);
    color: #fff8e7;
    border: 1px solid #520000;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    margin-right: 12px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.2);
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease;
}
.rule-accordion[open] .rule-icon-box {
    transform: rotate(180deg);
    background: linear-gradient(180deg, #520000 0%, #8b0000 100%);
}

.rule-title-group {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.rule-accordion-title {
    font-family: 'Cinzel', 'Martel', 'Georgia', serif;
    font-weight: 700;
    font-size: 13.5px;
    color: #4a1c00;
    letter-spacing: 0.2px;
}

.rule-accordion-brief {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 11.5px;
    color: #6e543b;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.rule-action-badge {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #7f0000;
    background: #f5eae0;
    border: 1px solid #d4b5a0;
    padding: 4px 10px;
    border-radius: 12px;
    white-space: nowrap;
    margin-left: 10px;
    transition: all 0.2s ease;
}
.rule-accordion summary:hover .rule-action-badge {
    background: #7f0000;
    color: #ffffff;
    border-color: #5b0000;
}
.rule-accordion[open] .badge-text-closed {
    display: none;
}
.rule-accordion:not([open]) .badge-text-open {
    display: none;
}

.rule-accordion-body {
    background: #faf4e8;
    border: 1px solid #d8c6af;
    border-top: none;
    border-left: 4px solid #8b0000;
    border-radius: 0 0 6px 6px;
    padding: 14px 18px;
    margin-bottom: 12px;
    color: #2b1704;
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 13px;
    line-height: 1.65;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.05);
}

/* Estilos para o Painel de Report (CTRL + R) */
.tibia-key {
    background: linear-gradient(180deg, #4a4a4a 0%, #2b2b2b 100%);
    color: #fff8e7;
    border: 1px solid #1a1a1a;
    border-bottom: 2px solid #000;
    border-radius: 4px;
    padding: 2px 7px;
    font-family: 'Inter', monospace;
    font-size: 11px;
    font-weight: 700;
    box-shadow: 0 1px 2px rgba(0,0,0,0.3);
    display: inline-block;
}

.report-banner {
    background: linear-gradient(180deg, #7f0000 0%, #520000 100%);
    color: #fff3db;
    border: 1px solid #3d0000;
    border-radius: 6px;
    padding: 14px 18px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
.report-banner-title {
    font-family: 'Cinzel', serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
}
.report-banner-sub {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: #e6c594;
    margin-top: 2px;
}

.report-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
    gap: 14px;
}

.report-card {
    background: linear-gradient(180deg, #fdf9f2 0%, #f4e8d6 100%);
    border: 1px solid #d4c3ab;
    border-radius: 6px;
    padding: 14px 16px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
}
.report-card-title {
    font-family: 'Cinzel', serif;
    font-size: 13.5px;
    font-weight: 700;
    color: #4a1c00;
    border-bottom: 2px solid #d0b898;
    padding-bottom: 8px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.report-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.report-list-item {
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    color: #2c1704;
    line-height: 1.6;
    margin-bottom: 10px;
    padding-left: 18px;
    position: relative;
}
.report-list-item:last-child {
    margin-bottom: 0;
}
.report-list-item::before {
    content: "•";
    color: #8b0000;
    font-weight: bold;
    font-size: 16px;
    position: absolute;
    left: 2px;
    top: -2px;
}

.report-badge-do {
    background: #e2f0d9;
    color: #276a10;
    border: 1px solid #b5d8a0;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 3px;
    margin-right: 4px;
}
.report-badge-dont {
    background: #fce4d6;
    color: #a61c1c;
    border: 1px solid #f4b08a;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 3px;
    margin-right: 4px;
}
.report-footer-note {
    background: linear-gradient(180deg, #f8efe0 0%, #ebdbbe 100%);
    border: 1px solid #c8b496;
    border-left: 4px solid #7f0000;
    border-radius: 6px;
    padding: 12px 16px;
    margin-top: 14px;
    text-align: center;
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 700;
    color: #4a1c00;
}


/* Ocultar elementos do Google Translate */
.goog-te-banner-frame,
.goog-te-banner-frame.skiptranslate,
#goog-gt-tt,
.goog-te-balloon-frame,
.goog-tooltip,
.goog-tooltip:hover {
    display: none !important;
    visibility: hidden !important;
}

.skiptranslate {
    display: none !important;
}
#google_translate_element {
    display: none !important;
}

/* Bandeiras na Área Verde das Regras */
.rules-caption-inner {
    position: relative !important;
}
.rules-green-bar-flags {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 50;
}
.btn-rules-back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #3d5066 0%, #202b38 100%);
    color: #f0f6fc !important;
    text-decoration: none !important;
    font-family: 'Cinzel', serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 3px 10px;
    border: 1px solid #5a7698;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    transition: all 0.2s ease;
    cursor: pointer;
    line-height: 1.2;
    margin-right: 6px;
}
.btn-rules-back:hover {
    background: linear-gradient(180deg, #516b8a 0%, #2c3c4f 100%);
    border-color: #8bb3e0;
    color: #ffffff !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    transform: translateY(-1px);
}
.flag-icon {
    transition: transform 0.15s ease-in-out;
    width: 18px;
    height: 12px;
    border: none !important;
    box-shadow: none !important;
    display: block;
    cursor: pointer !important;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    -ms-interpolation-mode: nearest-neighbor;
}
.flag-icon:hover {
    transform: scale(1.2);
}

</style>

<!-- ================================================================= -->
<!-- BOX 1: REGULAMENTO GERAL DO NOSLEIRAOT                            -->
<!-- ================================================================= -->
<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer rules-caption-inner">
            <div class="rules-green-bar-flags">
                <a href="<?php echo (isset($_SERVER['HTTP_REFERER']) && !empty($_SERVER['HTTP_REFERER'])) ? htmlspecialchars($_SERVER['HTTP_REFERER']) : getLink('legal'); ?>" class="btn-rules-back">&larr; VOLTAR</a>
                <img src="<?php echo BASE_URL; ?>images/flags/br.gif" alt="Português" title="Português (BR)" class="flag-icon" onclick="changeLanguage('pt');" />
                <img src="<?php echo BASE_URL; ?>images/flags/us.gif" alt="English" title="English (US)" class="flag-icon" onclick="changeLanguage('en');" />
                <img src="<?php echo BASE_URL; ?>images/flags/es.gif" alt="Español" title="Español (ES)" class="flag-icon" onclick="changeLanguage('es');" />
                <img src="<?php echo BASE_URL; ?>images/flags/pl.gif" alt="Polski" title="Polski (PL)" class="flag-icon" onclick="changeLanguage('pl');" />
            </div>
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
                                        <div class="TableShadowContainerRightTop">
                                            <div class="TableShadowRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rt.gif);"></div>
                                        </div>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                    <tbody>
                                                        <!-- INTRODUÇÃO COM LETRA CAPITULAR MEDIEVAL -->
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px 14px; color: #4a2505; border-left: 4px solid #7f0000;">
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
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px 14px; color: #4a2505; border-left: 4px solid #7f0000;">
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
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px 14px; color: #4a2505; border-left: 4px solid #7f0000;">
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
                                                                    <li style="margin-bottom: 5px;">🔹 Exclusão do personagem, quando necessário.</li>
                                                                </ul>
                                                                <div align="center" style="font-family: 'Martel', Georgia, 'Times New Roman', serif; font-size: 13px; font-weight: bold; color: #4a2505; padding: 12px 18px; background: linear-gradient(180deg, #f8f1e5 0%, #ebdcc7 100%); border: 1px solid #c4ab84; border-left: 4px solid #7f0000; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.08); margin-top: 12px;">
                                                                    ✨ A aplicação de uma penalidade não impede a adoção de outras medidas administrativas para corrigir ou reparar os efeitos causados pela infração.
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <!-- RESPONSABILIDADE DO JOGADOR & CONDUTAS PROIBIDAS -->
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px 14px; color: #4a2505; border-left: 4px solid #7f0000;">
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
                                                                    ✨ O objetivo das regras é garantir que o <span style="color: #7f0000;">NosleiraOT</span> permaneça um ambiente competitivo, organizado e agradável para todos.
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="TableShadowContainer">
                                            <div class="TableBottomShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bm.gif);">
                                                <div class="TableBottomLeftShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bl.gif);"></div>
                                                <div class="TableBottomRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-br.gif);"></div>
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
                                        <div class="TableShadowContainerRightTop">
                                            <div class="TableShadowRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rt.gif);"></div>
                                        </div>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                    <tbody>
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px 14px; color: #4a2505; border-left: 4px solid #7f0000;">
                                                                Normas de Jogo & Convivência (Clique para expandir o detalhamento)
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 14px;">

                                                                 <!-- REGRA 1 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">1) Comentários sobre Resets <span style="color:#e60000; font-size:12px; font-weight:bold;">[15 dias]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido espalhar boatos afirmando que o servidor vai resetar.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É estritamente proibido espalhar boatos, notícias falsas ou afirmar em qualquer canal do jogo/site/Discord que o servidor irá resetar.<br>
                                                                        <b>Penalidade:</b> Banimento de <b>15 dias</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 2 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">2) Free Itens Massivo <span style="color:#e60000; font-size:12px; font-weight:bold;">[60 dias]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido fazer doações ou free itens massivos afetando a economia.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        A realização massiva de "free itens" que afete a economia do servidor ou beneficie contas de forma irregular é proibida.<br>
                                                                        <b>Penalidade:</b> Banimento de <b>60 dias</b> ou exclusão da conta em casos reincidentes.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 3 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">3) Bloqueio de Hunts e Respawn <span style="color:#e60000; font-size:12px; font-weight:bold;">[15 dias]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido bloquear vias de acesso ou o respawn de monstros.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É proibido bloquear vias de acesso ou passagens de forma a impedir outro jogador de evoluir (up) ou sair do local, assim como impedir o respawn de monstros de maneira intencional.<br><br>
                                                                        <span style="color: #4a2c00; background-color: #fff4e0; border-left: 3px solid #d4a359; padding: 6px 10px; display: block; margin: 4px 0 8px 0; border-radius: 3px;">
                                                                            <b>Adendo:</b> <i>(A regra é aplicável apenas para players neutros. Para os players que estão em Guild System / Guild War, a regra não se aplica e situações atípicas serão analisadas pela Staff).</i>
                                                                        </span>
                                                                        <b>Penalidade:</b> Banimento de <b>15 dias</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 4 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">4) Bloqueio de Quests <span style="color:#e60000; font-size:12px; font-weight:bold;">[15 dias]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido bloquear acessos a Quests ou atrapalhar times.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Bloquear acessos a Quests ou atrapalhar jogadores durante a realização de missões causando danos intencionais ao time é extremamente proibido. Infrações geram banimento.<br><br>
                                                                        <span style="color: #4a2c00; background-color: #fff4e0; border-left: 3px solid #d4a359; padding: 6px 10px; display: block; margin: 4px 0 8px 0; border-radius: 3px;">
                                                                            <b>Adendo:</b> <i>(A regra é aplicável apenas para players neutros. Para os players que estão em Guild System / Guild War, a regra não se aplica e situações atípicas serão analisadas pela Staff).</i>
                                                                        </span>
                                                                        <b>Penalidade:</b> Banimento de <b>15 dias</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 5 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">5) Respeito à Equipe & Canal Help <span style="color:#e60000; font-size:12px; font-weight:bold;">[30 dias a Permanente]</span></span>
                                                                                <span class="rule-accordion-brief">Ofender tutores no Help ou desrespeitar a staff.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Ofender tutores no canal HELP ou desrespeitar orientações de Gamemasters (GMs), CMs e GOD.<br>
                                                                        <b>Penalidade:</b> Banimento de <b>30 dias</b> ou <b>Permanente</b> dependendo da gravidade da ofensa.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 6 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">6) Abuso de Novatos & Zonas Neutras <span style="color:#e60000; font-size:12px; font-weight:bold;">[15 dias]</span></span>
                                                                                <span class="rule-accordion-brief">Conduta abusiva perante novatos ou em templos/barcos.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Ter conduta abusiva perante jogador novato impedindo sua progressão, ou abusar de bloqueios em lojas de potes, templos, barcos e cidades iniciais.<br>
                                                                        <b>Penalidade:</b> Banimento de <b>15 dias</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 7 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">7) Exploits, Bug Abuse & Duplicação (Dupes) <span style="color:#e60000; font-size:12px; font-weight:bold;">[Permanente]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido explorar falhas, bugs ou provocar rollbacks.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É estritamente proibido utilizar qualquer bug, falha de mapa, erro de script ou provocar instabilidades para duplicar itens ou obter vantagens indevidas.<br>
                                                                        <b>Penalidade:</b> <b>Banimento Permanente (Delete)</b> de todas as contas vinculadas.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 8 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">8) Divulgação de Outros Servidores <span style="color:#e60000; font-size:12px; font-weight:bold;">[Permanente]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido anúncios e propaganda de outros servidores.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Anunciar, divulgar ou fazer propaganda de outros servidores de Open Tibia em qualquer canal do NosleiraOT.<br>
                                                                        <b>Penalidade:</b> <b>Banimento Permanente</b> imediato.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 9 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">9) Abuso de Multicliente (MC) no PvP ou Trap <span style="color:#e60000; font-size:12px; font-weight:bold;">[Permanente]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido uso de MCs para obter vantagens em battles PvP ou Boss Raids.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        O uso de MC para obter vantagens de dano, trap ou combate no PvP, assim como em Boss Raids, é estritamente proibido.<br>
                                                                        <b>Penalidade:</b> <b>Banimento Permanente</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 10 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">10) Fraude em Doações & Chargeback <span style="color:#e60000; font-size:12px; font-weight:bold;">[Permanente]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido estornos fraudulentos ou tentativas de golpe financeiro.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Tentativa de estorno fraudulento, chargeback ou não pagamento de doações realizadas na loja.<br>
                                                                        <b>Penalidade:</b> <b>Banimento Permanente (Delete)</b> da conta.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 11 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">11) Comércio de Scripts de Bot <span style="color:#e60000; font-size:12px; font-weight:bold;">[Permanente]</span></span>
                                                                                <span class="rule-accordion-brief">Proibida a venda ou anúncio de scripts para automação.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É proibido comercializar ou anunciar scripts de automação, cavebot ou macros no servidor e em seus canais oficiais.<br>
                                                                        <b>Penalidade:</b> <b>Banimento Permanente</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 12 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">12) RMT e Comercialização In-Game <span style="color:#e60000; font-size:12px; font-weight:bold;">[Permanente In-Game]</span></span>
                                                                                <span class="rule-accordion-brief">Extremamente proibido anúncio e comércio por moeda real dentro do jogo.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É extremamente proibida a venda, compra e comercialização de personagens, contas ou itens por dinheiro real (RMT) <b>dentro do jogo</b> (canais públicos, Trade, chats, mensagens privadas ou envio de contatos/PIX).<br><br>
                                                                        • <b>Negociações Externas (Fora do Jogo):</b> O RMT realizado por fora do jogo é de <b>total e estrita responsabilidade dos próprios jogadores envolvidos</b>. Nós da Staff <b>não recomendamos</b> negociações externas e não nos responsabilizamos por golpes ou prejuízos.<br><br>
                                                                        <b>Penalidade:</b> Anunciar ou realizar comércio por dinheiro real <b>in-game</b> resultará em <b>Banimento Permanente (Delete)</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 13 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">13) Trocas entre Servidores <span style="color:#e60000; font-size:12px; font-weight:bold;">[Permanente]</span></span>
                                                                                <span class="rule-accordion-brief">Proibida a negociação cruzada com outros servidores.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É estritamente proibida a troca de itens e personagens entre o NosleiraOT e outros servidores de Open Tibia.<br>
                                                                        <b>Penalidade:</b> <b>Banimento Permanente</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 14 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">14) Trapaças no PvP (Magebomb / Navigation) <span style="color:#e60000; font-size:12px; font-weight:bold;">[Permanente]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido uso de magebombs, navigations ou trapaças no combate.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Proibido o uso de magebombs, conexões coordenadas de navigation ou trapaças de automação de combate.<br>
                                                                        <b>Penalidade:</b> <b>Banimento Permanente</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 15 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">15) Uso Abusivo de Low Level em Battle <span style="color:#e60000; font-size:12px; font-weight:bold;">[90 dias]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido usar chars noobs intencionalmente para remover traps.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Utilizar de forma intencional personagens de nível muito inferior ao da batalha para obter vantagens no PvP ou remover traps.<br>
                                                                        <b>Penalidade:</b> Banimento de <b>90 dias</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 16 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">16) Abuso no Guild Chat (/guildbc) <span style="color:#e60000; font-size:12px; font-weight:bold;">[90 dias]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido usar o canal da guilda para ofensas ou poluição.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Utilizar a ferramenta de broadcast da guilda (/guildbc) para propagar ofensas extremadas ou perturbação da ordem.<br>
                                                                        <b>Penalidade:</b> Banimento de <b>90 dias</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 17 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">17) Uso de Bots, Cavebot e Programas Externos <span style="color:#e60000; font-size:12px; font-weight:bold;">[Permanente]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido Cavebot, AFK Bot, Auto-Heal ou qualquer automação.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        É estritamente proibido o uso de Cavebot, Auto-Heal, Aimbot, macros de teclado ou qualquer programa externo que automatize ações no jogo.<br>
                                                                        <b>Penalidade:</b> <b>Banimento Permanente (Delete)</b>.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA 18 -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">18) Tentativa de Phishing & Roubo de Contas <span style="color:#e60000; font-size:12px; font-weight:bold;">[Permanente]</span></span>
                                                                                <span class="rule-accordion-brief">Proibido envio de links maliciosos ou tentativa de roubo de senhas.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Divulgar links falsos (phishing), malwares ou tentar obter senhas e contas de outros jogadores.<br>
                                                                        <b>Penalidade:</b> <b>Banimento Permanente (Delete)</b> de todas as contas associadas.
                                                                    </div>
                                                                </details>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="TableShadowContainer">
                                            <div class="TableBottomShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bm.gif);">
                                                <div class="TableBottomLeftShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bl.gif);"></div>
                                                <div class="TableBottomRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-br.gif);"></div>
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
<!-- BOX: REGRAS DE NOMES DE PERSONAGENS (NOMES)                      -->
<!-- ================================================================= -->
<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">Regras de Nomes de Personagens</div>
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
                                        <div class="TableShadowContainerRightTop">
                                            <div class="TableShadowRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rt.gif);"></div>
                                        </div>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                    <tbody>
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                             <td style="font-weight:bold; font-size: 14px; padding: 10px 14px; color: #4a2505; border-left: 4px solid #7f0000;">
                                                                🏷️ Diretrizes de Nomenclatura (Clique para expandir)
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 14px;">

                                                                <!-- REGRA DE NOME A -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">A) Nome que Viola Regra de Suporte <span style="color:#e60000; font-size:12px; font-weight:bold;">[Namelock / Ban]</span></span>
                                                                                <span class="rule-accordion-brief">Não crie nomes que imitem ou façam referência ao suporte ou à administração do jogo.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Nomes que possam ser confundidos com membros do suporte ou da administração, como "GM", "Admin", "Suporte", ou qualquer variação que sugira autoridade dentro do jogo, são estritamente proibidos. Isso inclui nomes que possam enganar outros jogadores, fazendo-os acreditar que o portador do nome possui poderes ou responsabilidades administrativas. Esses nomes serão imediatamente alterados, e os jogadores podem enfrentar penalidades severas, incluindo banimentos.<br><br>
                                                                        <b>Penalidade:</b> Alteração forçada do nome (Namelock) e/ou banimento temporário em caso de má fé.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA DE NOME B -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">B) Nome Ofensivo <span style="color:#e60000; font-size:12px; font-weight:bold;">[Namelock / Ban]</span></span>
                                                                                <span class="rule-accordion-brief">É proibido criar nomes ofensivos ou desrespeitosos.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Nomes ofensivos incluem, mas não se limitam a, linguagem vulgar, insultos, ameaças, comentários racistas, sexistas ou qualquer forma de discurso de ódio. O objetivo é garantir um ambiente de jogo respeitoso e seguro para todos os jogadores. Nomes que violem esta regra serão alterados pela administração, e os jogadores responsáveis podem receber advertências ou outras penalidades.<br><br>
                                                                        <b>Penalidade:</b> Alteração forçada do nome (Namelock) e/ou banimento por ofensa.
                                                                    </div>
                                                                </details>

                                                                <!-- REGRA DE NOME C -->
                                                                <details class="rule-accordion">
                                                                    <summary>
                                                                        <div class="rule-summary-left">
                                                                            <div class="rule-icon-box">&#9660;</div>
                                                                            <div class="rule-title-group">
                                                                                <span class="rule-accordion-title">C) Nome Inadequado <span style="color:#e60000; font-size:12px; font-weight:bold;">[Namelock]</span></span>
                                                                                <span class="rule-accordion-brief">Os nomes devem ser apropriados e coerentes com o ambiente do jogo.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rule-action-badge">
                                                                            <span class="badge-text-closed">&#43; Ler Regra</span>
                                                                            <span class="badge-text-open">&#8722; Fechar</span>
                                                                        </div>
                                                                    </summary>
                                                                    <div class="rule-accordion-body">
                                                                        Nomes inadequados são aqueles que não são apropriados para um ambiente de jogo, incluindo referências explícitas a violência extrema, temas sexuais ou qualquer outro conteúdo impróprio. Também inclui nomes que imitem ou façam referência desrespeitosa a figuras políticas ou celebridades. Nomes que não atendam a esses critérios serão modificados pela administração, e os jogadores podem ser advertidos.<br><br>
                                                                        <b>Penalidade:</b> Alteração forçada do nome (Namelock).
                                                                    </div>
                                                                </details>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="TableShadowContainer">
                                            <div class="TableBottomShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bm.gif);">
                                                <div class="TableBottomLeftShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bl.gif);"></div>
                                                <div class="TableBottomRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-br.gif);"></div>
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
            <div class="Text">Guia de Atendimento & Denúncias In-Game</div>
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
                                        <div class="TableShadowContainerRightTop">
                                            <div class="TableShadowRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rt.gif);"></div>
                                        </div>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                    <tbody>
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px 14px; color: #4a2505; border-left: 4px solid #7f0000;">
                                                                🚨 Diretrizes para Atendimento & Suporte via CTRL + R
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px;">
                                                                
                                                                <!-- BANNER PRINCIPAL -->
                                                                <div class="report-banner">
                                                                    <div>
                                                                        <div class="report-banner-title">📢 Atendimento Oficial In-Game por Gamemasters</div>
                                                                        <div class="report-banner-sub">Siga atentamente as orientações abaixo para garantir o suporte rápido da equipe.</div>
                                                                    </div>
                                                                    <div style="text-align: right;">
                                                                        <span class="tibia-key">CTRL</span> <span style="color:#fff3db; font-weight:bold;">+</span> <span class="tibia-key">R</span>
                                                                    </div>
                                                                </div>

                                                                <!-- GRID DE CARDS COM REGRAS E DIRETRIZES -->
                                                                <div class="report-grid">
                                                                    
                                                                    <!-- CARD 1: FORMATAÇÃO DO REPORT -->
                                                                    <div class="report-card">
                                                                        <div class="report-card-title">✍️ 1. Como Enviar o Report</div>
                                                                        <ul class="report-list">
                                                                            <li class="report-list-item">
                                                                                <span class="report-badge-do">CORRETO</span> Escreva objetivamente: <b>"Situação/Dúvida/Problema + Nickname(s)"</b> (se houver).
                                                                            </li>
                                                                            <li class="report-list-item">
                                                                                <span class="report-badge-dont">ERRADO</span> Reports genéricos como <i>"gm on?"</i>, <i>"alguém aí?"</i> ou <i>"mc aqui"</i> <b>não serão respondidos nem atendidos</b>.
                                                                            </li>
                                                                            <li class="report-list-item">
                                                                                <span class="tibia-key">CTRL</span> + <span class="tibia-key">R</span> é o canal exclusivo para suporte in-game. Mensagens em canais impróprios (Help, PM, Telegram, Discord) não serão processadas.
                                                                            </li>
                                                                        </ul>
                                                                    </div>

                                                                    <!-- CARD 2: CONDUTA DOS GMs -->
                                                                    <div class="report-card">
                                                                        <div class="report-card-title">🛡️ 2. Atendimento & Privacidade dos GMs</div>
                                                                        <ul class="report-list">
                                                                            <li class="report-list-item">
                                                                                GMs atuam com base na descrição fornecida e <b>não necessitam responder o chat</b> para efetuar a verificação ou aplicação da sanção.
                                                                            </li>
                                                                            <li class="report-list-item">
                                                                                A equipe preserva o sigilo e <b>não se obriga a prestar contas</b> do resultado das investigações ou punições aplicadas ao denunciado.
                                                                            </li>
                                                                            <li class="report-list-item">
                                                                                Denúncias realizadas por jogadores não envolvidos ou distantes da situação ocorrida poderão ficar sem atendimento.
                                                                            </li>
                                                                        </ul>
                                                                    </div>

                                                                    <!-- CARD 3: PREVENÇÃO DE SPAM E ABUSOS -->
                                                                    <div class="report-card">
                                                                        <div class="report-card-title">🚫 3. Proibições & Uso Indevido</div>
                                                                        <ul class="report-list">
                                                                            <li class="report-list-item">
                                                                                <b>Um report basta:</b> Não envie a mesma denúncia com múltiplos personagens. Isso não acelera a análise e prejudica o atendimento.
                                                                            </li>
                                                                            <li class="report-list-item">
                                                                                <b>Spam Report:</b> Abrir e fechar repetidamente o chamado para chamar atenção resultará em banimento imediato.
                                                                            </li>
                                                                            <li class="report-list-item">
                                                                                <b>False Report:</b> Denúncias falsas, forjadas ou mal-intencionadas acarretam banimento severo da conta.
                                                                            </li>
                                                                            <li class="report-list-item">
                                                                                Diferencie os canais: <span class="tibia-key">CTRL</span> + <span class="tibia-key">R</span> é atendido por GMs; <b>Tickets no Site</b> tratam de assuntos administrativos/financeiros com a Administração.
                                                                            </li>
                                                                        </ul>
                                                                    </div>

                                                                    <!-- CARD 4: RECOMENDAÇÕES E ÉTICA -->
                                                                    <div class="report-card">
                                                                        <div class="report-card-title">⚖️ 4. Recomendações & Conduta Ética</div>
                                                                        <ul class="report-list">
                                                                            <li class="report-list-item">
                                                                                Para dúvidas gerais sobre o jogo, utilize primeiramente o <b>Help Channel</b> para suporte rápido de tutores e jogadores.
                                                                            </li>
                                                                            <li class="report-list-item">
                                                                                Evite acusações infundadas sem provas. Em caso de dúvidas, solicite educadamente que a equipe averigúe o ocorrido.
                                                                            </li>
                                                                            <li class="report-list-item">
                                                                                <b>Jamais retribua uma infração:</b> Não combata uma injustiça cometendo outra infração, sob pena de também ser punido.
                                                                            </li>
                                                                            <li class="report-list-item">
                                                                                Mantenha a paciência ao reportar. Todas as verificações são feitas de forma criteriosa e responsável.
                                                                            </li>
                                                                        </ul>
                                                                    </div>

                                                                </div>

                                                                 <!-- NOTA FINAL DE DESTAQUE -->
                                                                <div class="report-footer-note">
                                                                    O cumprimento destas diretrizes garante um atendimento eficiente e mantém o NosleiraOT justo e organizado para todos!
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="TableShadowContainer">
                                            <div class="TableBottomShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bm.gif);">
                                                <div class="TableBottomLeftShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bl.gif);"></div>
                                                <div class="TableBottomRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-br.gif);"></div>
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


