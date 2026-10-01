<?php
defined('MYAAC') or die('Direct access not allowed!');

$serverName = !empty($config['lua']['serverName']) ? $config['lua']['serverName'] : 'NosleiraOT';
$title = 'Documentos Legais — ' . $serverName;
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

/* Header com Bandeiras */
.legal-caption-inner {
    position: relative !important;
}

.legal-header-right {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 50;
}

.legal-flag-icon {
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
}
.legal-flag-icon:hover {
    transform: scale(1.2);
}

/* Ocultar barra superior do Google Translate */
.goog-te-banner-frame.skiptranslate,
.goog-te-banner-frame {
    display: none !important;
    visibility: hidden !important;
}
body {
    top: 0px !important;
}
.goog-tooltip, .goog-tooltip:hover {
    display: none !important;
}
.goog-text-highlight {
    background-color: transparent !important;
    box-shadow: none !important;
}

/* Cards de Documentos Legais */
.legal-cards-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.legal-card {
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 16px 20px;
    text-decoration: none !important;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    cursor: pointer;
}

.legal-card:hover {
    background: #fdfefe;
    border-color: #0084ff;
    box-shadow: 0 4px 12px rgba(0, 132, 255, 0.12);
    transform: translateY(-2px);
}

.legal-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    min-width: 44px;
    margin-right: 18px;
}

.legal-card-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-grow: 1;
}

.legal-card-title {
    font-family: 'Cinzel', 'Inter', -apple-system, sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #1b6497;
    letter-spacing: 0.3px;
    transition: color 0.15s ease;
}

.legal-card:hover .legal-card-title {
    color: #0084ff;
    text-decoration: underline;
}

.legal-card-subtitle {
    font-family: 'Inter', Verdana, sans-serif;
    font-size: 13px;
    color: #8c7355;
    line-height: 1.45;
}
</style>

<!-- ================================================================= -->
<!-- BOX 1: DOCUMENTOS LEGAIS                                          -->
<!-- ================================================================= -->
<div class="TableContainer" style="margin-bottom: 16px;">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer legal-caption-inner">
            <div class="legal-header-right">
                <img src="<?php echo BASE_URL; ?>images/flags/br.gif" alt="Português" title="Português (BR)" class="legal-flag-icon" onclick="changeLanguage('pt');" />
                <img src="<?php echo BASE_URL; ?>images/flags/us.gif" alt="English" title="English (US)" class="legal-flag-icon" onclick="changeLanguage('en');" />
                <img src="<?php echo BASE_URL; ?>images/flags/es.gif" alt="Español" title="Español (ES)" class="legal-flag-icon" onclick="changeLanguage('es');" />
                <img src="<?php echo BASE_URL; ?>images/flags/pl.gif" alt="Polski" title="Polski (PL)" class="legal-flag-icon" onclick="changeLanguage('pl');" />
            </div>
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">DOCUMENTOS LEGAIS</div>
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
                                                            <td style="padding: 16px 20px;">
                                                                <div style="font-family: 'Inter', Verdana, sans-serif; font-size: 13px; color: #3d2208; line-height: 1.6;">
                                                                    Nesta página você pode revisar todos os documentos legais atuais referentes ao <b><?php echo $serverName; ?></b> a qualquer momento.
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
<!-- BOX 2: DOCUMENTOS DISPONÍVEIS                                     -->
<!-- ================================================================= -->
<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">DOCUMENTOS DISPONÍVEIS</div>
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
                                                            <td style="padding: 16px 20px;">
                                                                <div class="legal-cards-container">

                                                                    <!-- 1. REGRAS DO SERVIDOR -->
                                                                    <a href="<?php echo getLink('legal/rules'); ?>" class="legal-card">
                                                                        <div class="legal-card-icon">
                                                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                                                            </svg>
                                                                        </div>
                                                                        <div class="legal-card-content">
                                                                            <div class="legal-card-title">Regras do <?php echo $serverName; ?></div>
                                                                            <div class="legal-card-subtitle">Regras do jogo e diretrizes de conduta dos jogadores</div>
                                                                        </div>
                                                                    </a>

                                                                    <!-- 2. CONTRATO DE SERVIÇO -->
                                                                    <a href="<?php echo getLink('legal/agreement'); ?>" class="legal-card">
                                                                        <div class="legal-card-icon">
                                                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                                                <polyline points="14 2 14 8 20 8"/>
                                                                                <line x1="16" y1="13" x2="8" y2="13"/>
                                                                                <line x1="16" y1="17" x2="8" y2="17"/>
                                                                                <polyline points="10 9 9 9 8 9"/>
                                                                            </svg>
                                                                        </div>
                                                                        <div class="legal-card-content">
                                                                            <div class="legal-card-title">Contrato de Serviço <?php echo $serverName; ?></div>
                                                                            <div class="legal-card-subtitle">Termos de serviço para uso do jogo</div>
                                                                        </div>
                                                                    </a>

                                                                    <!-- 3. CONTRATO ESTENDIDO -->
                                                                    <a href="<?php echo getLink('legal/extended'); ?>" class="legal-card">
                                                                        <div class="legal-card-icon">
                                                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                                                                <line x1="1" y1="10" x2="23" y2="10"/>
                                                                            </svg>
                                                                        </div>
                                                                        <div class="legal-card-content">
                                                                            <div class="legal-card-title">Contrato Estendido <?php echo $serverName; ?></div>
                                                                            <div class="legal-card-subtitle">Termos estendidos para serviços pagos (VIP, Coins)</div>
                                                                        </div>
                                                                    </a>

                                                                    <!-- 4. CONTRATO DE ADESÃO ELETRÔNICO -->
                                                                    <a href="<?php echo getLink('legal/adesao'); ?>" class="legal-card">
                                                                        <div class="legal-card-icon">
                                                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                                                <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
                                                                                <path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
                                                                                <path d="M7 21h10"/>
                                                                                <path d="M12 3v18"/>
                                                                                <path d="M3 7h18"/>
                                                                            </svg>
                                                                        </div>
                                                                        <div class="legal-card-content">
                                                                            <div class="legal-card-title">Contrato de Adesão Eletrônico</div>
                                                                            <div class="legal-card-subtitle">Termos do contrato de adesão eletrônico</div>
                                                                        </div>
                                                                    </a>

                                                                    <!-- 5. POLÍTICA DE COOKIES -->
                                                                    <a href="<?php echo getLink('legal/cookies'); ?>" class="legal-card">
                                                                        <div class="legal-card-icon">
                                                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                                                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
                                                                                <path d="M8.5 8.5v.01"/>
                                                                                <path d="M16 15.5v.01"/>
                                                                                <path d="M12 12v.01"/>
                                                                                <path d="M11 17v.01"/>
                                                                                <path d="M7 14v.01"/>
                                                                            </svg>
                                                                        </div>
                                                                        <div class="legal-card-content">
                                                                            <div class="legal-card-title">Política de Cookies</div>
                                                                            <div class="legal-card-subtitle">Informações sobre como usamos cookies em nosso site</div>
                                                                        </div>
                                                                    </a>

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


