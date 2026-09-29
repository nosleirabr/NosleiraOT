<?php
defined('MYAAC') or die('Direct access not allowed!');

$serverName = !empty($config['lua']['serverName']) ? $config['lua']['serverName'] : 'NosleiraOT';
$title = 'Política de Cookies — ' . $serverName;
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

/* Header com Botão Voltar e Bandeiras */
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
}
.flag-icon:hover {
    transform: scale(1.2);
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

.section-spacer {
    margin-bottom: 14px;
}

/* Tabela de Cookies */
.cookies-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    margin-bottom: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
}
.cookies-table th {
    background: #4a2505;
    color: #ffffff;
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
}
.cookies-table td {
    border: 1px solid #dfc79b;
    padding: 8px 12px;
    color: #3d2208;
    background: #fffdf9;
}
.cookies-table tr:nth-child(even) td {
    background: #fbf5e8;
}
</style>

<!-- ================================================================= -->
<!-- HEADER PRINCIPAL: POLÍTICA DE COOKIES                             -->
<!-- ================================================================= -->
<div class="TableContainer" style="margin-bottom: 16px;">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer agreement-header-caption">
            <div class="agreement-header-right">
                <a href="<?php echo (isset($_SERVER['HTTP_REFERER']) && !empty($_SERVER['HTTP_REFERER'])) ? htmlspecialchars($_SERVER['HTTP_REFERER']) : getLink('legal'); ?>" class="btn-agreement-back">&larr; VOLTAR</a>
                <div class="agreement-flags">
                    <img src="<?php echo BASE_URL; ?>images/flags/br.gif" alt="Português" title="Português (BR)" class="flag-icon" onclick="changeLanguage('pt');" />
                    <img src="<?php echo BASE_URL; ?>images/flags/us.gif" alt="English" title="English (US)" class="flag-icon" onclick="changeLanguage('en');" />
                    <img src="<?php echo BASE_URL; ?>images/flags/es.gif" alt="Español" title="Español (ES)" class="flag-icon" onclick="changeLanguage('es');" />
                    <img src="<?php echo BASE_URL; ?>images/flags/pl.gif" alt="Polski" title="Polski (PL)" class="flag-icon" onclick="changeLanguage('pl');" />
                </div>
            </div>
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">POLÍTICA DE COOKIES — <?php echo strtoupper($serverName); ?></div>
            <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
        </div>
    </div>
</div>

<!-- ================================================================= -->
<!-- SEÇÃO 1: O QUE SÃO COOKIES                                        -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">1 - O QUE SÃO COOKIES?</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px;">
                                                                <div class="agreement-warning-box">
                                                                    <b>TRANSPARÊNCIA E PRIVACIDADE:</b> O <b><?php echo $serverName; ?></b> preza pela segurança dos seus dados. Esta política explica de forma clara como e por que cookies são utilizados quando você navega em nossa plataforma.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.1.</span> Cookies são pequenos arquivos de texto armazenados no navegador do seu dispositivo (computador, celular ou tablet) ao visitar sites na internet.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.2.</span> Eles desempenham papel fundamental para permitir que as páginas web funcionem corretamente, mantenham sua conta conectada de forma segura e lembrem suas preferências de navegação.
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

<!-- ================================================================= -->
<!-- SEÇÃO 2: QUAIS COOKIES UTILIZAMOS                                 -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">2 - QUAIS COOKIES UTILIZAMOS EM NOSSO SITE?</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">2.1.</span> <b>Cookies Estritamente Necessários:</b> Essenciais para a operação do site e acesso a recursos restritos (como login no painel da conta e criação de personagens). Sem esses cookies, os serviços não podem ser providos com segurança.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">2.2.</span> <b>Cookies de Preferências e Funcionalidade:</b> Armazenam opções selecionadas pelo jogador, tais como o idioma de tradução ativa e o estado de expansão dos menus de navegação.
                                                                </div>
                                                                
                                                                <table class="cookies-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Cookie</th>
                                                                            <th>Finalidade</th>
                                                                            <th>Tipo</th>
                                                                            <th>Duração</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td><b>PHPSESSID</b></td>
                                                                            <td>Identificação da sessão ativa do usuário para manter o login e carrinho seguros.</td>
                                                                            <td>Estritamente Necessário</td>
                                                                            <td>Sessão</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><b>googtrans</b></td>
                                                                            <td>Armazena o idioma selecionado nas bandeiras (Português, Inglês, Espanhol, Polonês).</td>
                                                                            <td>Preferência</td>
                                                                            <td>Persistente</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><b>menus</b></td>
                                                                            <td>Lembra quais seções do menu lateral de navegação estão abertas ou fechadas.</td>
                                                                            <td>Funcional</td>
                                                                            <td>Local Storage</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
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

<!-- ================================================================= -->
<!-- SEÇÃO 3: GERENCIAMENTO E DESATIVAÇÃO                              -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">3 - GERENCIAMENTO E DESATIVAÇÃO DE COOKIES</div>
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
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">3.1.</span> Você pode, a qualquer tempo, alterar as configurações do seu navegador para recusar o armazenamento de novos cookies ou excluir cookies já existentes.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">3.2.</span> <b>Impacto na Experiência:</b> Alertamos que ao desativar ou bloquear os cookies necessários, recursos cruciais do site deixarão de funcionar, incluindo o login no painel da conta, a troca de senha e a confirmação de doações.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">3.3.</span> Instruções detalhadas para gerenciar cookies nos navegadores mais populares podem ser encontradas em suas respectivas páginas oficiais de suporte (Google Chrome, Mozilla Firefox, Microsoft Edge e Apple Safari).
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
