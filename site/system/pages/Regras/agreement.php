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
$title = 'Service Agreement';
?>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

/* Tipografia e Estrutura dos Termos */
.agreement-paragraph {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #3d2208;
    line-height: 1.68;
    margin-bottom: 12px;
    text-align: justify;
}
.agreement-paragraph:last-child {
    margin-bottom: 0;
}

.agreement-warning-box {
    background: linear-gradient(180deg, #fffbf2 0%, #fcedd7 100%);
    border: 1px solid #dfc79b;
    border-left: 4px solid #b86200;
    padding: 10px 14px;
    border-radius: 4px;
    margin-bottom: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: #3d2208;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.agreement-clause-num {
    font-weight: 700;
    color: #4a2505;
}

.agreement-highlight {
    font-weight: 600;
    color: #7f0000;
}

/* Header com BotÃ£o Voltar e Bandeiras */
.agreement-header-caption {
    position: relative !important;
}

.agreement-header-right {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 50;
}

.btn-agreement-back {
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
}
.btn-agreement-back:hover {
    background: linear-gradient(180deg, #516b8a 0%, #2c3c4f 100%);
    border-color: #8bb3e0;
    color: #ffffff !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    transform: translateY(-1px);
}

.agreement-flags {
    display: flex;
    align-items: center;
    gap: 6px;
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

.section-spacer {
    margin-bottom: 14px;
}
</style>

<!-- ================================================================= -->
<!-- HEADER PRINCIPAL: CONTRATO DE SERVIÃ‡O <b>NosleiraOT</b>                 -->
<!-- ================================================================= -->
<div class="TableContainer" style="margin-bottom: 16px;">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer agreement-header-caption">
            <div class="agreement-header-right">
                <a href="<?php echo (isset($_SERVER['HTTP_REFERER']) && !empty($_SERVER['HTTP_REFERER'])) ? htmlspecialchars($_SERVER['HTTP_REFERER']) : getLink('Regras/rules'); ?>" class="btn-agreement-back">â† VOLTAR</a>
                <div class="agreement-flags">
                    <img src="<?php echo BASE_URL; ?>images/flags/br.gif" alt="PortuguÃªs" title="PortuguÃªs (BR)" class="flag-icon" onclick="changeLanguage('pt');" />
                    <img src="<?php echo BASE_URL; ?>images/flags/us.gif" alt="English" title="English (US)" class="flag-icon" onclick="changeLanguage('en');" />
                    <img src="<?php echo BASE_URL; ?>images/flags/es.gif" alt="EspaÃ±ol" title="EspaÃ±ol (ES)" class="flag-icon" onclick="changeLanguage('es');" />
                    <img src="<?php echo BASE_URL; ?>images/flags/pl.gif" alt="Polski" title="Polski (PL)" class="flag-icon" onclick="changeLanguage('pl');" />
                </div>
            </div>
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">CONTRATO DE SERVIÃ‡O <b>NosleiraOT</b></div>
            <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
        </div>
    </div>
</div>

<!-- ================================================================= -->
<!-- SEÃ‡ÃƒO 1: INTRODUÃ‡ÃƒO                                               -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">1 - INTRODUÃ‡ÃƒO</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px 18px;">
                                                                <div class="agreement-warning-box">
                                                                    <span class="agreement-clause-num">1.0. âš ï¸ AVISO DE CONTEÃšDO ADULTO:</span> "<b>NosleiraOT</b>" Ã© um jogo destinado exclusivamente para usuÃ¡rios com 18 anos ou mais. Ao acessar ou usar este serviÃ§o, vocÃª confirma que tem 18 anos ou mais.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.1.</span> Ao acessar ou utilizar o site da <b>NosleiraOT Soluções Digitais LTDA</b> e/ou registrar uma conta para o jogo "<b>NosleiraOT</b>", vocÃª concorda com estes Termos de ServiÃ§o e todas as polÃ­ticas e regulamentos do jogo, incluindo nossa PolÃ­tica de Privacidade e regras especÃ­ficas.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.2.</span> Este documento estabelece os termos sob os quais a <b>NosleiraOT Soluções Digitais LTDA</b> fornece acesso a uma conta para vocÃª jogar o RPG online "<b>NosleiraOT</b>".
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.3.</span> Se vocÃª nÃ£o concordar com estes Termos, nÃ£o utilize o site ou o jogo "<b>NosleiraOT</b>". A aceitaÃ§Ã£o ou uso contÃ­nuo do site ou jogo implica aceitaÃ§Ã£o irrestrita, mesmo que tÃ¡cita, de todos os termos e condiÃ§Ãµes descritos abaixo.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.4.</span> Estes Termos podem ser atualizados pela <b>NosleiraOT Soluções Digitais LTDA</b> devido a alteraÃ§Ãµes na legislaÃ§Ã£o aplicÃ¡vel, requisitos regulatÃ³rios ou por decisÃ£o prÃ³pria. A versÃ£o atualizada estarÃ¡ disponÃ­vel no site, e o uso contÃ­nuo do jogo ou site apÃ³s as alteraÃ§Ãµes constituirÃ¡ aceitaÃ§Ã£o dessas mudanÃ§as.
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

<!-- ================================================================= -->
<!-- SEÃ‡ÃƒO 2: USO CONSCIENTE E SAÃšDE                                   -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">2 - USO CONSCIENTE E SAÃšDE</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px 18px;">
                                                                <div class="agreement-warning-box">
                                                                    <span class="agreement-clause-num">2.1. âš ï¸ AVISO DE USO COMPULSIVO:</span> A exposiÃ§Ã£o prolongada a videogames pode causar efeitos adversos na saÃºde fÃ­sica e mental. Recomendamos fazer pausas regulares, manter hÃ¡bitos saudÃ¡veis de jogo e buscar ajuda profissional se vocÃª ou alguÃ©m que vocÃª conhece mostrar sinais de vÃ­cio em jogos.
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

<!-- ================================================================= -->
<!-- SEÃ‡ÃƒO 3: ISENÃ‡ÃƒO DE RESPONSABILIDADE                              -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">3 - ISENÃ‡ÃƒO DE RESPONSABILIDADE</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px 18px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">3.1.</span> O jogo "<b>NosleiraOT</b>" Ã© fornecido "como estÃ¡", sem garantias de operaÃ§Ã£o contÃ­nua, ausÃªncia de erros ou vulnerabilidades. A <b>NosleiraOT Soluções Digitais LTDA</b> nÃ£o oferece garantias expressas ou implÃ­citas de qualquer tipo, incluindo, mas nÃ£o se limitando a garantias de tÃ­tulo, conformidade, comercializaÃ§Ã£o ou adequaÃ§Ã£o a um propÃ³sito especÃ­fico.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">3.2.</span> O uso do software Ã© de sua exclusiva responsabilidade. A <b>NosleiraOT Soluções Digitais LTDA</b> nÃ£o garante que o software, o jogo ou sua conta funcionarÃ¡ de forma ininterrupta, sem erros, de forma segura ou livre de vÃ­rus.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">3.3.</span> A <b>NosleiraOT Soluções Digitais LTDA</b> nÃ£o Ã© responsÃ¡vel por eventos imprevisÃ­veis ou de forÃ§a maior que interfiram no jogo, como falhas tÃ©cnicas, ataques de terceiros (por exemplo, hacking ou DDoS), interrupÃ§Ãµes de serviÃ§o de internet ou outros fatores alÃ©m do controle da Empresa.
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

<!-- ================================================================= -->
<!-- SEÃ‡ÃƒO 4: LIMITAÃ‡ÃƒO DE RESPONSABILIDADE                            -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">4 - LIMITAÃ‡ÃƒO DE RESPONSABILIDADE</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px 18px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">4.1.</span> A <b>NosleiraOT Soluções Digitais LTDA</b> nÃ£o Ã© responsÃ¡vel por qualquer perda de lucros, dados, danos especiais, incidentais ou consequentes decorrentes do uso ou incapacidade de uso do jogo, incluindo a perda de itens, contas ou personagens devido a erros, manutenÃ§Ã£o do sistema ou alteraÃ§Ãµes na jogabilidade.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">4.2.</span> De acordo com o Artigo 927 do CÃ³digo Civil Brasileiro, a responsabilidade da <b>NosleiraOT Soluções Digitais LTDA</b> por danos sÃ³ se aplica em casos de dolo ou culpa grave, que nÃ£o se enquadram na natureza do serviÃ§o prestado. O usuÃ¡rio assume todos os riscos inerentes ao uso do jogo.
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

<!-- ================================================================= -->
<!-- SEÃ‡ÃƒO 5: OBRIGAÃ‡Ã•ES DO USUÃRIO                                    -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">5 - OBRIGAÃ‡Ã•ES DO USUÃRIO</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px 18px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">5.1.</span> O usuÃ¡rio deve cumprir todas as regras do "<b>NosleiraOT</b>", disponÃ­veis no site oficial do jogo. O descumprimento dessas regras pode resultar em suspensÃ£o ou exclusÃ£o da conta, sem direito a reembolso ou compensaÃ§Ã£o. As obrigaÃ§Ãµes contratuais do usuÃ¡rio estÃ£o sujeitas aos Artigos 421 e 422 do CÃ³digo Civil Brasileiro, que tratam dos princÃ­pios da boa-fÃ© e da funÃ§Ã£o social do contrato.
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

<!-- ================================================================= -->
<!-- SEÃ‡ÃƒO 6: PROTEÃ‡ÃƒO DE DADOS E PRIVACIDADE                          -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer" id="privacidade">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">6 - PROTEÃ‡ÃƒO DE DADOS E PRIVACIDADE</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px 18px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">6.1.</span> A <b>NosleiraOT Soluções Digitais LTDA</b> estÃ¡ em conformidade com a legislaÃ§Ã£o brasileira de proteÃ§Ã£o de dados, incluindo a Lei Geral de ProteÃ§Ã£o de Dados (LGPD - Lei nÂº 13.709/2018). Os dados pessoais dos usuÃ¡rios serÃ£o coletados, armazenados e processados exclusivamente para fins relacionados ao serviÃ§o e Ã  melhoria da experiÃªncia no jogo "<b>NosleiraOT</b>".
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">6.2.</span> A <b>NosleiraOT Soluções Digitais LTDA</b> nÃ£o Ã© responsÃ¡vel por danos resultantes de violaÃ§Ãµes de seguranÃ§a causadas por terceiros ou pela negligÃªncia do usuÃ¡rio na proteÃ§Ã£o de seus dados de acesso, conforme previsto no Artigo 43 da LGPD.
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

<!-- ================================================================= -->
<!-- SEÃ‡ÃƒO 7: RESOLUÃ‡ÃƒO DE CONFLITOS                                   -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">7 - RESOLUÃ‡ÃƒO DE CONFLITOS</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px 18px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">7.1.</span> A <b>NosleiraOT Soluções Digitais LTDA</b> nÃ£o se compromete a participar de procedimentos de conciliaÃ§Ã£o, mediaÃ§Ã£o ou arbitragem fora do JudiciÃ¡rio. Quaisquer disputas decorrentes destes Termos serÃ£o resolvidas no Foro de Curitiba/PR, e as partes renunciam expressamente a qualquer outro foro, por mais privilegiado que seja.
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

<!-- ================================================================= -->
<!-- SEÃ‡ÃƒO 8: DISPOSIÃ‡Ã•ES FINAIS                                       -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">8 - DISPOSIÃ‡Ã•ES FINAIS</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px 18px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">8.1.</span> Ao criar uma conta ou usar o site, o usuÃ¡rio concorda com os Termos de ServiÃ§o e o Contrato de LicenÃ§a de UsuÃ¡rio Final do "<b>NosleiraOT</b>".
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">8.2.</span> Estes Termos representam o acordo integral entre as partes e substituem qualquer outro acordo, verbal ou escrito, relativo ao uso do jogo "<b>NosleiraOT</b>" e aos serviÃ§os oferecidos.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">8.3.</span> A <b>NosleiraOT Soluções Digitais LTDA</b> reserva-se o direito de tomar medidas legais em caso de descumprimento destes Termos pelo usuÃ¡rio.
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

<!-- ================================================================= -->
<!-- SEÃ‡ÃƒO 9: AVISO LEGAL                                              -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">9 - AVISO LEGAL</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px 18px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">9.1.</span> O jogo "<b>NosleiraOT</b>" Ã© um serviÃ§o de entretenimento, e o usuÃ¡rio reconhece que qualquer perda ou dano decorrente do uso do jogo nÃ£o pode ser atribuÃ­do Ã  <b>NosleiraOT Soluções Digitais LTDA</b> ou seus operadores.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">9.2.</span> Todos os usuÃ¡rios aceitam integralmente os riscos associados ao uso do serviÃ§o, renunciando expressamente a qualquer reivindicaÃ§Ã£o de compensaÃ§Ã£o contra a <b>NosleiraOT Soluções Digitais LTDA</b>, seus representantes ou parceiros.
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

