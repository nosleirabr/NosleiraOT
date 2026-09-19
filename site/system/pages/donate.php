<?php
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Donate';
?>

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

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

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
.rules-green-bar-flags a {
    display: inline-block;
    line-height: 0;
    text-decoration: none;
    transition: transform 0.15s ease-in-out;
}
.rules-green-bar-flags a:hover {
    transform: scale(1.2);
}
.flag-icon {
    width: 18px;
    height: 12px;
    border: 1px solid #0b3c6f !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.3);
    display: block;
    cursor: pointer;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    -ms-interpolation-mode: nearest-neighbor;
}
</style>

<?php if (!isset($_POST['accept_terms'])): ?>
<form action="?subtopic=donate" method="post">
    <div class="TableContainer">
        <div class="CaptionContainer">
            <div class="CaptionInnerContainer rules-caption-inner">
                <div class="rules-green-bar-flags">
                    <img src="<?php echo BASE_URL; ?>images/flags/br.gif" alt="Português" title="Português (BR)" class="flag-icon" onclick="changeLanguage('pt');" style="cursor: pointer;" />
                    <img src="<?php echo BASE_URL; ?>images/flags/us.gif" alt="English" title="English (US)" class="flag-icon" onclick="changeLanguage('en');" style="cursor: pointer;" />
                    <img src="<?php echo BASE_URL; ?>images/flags/es.gif" alt="Español" title="Español (ES)" class="flag-icon" onclick="changeLanguage('es');" style="cursor: pointer;" />
                    <img src="<?php echo BASE_URL; ?>images/flags/pl.gif" alt="Polski" title="Polski (PL)" class="flag-icon" onclick="changeLanguage('pl');" style="cursor: pointer;" />
                </div>
                <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
                <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
                <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
                <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
                <div class="Text">DONATE</div>
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
                                                                <td style="padding: 10px;">
                                                                    Antes de prosseguir, você deve concordar com as nossas regras de doação. A sua doação é extremamente importante para nós, não apenas pelo valor financeiro, mas pelo apoio ao projeto, para que possamos continuar trabalhando no desenvolvimento de novos sistemas, na hospedagem, na infraestrutura e na manutenção do servidor. Como agradecimento por essa doação, enviaremos pontos para sua conta, que podem ser usados na loja do jogo, onde você encontrará diversas ofertas para o seu personagem.
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                                <td style="font-weight:bold; font-size: 14px; padding: 10px;">
                                                                    Regras (Clique para expandir o detalhamento)
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                                <td style="padding: 14px;">
                                                                    <!-- REGRA 1 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">1. Reembolso</span>
                                                                                    <span class="rule-accordion-brief">Você concorda plenamente que nenhum valor doado será reembolsado.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            Você tem pleno consentimento de que qualquer valor de doação não será reembolsado sob nenhuma circunstância.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 2 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">2. Tempo de Entrega</span>
                                                                                    <span class="rule-accordion-brief">Os pontos são geralmente entregues automaticamente pelo sistema...</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            Os pontos são geralmente entregues automaticamente pelo sistema. No entanto, se houver alguma falha ou instabilidade, temos um prazo máximo de 24 horas para que os pontos sejam entregues na sua conta.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 3 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">3. Segurança</span>
                                                                                    <span class="rule-accordion-brief">O jogador é o único responsável pela segurança dos seus dados...</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            Nosso servidor possui diversos métodos de segurança, como certificado SSL, criptografia de dados e regras de senhas fortes. No entanto, a equipe não se responsabiliza pela sua conta, personagens, itens e acessos de terceiros. A segurança dos dados dentro do servidor é de total e exclusiva responsabilidade do jogador.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 4 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">4. Regras do Servidor</span>
                                                                                    <span class="rule-accordion-brief">O jogador está ciente de que deve seguir as regras do servidor.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            O jogador está ciente de que deve seguir todas as regras do servidor. Se alguma regra for quebrada, a punição apropriada será aplicada e a doação não será reembolsada, conforme descrito na primeira regra desta página.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 5 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">5. Problemas no Servidor</span>
                                                                                    <span class="rule-accordion-brief">Como este é um projeto de longo prazo, problemas podem ocorrer.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            Embora este seja um projeto de longo prazo com foco na estabilidade (versão 7.4), imprevistos podem ocorrer. Em caso de qualquer problema técnico de nossa parte que resulte em perda generalizada (como rollbacks ou resets acidentais), nós possuímos backups de todos os salvamentos do servidor. Todos os pontos que tenham sido gastos ou perdidos nessas situações específicas serão devidamente restaurados.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 6 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">6. Mudanças de Balanceamento</span>
                                                                                    <span class="rule-accordion-brief">Qualquer elemento no jogo pode ser alterado e balanceado.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            O servidor busca manter a essência da versão 7.4, mas qualquer coisa no jogo pode ser alterada ou balanceada visando a saúde da comunidade. Não nos responsabilizamos por nenhuma perda no valor de itens/bens comprados, nem por qualquer outra coisa no jogo ou na loja adquirida por doações caso sofram ajustes de balanceamento.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 7 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">7. Concordância</span>
                                                                                    <span class="rule-accordion-brief">Ao continuar nesta página, você concorda totalmente com os termos.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            Ao prosseguir nesta página, você concorda integralmente que o valor enviado ao servidor é uma doação voluntária, portanto, não há vínculo com compras ou remessas comerciais por parte do servidor. Em seguida, enviaremos, como bônus por esta doação, um valor proporcional em moedas (points).
                                                                        </div>
                                                                    </details>

                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                                <td style="padding: 10px; text-align: center;">
                                                                    <label style="cursor: pointer; font-weight: 500; font-size: 14px;"><input type="checkbox" name="accept_terms" value="1" required> Eu aceito os termos de doação e desejo prosseguir.</label>
                                                                    <br><br>
                                                                    <input type="submit" value="Continuar">
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div class="TableShadowContainerRightTop">
                                                <div class="TableShadowRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rt.gif);"></div>
                                            </div>
                                            <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                                <div class="TableContentContainer">
                                                    <!-- End table inner -->
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
</form>

<?php else: ?>

<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer rules-caption-inner">
            <div class="rules-green-bar-flags">
                <img src="<?php echo BASE_URL; ?>images/flags/br.gif" alt="Português" title="Português (BR)" class="flag-icon" onclick="changeLanguage('pt');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/us.gif" alt="English" title="English (US)" class="flag-icon" onclick="changeLanguage('en');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/es.gif" alt="Español" title="Español (ES)" class="flag-icon" onclick="changeLanguage('es');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/pl.gif" alt="Polski" title="Polski (PL)" class="flag-icon" onclick="changeLanguage('pl');" style="cursor: pointer;" />
            </div>
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">DONATE</div>
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
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px;">
                                                                Método de Pagamento
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 10px; text-align: center;">
                                                                <div style="display:flex; justify-content: space-around; flex-wrap: wrap;">
                                                                    <!-- Stripe -->
                                                                    <div style="border: 1px solid #4a4a4a; padding: 10px; border-radius: 5px; width: 150px; background-color: #2e3440; color: #d8dee9; margin: 10px;">
                                                                        <div style="font-weight: bold; margin-bottom: 5px;">Stripe</div>
                                                                        <div style="font-size: 12px; margin-bottom: 10px;">Tempo de Processamento:<br>Imediato</div>
                                                                    </div>
                                                                    <!-- PIX -->
                                                                    <div style="border: 1px solid #4a4a4a; padding: 10px; border-radius: 5px; width: 150px; background-color: #2e3440; color: #d8dee9; margin: 10px;">
                                                                        <div style="font-weight: bold; margin-bottom: 5px;">PIX</div>
                                                                        <div style="font-size: 12px; margin-bottom: 10px;">Tempo de Processamento:<br>Imediato</div>
                                                                    </div>
                                                                    <!-- Tibia Coins -->
                                                                    <div style="border: 1px solid #4a4a4a; padding: 10px; border-radius: 5px; width: 150px; background-color: #2e3440; color: #d8dee9; margin: 10px;">
                                                                        <div style="font-weight: bold; margin-bottom: 5px;">Tibia Coins</div>
                                                                        <div style="font-size: 12px; margin-bottom: 10px;">Tempo de Processamento:<br>1-24hrs</div>
                                                                    </div>
                                                                </div>
                                                                <div style="font-size: 12px; text-align: left; margin-top: 10px;">
                                                                    * Por favor, note que preços diferentes podem ser aplicados dependendo do seu método de pagamento selecionado.
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px;">
                                                                Pacote de Pontos
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 10px;">
                                                                <form action="?subtopic=donate&action=checkout" method="post">
                                                                    <label style="font-weight: bold;">Selecione o valor:</label>
                                                                    <select name="points_package" style="margin-left: 10px; padding: 3px;">
                                                                        <option value="100">100 Points (R$ 10,00)</option>
                                                                        <option value="300">300 Points (R$ 30,00)</option>
                                                                        <option value="500">500 Points (R$ 50,00)</option>
                                                                        <option value="1000">1000 Points (R$ 100,00)</option>
                                                                        <option value="2000">2000 Points (R$ 200,00)</option>
                                                                        <option value="3500">3500 Points (R$ 350,00)</option>
                                                                        <option value="5000">5000 Points (R$ 500,00)</option>
                                                                    </select>
                                                                    <input type="submit" value="Continuar" style="margin-left: 10px;">
                                                                </form>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="TableShadowContainerRightTop">
                                            <div class="TableShadowRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rt.gif);"></div>
                                        </div>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <!-- End table inner -->
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

<?php endif; ?>
