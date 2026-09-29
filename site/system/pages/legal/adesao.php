<?php
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Contrato de Adesão Eletrônico — NosleiraOT';
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

/* Header com Botão Voltar */
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

.section-spacer {
    margin-bottom: 14px;
}
</style>

<!-- ================================================================= -->
<!-- HEADER PRINCIPAL: CONTRATO DE ADESÃO ELETRÔNICO                   -->
<!-- ================================================================= -->
<div class="TableContainer" style="margin-bottom: 16px;">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer agreement-header-caption">
            <div class="agreement-header-right">
                <a href="<?php echo (isset($_SERVER['HTTP_REFERER']) && !empty($_SERVER['HTTP_REFERER'])) ? htmlspecialchars($_SERVER['HTTP_REFERER']) : getLink('legal'); ?>" class="btn-agreement-back">&larr; VOLTAR</a>
            </div>
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">CONTRATO DE ADESÃO ELETRÔNICO</div>
            <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
        </div>
    </div>
</div>

<!-- ================================================================= -->
<!-- SEÇÃO 1: INTRODUÇÃO                                               -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">1 - INTRODUÇÃO</div>
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
                                                                    <span class="agreement-clause-num">1.1.</span> Ao acessar ou usar o site da NosleiraOT Soluções Digitais LTDA e/ou registrar uma conta para o jogo "NosleiraOT", você concorda com estes Termos de Serviço e todas as políticas e regulamentos do jogo, incluindo nossa Política de Privacidade e regras específicas. Criar uma conta e/ou baixar o software do jogo confirma que você tem 18 anos de idade ou mais de acordo com as leis do seu país.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.2.</span> Este documento estabelece os termos sob os quais a NosleiraOT Soluções Digitais LTDA fornece acesso a uma conta que permite jogar o RPG online "NosleiraOT".
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.3.</span> Se você não concordar com estes Termos, não use o site ou o jogo "NosleiraOT". A aceitação e/ou a mera continuidade no uso do site ou do jogo implica aceitação, ainda que tácita, de todos os termos e condições descritos abaixo.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">1.4.</span> Estes Termos podem ser atualizados pela NosleiraOT Soluções Digitais LTDA devido a alterações na legislação aplicável, requisitos regulatórios ou por decisão própria. A versão atualizada estará disponível no site, e o uso contínuo do jogo ou site após as alterações constitui aceitação das mudanças.
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
<!-- SEÇÃO 2: ISENÇÃO DE RESPONSABILIDADE                              -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">2 - ISENÇÃO DE RESPONSABILIDADE</div>
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
                                                                    <span class="agreement-clause-num">2.1.</span> O jogo "NosleiraOT" é fornecido "como está", sem garantias de operação contínua, ausência de erros ou vulnerabilidades. A NosleiraOT Soluções Digitais LTDA não oferece garantias expressas ou implícitas de qualquer tipo, incluindo, mas não se limitando a, garantias de propriedade, conformidade, comercialização ou adequação a um propósito específico.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">2.2.</span> O uso do software é de sua exclusiva responsabilidade. A NosleiraOT Soluções Digitais LTDA não garante que o software, jogo ou sua conta funcionará ininterruptamente, sem erros, de forma segura ou livre de vírus.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">2.3.</span> A NosleiraOT Soluções Digitais LTDA não é responsável por eventos de força maior ou circunstâncias imprevistas que interfiram no jogo, como falhas técnicas, ataques de terceiros (por exemplo, hacking ou DDoS), interrupções de serviço de internet ou outros fatores fora do controle da Empresa.
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
<!-- SEÇÃO 3: LIMITAÇÃO DE RESPONSABILIDADE                            -->
<!-- ================================================================= -->
<div class="TableContainer section-spacer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">3 - LIMITAÇÃO DE RESPONSABILIDADE</div>
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
                                                                    <span class="agreement-clause-num">3.1.</span> A NosleiraOT Soluções Digitais LTDA não é responsável por qualquer perda de lucros, dados, danos especiais, incidentais ou consequentes resultantes do uso ou incapacidade de uso do jogo, incluindo a perda de itens, contas ou personagens devido a erros, manutenção do sistema ou alterações na jogabilidade.
                                                                </div>
                                                                <div class="agreement-paragraph">
                                                                    <span class="agreement-clause-num">3.2.</span> De acordo com o Artigo 927 do Código Civil Brasileiro, a responsabilidade da NosleiraOT Soluções Digitais LTDA por danos só se aplica em casos de dolo ou culpa grave, que não se enquadram na natureza do serviço prestado. O usuário assume todos os riscos inerentes ao uso do jogo.
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