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

.security-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.security-list li {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #2c1704;
    line-height: 1.6;
    margin-bottom: 10px;
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
                                                                    <span class="tibia-dropcap">A</span> segurança da sua conta também depende de você. A equipe do Ultron OT trabalha continuamente para proteger o servidor, mas não pode recuperar contas, personagens ou itens perdidos por compartilhamento de dados, acesso a links falsos, uso de programas desconhecidos ou negociações realizadas fora dos sistemas oficiais.
                                                                </div>
                                                                <div class="tibia-paragraph">
                                                                    <a href="<?php echo getLink('servrules'); ?>" style="font-weight:bold;">Regra 10 do servidor</a>: todos os jogadores são responsáveis por suas contas e seus itens. A administração não se responsabiliza por perdas ou roubos causados por descuido do jogador.
                                                                </div>
                                                                
                                                                <ul class="security-list">
                                                                    <li><b>1 -</b> Mantenha o acesso à sua conta exclusivamente com você. Nunca compartilhe sua senha, e-mail ou Recovery Key.</li>
                                                                    <li><b>2 -</b> Use um e-mail válido, seguro e ao qual somente você tenha acesso. Ative a verificação em duas etapas no seu e-mail, se disponível.</li>
                                                                    <li><b>3 -</b> Crie uma senha longa, exclusiva e diferente das senhas usadas em outros servidores, jogos e sites.</li>
                                                                    <li><b>4 -</b> Registre sua conta e guarde sua Recovery Key (RK) em local seguro. Não envie fotos ou cópias dela a ninguém.</li>
                                                                    <li><b>5 -</b> Nenhum membro da equipe pedirá sua senha, Recovery Key ou acesso remoto ao seu computador.</li>
                                                                    <li><b>6 -</b> Tenha cuidado ao convidar outros jogadores para sua house. Revise sempre as permissões de acesso e das portas.</li>
                                                                    <li><b>7 -</b> Promoções e sorteios verdadeiros são anunciados nos canais oficiais. A equipe não entrega prêmios por meio de cartas com links.</li>
                                                                    <li><b>8 -</b> Não reutilize o nome da conta, o e-mail e a senha do Ultron OT em outros servidores ou no Tibia oficial.</li>
                                                                    <li><b>9 -</b> Não negocie personagens, contas ou itens fora dos sistemas autorizados pelo servidor. A equipe não intermedeia acordos particulares.</li>
                                                                    <li><b>10 -</b> A troca de itens entre servidores é proibida e pode resultar em golpe e punição.</li>
                                                                    <li><b>11 -</b> Antes de informar qualquer dado, confira o endereço no navegador. O site oficial é <a href="<?php echo BASE_URL; ?>" class="blinking-link">(Site Oficial)</a>.</li>
                                                                    <li><b>12 -</b> Baixe o cliente e as atualizações somente pelo site oficial. Não execute scripts, bots, arquivos ou programas enviados por outros jogadores.</li>
                                                                    <li><b>13 -</b> Bloqueie o computador ao se afastar e evite deixar o personagem desassistido em situações que possam causar morte, Red Skull ou perda de itens.</li>
                                                                    <li><b>14 -</b> Mantenha o sistema operacional, o navegador e o antivírus atualizados. Não permita acesso remoto ao computador por desconhecidos.</li>
                                                                    <li><b>15 -</b> Desconfie de urgências, ameaças ou ofertas boas demais para ser verdade. Em caso de dúvida, abra um ticket antes de agir.</li>
                                                                    <li><b>16 -</b> Caso suspeite de invasão, altere imediatamente as senhas da conta e do e-mail em um dispositivo seguro e entre em contato com o suporte oficial.</li>
                                                                </ul>
                                                                
                                                                <div align="center" style="font-family: 'Martel', Georgia, 'Times New Roman', serif; font-size: 13px; font-weight: bold; color: #4a2505; padding: 12px 18px; background: linear-gradient(180deg, #f8f1e5 0%, #ebdcc7 100%); border: 1px solid #c4ab84; border-left: 4px solid #7f0000; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.08); margin-top: 16px;">
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
