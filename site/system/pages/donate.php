<?php
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Donate';
?>

<?php if (!isset($_POST['accept_terms'])): ?>
<form action="?subtopic=donate" method="post">
    <div class="TableContainer">
        <div class="CaptionContainer">
            <div class="CaptionInnerContainer">
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
                                                                    Before proceeding, you must have consent to our donation rules. Your donation to us is extremely important not because of its financial value, but because of its support for the project so that we can continue the work for develop new systems, hosting, infrastructure and server maintenance. As a thank you for this donation, we will send points to your account for use in the in-game store where you will find several offers for your character.
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                                <td style="font-weight:bold; font-size: 14px; padding: 10px;">
                                                                    Rules
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                                <td style="padding: 10px;">
                                                                    <b>a) Refund</b><br>
                                                                    <ul><li>You have full consent that any donation amount will not be refunded.</li></ul>
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                                <td style="padding: 10px;">
                                                                    <b>b) Deliver Time</b><br>
                                                                    <ul><li>Points are generally delivered automatically by the system, but if there is any failure, we have a maximum deadline of 24 hours for points to be delivered.</li></ul>
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                                <td style="padding: 10px;">
                                                                    <b>c) Security</b><br>
                                                                    <ul><li>Our server has several security methods, such as SSL certificate, data encryption and strong passwords rules, however the staff is not responsible for your account, characters, items and third party access. It is the player's sole responsibility for the security of their data within the server.</li></ul>
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                                <td style="padding: 10px;">
                                                                    <b>d) Server Rules</b><br>
                                                                    <ul><li>The player is aware that he must follow the server rules. If any rule is broken, the appropriate punishment will be established and the donation will not be refunded, as described in the first rule on this page.</li></ul>
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                                <td style="padding: 10px;">
                                                                    <b>e) Server Problems</b><br>
                                                                    <ul><li>Even this is a long-term project, problems may occours. In case of any problems by our end, we have a backup of every server save, and all points wasted will be restored.</li></ul>
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                                <td style="padding: 10px;">
                                                                    <b>f) Balance changes</b><br>
                                                                    <ul><li>Anything in the game could be changed and balanced and we are not responsible for any loss in value of purchased items/goods or anything in the game or store by donations.</li></ul>
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                                <td style="padding: 10px;">
                                                                    <b>g) Agreement</b><br>
                                                                    <ul><li>By continuing on this page, you are in complete agreement that the amount sent to the server is a donation, therefore there is no link with purchases or shipments by the server. We will then send, as a bonus for this donation, a proportional amount in coins.</li></ul>
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                                <td style="padding: 10px; text-align: center;">
                                                                    <label><input type="checkbox" name="accept_terms" value="1" required> I accept the donate terms and wish to proceed.</label>
                                                                    <br><br>
                                                                    <input type="submit" value="Submit">
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
        <div class="CaptionInnerContainer">
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
                                                                Payment Method
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 10px; text-align: center;">
                                                                <div style="display:flex; justify-content: space-around; flex-wrap: wrap;">
                                                                    <!-- Stripe -->
                                                                    <div style="border: 1px solid #4a4a4a; padding: 10px; border-radius: 5px; width: 150px; background-color: #2e3440; color: #d8dee9; margin: 10px;">
                                                                        <div style="font-weight: bold; margin-bottom: 5px;">Stripe</div>
                                                                        <div style="font-size: 12px; margin-bottom: 10px;">Usual Process Time:<br>Instant</div>
                                                                    </div>
                                                                    <!-- PIX -->
                                                                    <div style="border: 1px solid #4a4a4a; padding: 10px; border-radius: 5px; width: 150px; background-color: #2e3440; color: #d8dee9; margin: 10px;">
                                                                        <div style="font-weight: bold; margin-bottom: 5px;">PIX</div>
                                                                        <div style="font-size: 12px; margin-bottom: 10px;">Usual Process Time:<br>Instant</div>
                                                                    </div>
                                                                    <!-- Tibia Coins -->
                                                                    <div style="border: 1px solid #4a4a4a; padding: 10px; border-radius: 5px; width: 150px; background-color: #2e3440; color: #d8dee9; margin: 10px;">
                                                                        <div style="font-weight: bold; margin-bottom: 5px;">Tibia Coins</div>
                                                                        <div style="font-size: 12px; margin-bottom: 10px;">Usual Process Time:<br>1-24hrs</div>
                                                                    </div>
                                                                </div>
                                                                <div style="font-size: 12px; text-align: left; margin-top: 10px;">
                                                                    * Please note different prices may apply depending on your selected payment method.
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight:bold; font-size: 14px; padding: 10px;">
                                                                Points Package
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 10px;">
                                                                <form action="?subtopic=donate&action=checkout" method="post">
                                                                    <label style="font-weight: bold;">Select Amount:</label>
                                                                    <select name="points_package" style="margin-left: 10px; padding: 3px;">
                                                                        <option value="100">100 Points (R$ 10,00)</option>
                                                                        <option value="300">300 Points (R$ 30,00)</option>
                                                                        <option value="500">500 Points (R$ 50,00)</option>
                                                                        <option value="1000">1000 Points (R$ 100,00)</option>
                                                                        <option value="2000">2000 Points (R$ 200,00)</option>
                                                                        <option value="3500">3500 Points (R$ 350,00)</option>
                                                                        <option value="5000">5000 Points (R$ 500,00)</option>
                                                                    </select>
                                                                    <input type="submit" value="Submit" style="margin-left: 10px;">
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
