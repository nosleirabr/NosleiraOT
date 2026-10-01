<?php
defined('MYAAC') or die('Direct access not allowed!');

$serverName = !empty($config['lua']['serverName']) ? $config['lua']['serverName'] : 'NosleiraOT';
$title = 'Contrato Estendido — ' . $serverName;
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
</style>

<!-- ================================================================= -->
<!-- HEADER PRINCIPAL: CONTRATO ESTENDIDO                              -->
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
            <div class="Text">CONTRATO ESTENDIDO — SERVIÇOS PAGOS (VIP & COINS)</div>
            <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
        </div>
    </div>
</div>

<!-- ================================================================= -->
<!-- SEÇÃO 1: OBJETO E NATUREZA DAS DOAÇÕES                            -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">1 - OBJETO E NATUREZA DAS DOAÇÕES</div>
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
                                                            <td style="padding: 16px;">
                                                                <div class="agreement-warning-box">
                                                                    <b>AVISO IMPORTANTE:</b> Este Contrato Estendido complementa o Contrato de Serviço Geral e regulamenta especificamente as contribuições financeiras voluntárias, aquisição de Coins virtuais e concessão de status VIP no <b><?php echo $serverName; ?></b>.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.1.</span> O <b><?php echo $serverName; ?></b> é um servidor de entretenimento online cuja participação básica é livre e gratuita. As contribuições monetárias disponibilizadas no site constituem <b>doações voluntárias</b> destinadas exclusivamente ao custeio da infraestrutura técnica (servidores dedicados, links de alta capacidade, proteção anti-DDoS, desenvolvimento e manutenção contínua).
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.2.</span> Como forma de reconhecimento e incentivo ao apoio comunitário, o servidor concede ao doador uma bonificação em forma de moedas virtuais (<b>Coins</b>) e/ou acesso temporal a recursos de comodidade (<b>Status VIP</b>).
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.3.</span> Ao realizar qualquer contribuição, o Usuário declara expressamente que compreende a natureza das doações e aceita integralmente as condições deste contrato.
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
<!-- SEÇÃO 2: LICENÇA DE USO DOS BENS VIRTUAIS                         -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">2 - LICENÇA DE USO DOS BENS VIRTUAIS</div>
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
                                                            <td style="padding: 16px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">2.1.</span> Todos os elementos digitais disponibilizados no jogo — incluindo, sem limitação: Coins, itens, aparências, privilégios VIP, contas e personagens — são de propriedade exclusiva e gerenciamento da administração do <b><?php echo $serverName; ?></b>.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">2.2.</span> O Usuário não adquire a propriedade de nenhum item ou moeda virtual, mas tão somente uma <span class="agreement-highlight">licença de uso limitada, revogável, não exclusiva e intransferível</span>, restrita ao período de operação regular da conta no servidor.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">2.3.</span> <b>Proibição de Comércio Real (RMT):</b> É terminantemente proibida a comercialização, cessão, troca ou intermediação de itens virtuais, moedas do jogo, Coins ou contas por valores financeiros reais (moeda fiduciária, PIX, transferências bancárias ou bens externos) fora dos canais expressamente homologados pelo servidor. A violação desta norma resultará no encerramento definitivo das contas envolvidas.
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
<!-- SEÇÃO 3: PROCESSAMENTO, CRÉDITO E POLÍTICA DE NÃO REEMBOLSO       -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">3 - PROCESSAMENTO E POLÍTICA DE NÃO REEMBOLSO</div>
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
                                                            <td style="padding: 16px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">3.1.</span> As doações são intermediadas por instituições financeiras e gateways devidamente autorizados (ex.: Mercado Pago, PIX). O crédito das Coins na conta ocorre automaticamente após a confirmação de liquidação pela instituição parceira.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">3.2.</span> <b>Conteúdo Digital de Consumo Imediato:</b> Por se tratar do fornecimento imediato de conteúdo digital intangível, a prestação do serviço é considerada integralmente executada a partir do momento em que as Coins ou privilégios VIP são creditados na conta do Usuário.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">3.3.</span> Uma vez consumidas, transferidas, trocadas ou utilizadas as moedas ou vantagens virtuais no jogo, não haverá direito a cancelamento, estorno ou restituição de valores, em consonância com as normas aplicáveis ao fornecimento de conteúdo digital personalizado e consumível.
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
<!-- SEÇÃO 4: PREVENÇÃO A FRAUDES E CHARGEBACKS                        -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">4 - PREVENÇÃO A FRAUDES E CHARGEBACKS</div>
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
                                                            <td style="padding: 16px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">4.1.</span> A abertura fraudulenta de disputas, contestações injustificadas ou estornos arbitrários (<b>chargeback</b>) perante instituições bancárias ou operadoras de cartão de crédito ensejará o <span class="agreement-highlight">bloqueio e suspensão imediata de todas as contas associadas</span> ao cadastro, IP e dados do pagador.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">4.2.</span> O eventual desbloqueio de contas restritas por chargeback ficará condicionado ao ressarcimento integral dos valores contestados, acrescidos das taxas administrativas e operacionais impostas pelos intermediadores de pagamento.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">4.3.</span> A administração cooperará com autoridades judiciais e policiais mediante solicitação legítima para apuração de fraudes financeiras e crimes cibernéticos.
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
<!-- SEÇÃO 5: DINÂMICA DE JOGO E BALANCEAMENTO                         -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">5 - DINÂMICA DE JOGO E BALANCEAMENTO</div>
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
                                                            <td style="padding: 16px;">
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">5.1.</span> A administração do <b><?php echo $serverName; ?></b> reserva-se o direito soberano de realizar ajustes de balanceamento, modificações em fórmulas de combate, taxas de regeneração, atributos de itens e vocações para preservar o equilíbrio competitivo do jogo. Tais alterações são inerentes ao ciclo de vida do jogo e não geram qualquer compensação patrimonial.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">5.2.</span> O status de doador ou detentor de privilégios VIP não concede imunidade a penalidades disciplinares. Doadores estão igualmente sujeitos às Regras do Servidor, podendo sofrer banimentos temporários ou permanentes caso cometam infrações.
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


