<?php
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Security';
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

.security-caption-inner {
    position: relative !important;
}
.security-green-bar-flags {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 50;
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

/* Estilização moderna e profissional para a lista de segurança */
.security-rules-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
}
.security-rule-item {
    display: flex;
    align-items: flex-start;
    background-color: rgba(0, 0, 0, 0.025);
    border: 1px solid #e2d2b4;
    border-radius: 6px;
    padding: 10px 14px;
    transition: all 0.2s ease-in-out;
}
.security-rule-item:hover {
    background-color: rgba(127, 0, 0, 0.04);
    border-color: #c4ab84;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.sec-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 24px;
    background: linear-gradient(180deg, #990000 0%, #660000 100%);
    color: #ffffff;
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: 12px;
    border-radius: 4px;
    margin-right: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.25);
    flex-shrink: 0;
    border: 1px solid #4a0000;
}
.security-rule-text {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 13px;
    color: #2c1704;
    line-height: 1.55;
}
.ot-highlight {
    color: #7f0000;
    font-weight: 700;
    background: rgba(127, 0, 0, 0.08);
    padding: 1px 5px;
    border-radius: 3px;
    border: 1px solid rgba(127, 0, 0, 0.15);
}

.rule-alert-box {
    background: #fdf3e5;
    border: 1px solid #e0c8a0;
    border-left: 4px solid #7f0000;
    padding: 10px 14px;
    border-radius: 4px;
    margin: 14px 0;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #3d2208;
}

@keyframes blinker {
    50% { opacity: 0; }
}
.blinking-link {
    animation: blinker 1s linear infinite;
    font-weight: bold;
    color: #7f0000 !important;
    text-decoration: none;
}
.blinking-link:hover {
    text-decoration: underline;
}
</style>

<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer security-caption-inner">
            <div class="security-green-bar-flags">
                <img src="<?php echo BASE_URL; ?>images/flags/br.gif" alt="Português" title="Português (BR)" class="flag-icon" onclick="changeLanguage('pt');" />
                <img src="<?php echo BASE_URL; ?>images/flags/us.gif" alt="English" title="English (US)" class="flag-icon" onclick="changeLanguage('en');" />
                <img src="<?php echo BASE_URL; ?>images/flags/es.gif" alt="Español" title="Español (ES)" class="flag-icon" onclick="changeLanguage('es');" />
                <img src="<?php echo BASE_URL; ?>images/flags/pl.gif" alt="Polski" title="Polski (PL)" class="flag-icon" onclick="changeLanguage('pl');" />
            </div>
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">Segurança da sua conta</div>
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
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px 14px; color: #4a2505; border-left: 4px solid #7f0000;">
                                                                Proteja-se e evite perdas
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px;">
                                                                <div class="tibia-paragraph">
                                                                    <span class="tibia-dropcap">A</span> segurança da sua conta também depende de você. A equipe do <span class="ot-highlight">NosleiraOT</span> trabalha continuamente para proteger o servidor, mas não pode recuperar contas, personagens ou itens perdidos por compartilhamento de dados, acesso a links falsos, uso de programas desconhecidos ou negociações realizadas fora dos sistemas oficiais.
                                                                </div>
                                                                
                                                                <div class="rule-alert-box">
                                                                    📜 <a href="<?php echo getLink('regras/servrules'); ?>" style="font-weight:bold; color: #7f0000; text-decoration: underline;">Regra 10 do servidor</a>: todos os jogadores são responsáveis por suas contas e seus itens. A administração não se responsabiliza por perdas ou roubos causados por descuido do jogador.
                                                                </div>
                                                                
                                                                <div class="security-rules-list">
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">01</span>
                                                                        <div class="security-rule-text">Mantenha o acesso à sua conta exclusivamente com você. Nunca compartilhe sua senha, e-mail ou Recovery Key.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">02</span>
                                                                        <div class="security-rule-text">Use um e-mail válido, seguro e ao qual somente você tenha acesso. Ative a verificação em duas etapas no seu e-mail, se disponível.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">03</span>
                                                                        <div class="security-rule-text">Crie uma senha longa, exclusiva e diferente das senhas usadas em outros servidores, jogos e sites.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">04</span>
                                                                        <div class="security-rule-text">Registre sua conta e guarde sua Recovery Key (RK) em local seguro. Não envie fotos ou cópias dela a ninguém.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">05</span>
                                                                        <div class="security-rule-text">Nenhum membro da equipe pedirá sua senha, Recovery Key ou acesso remoto ao seu computador.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">06</span>
                                                                        <div class="security-rule-text">Tenha cuidado ao convidar outros jogadores para sua house. Revise sempre as permissões de acesso e das portas.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">07</span>
                                                                        <div class="security-rule-text">Promoções e sorteios verdadeiros são anunciados nos canais oficiais. A equipe não entrega prêmios por meio de cartas com links.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">08</span>
                                                                        <div class="security-rule-text">Não reutilize o nome da conta, o e-mail e a senha do <span class="ot-highlight">NosleiraOT</span> em outros servidores ou no Tibia oficial.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">09</span>
                                                                        <div class="security-rule-text">Não negocie personagens, contas ou itens fora dos sistemas autorizados pelo servidor. A equipe não intermedeia acordos particulares.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">10</span>
                                                                        <div class="security-rule-text">A troca de itens entre servidores é proibida e pode resultar em golpe e punição.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">11</span>
                                                                        <div class="security-rule-text">Antes de informar qualquer dado, confira o endereço no navegador. O site oficial é <a href="<?php echo BASE_URL; ?>" class="blinking-link">(Site Oficial)</a>.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">12</span>
                                                                        <div class="security-rule-text">Baixe o cliente e as atualizações somente pelo site oficial. Não execute scripts, bots, arquivos ou programas enviados por outros jogadores.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">13</span>
                                                                        <div class="security-rule-text">Bloqueie o computador ao se afastar e evite deixar o personagem desassistido em situações que possam causar morte, Red Skull ou perda de itens.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">14</span>
                                                                        <div class="security-rule-text">Mantenha o sistema operacional, o navegador e o antivírus atualizados. Não permita acesso remoto ao computador por desconhecidos.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">15</span>
                                                                        <div class="security-rule-text">Desconfie de urgências, ameaças ou ofertas boas demais para ser verdade. Em caso de dúvida, abra um ticket antes de agir.</div>
                                                                    </div>
                                                                    <div class="security-rule-item">
                                                                        <span class="sec-badge">16</span>
                                                                        <div class="security-rule-text">Caso suspeite de invasão, altere imediatamente as senhas da conta e do e-mail em um dispositivo seguro e entre em contato com o suporte oficial.</div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div align="center" style="font-family: 'Martel', Georgia, 'Times New Roman', serif; font-size: 13px; font-weight: bold; color: #4a2505; padding: 12px 18px; background: linear-gradient(180deg, #f8f1e5 0%, #ebdcc7 100%); border: 1px solid #c4ab84; border-left: 4px solid #7f0000; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.08); margin-top: 18px;">
                                                                    ⚠️ <b>Importante:</b> se algo parecer suspeito, não clique, não baixe arquivos e não forneça dados. Tire uma captura de tela e abra um ticket pelo site oficial. Agir rapidamente pode evitar a perda da conta e dos itens.
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
