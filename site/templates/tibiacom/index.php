<?php
defined('MYAAC') or die('Direct access not allowed!');

if(isset($config['boxes']))
	$config['boxes'] = explode(",", $config['boxes']);
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<?php echo template_place_holder('head_start'); ?>
	<link rel="shortcut icon" href="<?php echo $template_path; ?>/images/favicon.ico?v=noslerat4" type="image/x-icon" />
	<link rel="icon" type="image/png" href="<?php echo $template_path; ?>/images/favicon.png?v=noslerat4" />
	<link rel="icon" href="<?php echo $template_path; ?>/images/favicon.ico?v=noslerat4" type="image/x-icon" />
	<link href="<?php echo $template_path; ?>/basic.css?v=<?php echo time(); ?>" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="tools/basic.js"></script>
	<script type="text/javascript" src="<?php echo $template_path; ?>/ticker.js"></script>
	<style>
		@keyframes blinkDonate {
			0% { opacity: 1; text-shadow: 0 0 5px lime; }
			50% { opacity: 0.6; text-shadow: none; color: #008000; }
			100% { opacity: 1; text-shadow: 0 0 5px lime; }
		}
		@keyframes bounceLeft {
			0%   { transform: translateX(60px);  }
			100% { transform: translateX(-18px); }
		}
		@keyframes bounceRight {
			0% { transform: translateX(0); }
			100% { transform: translateX(200px); }
		}
	</style>

	<?php if(!empty($config['network_twitter'])): ?>
	<script id="twitter-wjs" src="<?php echo $template_path; ?>/js/twitter.js"></script>
	<?php endif; ?>

	<?php if(!empty($config['network_facebook'])): ?>
	<script id="facebook-jssdk" async src="https://connect.facebook.net/en_US/all.js"></script>
	<link href="<?php echo $template_path; ?>/css/facebook.css" rel="stylesheet" type="text/css">
	<?php endif; ?>

	<script type="text/javascript">
		var menus = '';
		var loginStatus="<?php echo ($logged ? 'true' : 'false'); ?>";
		<?php
			if(PAGE !== 'news') {
				$tmp = str_replace('/', '_', isset($_REQUEST['subtopic']) ? escapeHtml($_REQUEST['subtopic']) :  PAGE);
				$exp = explode('/', PAGE);
				if(PAGE !== 'account/create' && PAGE !== 'account/lost' && isset($exp[1])) {
					if ($exp[0] === 'account' && $exp[1] === 'lost') {
						$tmp = 'account_lost';
					} elseif ($exp[0] === 'account') {
						$tmp = 'account_manage';
					} else if ($exp[0] === 'news' && $exp[1] === 'archive') {
						$tmp = 'news_archive';
					}
					else if (in_array($exp[0], ['characters', 'highscores', 'guilds', 'forum'])) {
						$tmp = $exp[0];
					}
				}
			}
			else {
				$tmp = 'news';
			}
		?>
		var activeSubmenuItem="<?php echo $tmp; ?>";
		var IMAGES="<?php echo $template_path; ?>/images";
		var LINK_ACCOUNT="<?php echo BASE_URL; ?>";

		function rowOverEffect(object) {
			if (object.className == 'moduleRow') object.className = 'moduleRowOver';
		}

		function rowOutEffect(object) {
			if (object.className == 'moduleRowOver') object.className = 'moduleRow';
		}

		function InitializePage() {
		  LoadLoginBox();
		  LoadMenu();
		}

		// initialisation of the loginbox status by the value of the variable 'loginStatus' which is provided to the HTML-document by PHP in the file 'header.inc'
		function LoadLoginBox()
		{
		  if(loginStatus == "false") {
			document.getElementById('LoginstatusText_1').style.backgroundImage = "url('" + IMAGES + "/loginbox/loginbox-font-you-are-not-logged-in.gif')";
			document.getElementById('ButtonText').style.backgroundImage = "url('" + IMAGES + "/global/buttons/_sbutton_login.gif')";
			document.getElementById('LoginstatusText_2').style.backgroundImage = "url('" + IMAGES + "/loginbox/loginbox-font-create-account.gif')";
			document.getElementById('LoginstatusText_2_1').style.backgroundImage = "url('" + IMAGES + "/loginbox/loginbox-font-create-account.gif')";
			document.getElementById('LoginstatusText_2_2').style.backgroundImage = "url('" + IMAGES + "/loginbox/loginbox-font-create-account-over.gif')";
		  } else {
			document.getElementById('LoginstatusText_1').style.backgroundImage = "url('" + IMAGES + "/loginbox/loginbox-font-welcome.gif')";
			document.getElementById('ButtonText').style.backgroundImage = "url('" + IMAGES + "/global/buttons/_sbutton_myaccount.gif')";
			document.getElementById('LoginstatusText_2').style.backgroundImage = "url('" + IMAGES + "/loginbox/loginbox-font-logout.gif')";
			document.getElementById('LoginstatusText_2_1').style.backgroundImage = "url('" + IMAGES + "/loginbox/loginbox-font-logout.gif')";
			document.getElementById('LoginstatusText_2_2').style.backgroundImage = "url('" + IMAGES + "/loginbox/loginbox-font-logout-over.gif')";
		  }
		}

		// mouse-over and click events of the loginbox
		function MouseOverLoginBoxText(source)
		{
		  source.lastElementChild.style.visibility = "visible";
		  source.firstElementChild.style.visibility = "hidden";
		}
		function MouseOutLoginBoxText(source)
		{
		  source.firstElementChild.style.visibility = "visible";
		  source.lastElementChild.style.visibility = "hidden";
		}
		function LoginButtonAction()
		{
		  if(loginStatus === "false") {
			window.location = "<?php echo getLink('account/manage'); ?>";
		  } else {
			window.location = "<?php echo getLink('account/manage'); ?>";
		  }
		}
		function LoginstatusTextAction(source) {
		  if(loginStatus === "false") {
			window.location = "<?php echo getLink('account/create'); ?>";
		  } else {
			window.location = "<?php echo getLink('account/logout'); ?>";
		  }
		}

		var menu = [];
		menu[0] = {};
		var unloadhelper = false;

		<?php
			$menuInitStr = '';
			foreach ($config['menu_categories'] as $item) {
				if ($item['id'] !== 'shops' || setting('core.gifts_system')) {
					$menuInitStr .= $item['id'] . '=' . (in_array($item['id'], ['news', 'shops']) ? '1' : '0') . '&';
				}
			}
		?>

		// load the menu and set the active submenu item by using the variable 'activeSubmenuItem'
		function LoadMenu()
		{
		  document.getElementById("submenu_"+activeSubmenuItem).style.color = "white";
		  document.getElementById("ActiveSubmenuItemIcon_"+activeSubmenuItem).style.visibility = "visible";
		  menus = localStorage.getItem('menus');
		  if(menus == null || menus.lastIndexOf("&") === -1) {
			  menus = "<?= $menuInitStr ?>";
		  }
		  FillMenuArray();
		  InitializeMenu();
		}

		function SaveMenu()
		{
		  if(unloadhelper == false) {
			SaveMenuArray();
			unloadhelper = true;
		  }
		}

		// store the values of the variable 'self.name' in the array menu
		function FillMenuArray()
		{
			while(menus.length > 0 ){
				var mark1 = menus.indexOf("=");
				var mark2 = menus.indexOf("&");
				var menuItemName = menus.substr(0, mark1);
				menu[0][menuItemName] = menus.substring(mark1 + 1, mark2);
				menus = menus.substr(mark2 + 1, menus.length);
			}
		}

		// hide or show the corresponding submenus
		function InitializeMenu()
		{
		  for(menuItemName in menu[0]) {
			  if (!document.getElementById(menuItemName+"_Submenu")) {
				  continue;
			  }

			if(menu[0][menuItemName] == "0") {
			  document.getElementById(menuItemName+"_Submenu").style.visibility = "hidden";
			  document.getElementById(menuItemName+"_Submenu").style.display = "none";
			  document.getElementById(menuItemName+"_Lights").style.visibility = "visible";
			  document.getElementById(menuItemName+"_Extend").style.backgroundImage = "url(" + IMAGES + "/general/plus.gif)";
			}
			else {
			  document.getElementById(menuItemName+"_Submenu").style.visibility = "visible";
			  document.getElementById(menuItemName+"_Submenu").style.display = "block";
			  document.getElementById(menuItemName+"_Lights").style.visibility = "hidden";
			  document.getElementById(menuItemName+"_Extend").style.backgroundImage = "url(" + IMAGES + "/general/minus.gif)";
			}
		  }
		}

		function SaveMenuArray()
		{
			var stringSlices = "";
			var temp = "";

			for(menuItemName in menu[0]) {
				stringSlices = menuItemName + "=" + menu[0][menuItemName] + "&";
				temp = temp + stringSlices;
			}

			localStorage.setItem('menus', temp);
		}

		// onClick open or close submenus
		function MenuItemAction(sourceId)
		{
		  if(menu[0][sourceId] == 1) {
			CloseMenuItem(sourceId);
		  }
		  else {
			for(menuItemName in menu[0]) {
				if(menuItemName != sourceId && menuItemName != 'news' && menuItemName != 'shops') {
					CloseMenuItem(menuItemName);
				}
			}
			OpenMenuItem(sourceId);
		  }
		}
		function OpenMenuItem(sourceId)
		{
		  menu[0][sourceId] = 1;
		  document.getElementById(sourceId+"_Submenu").style.visibility = "visible";
		  document.getElementById(sourceId+"_Submenu").style.display = "block";
		  document.getElementById(sourceId+"_Lights").style.visibility = "hidden";
		  document.getElementById(sourceId+"_Extend").style.backgroundImage = "url(" + IMAGES + "/general/minus.gif)";
		}
		function CloseMenuItem(sourceId)
		{
		  menu[0][sourceId] = 0;
		  document.getElementById(sourceId+"_Submenu").style.visibility = "hidden";
		  document.getElementById(sourceId+"_Submenu").style.display = "none";
		  document.getElementById(sourceId+"_Lights").style.visibility = "visible";
		  document.getElementById(sourceId+"_Extend").style.backgroundImage = "url(" + IMAGES + "/general/plus.gif)";
		}

		// mouse-over effects of menubuttons and submenuitems
		function MouseOverMenuItem(source)
		{
		  source.firstElementChild.style.visibility = "visible";
		}
		function MouseOutMenuItem(source)
		{
		  source.firstElementChild.style.visibility = "hidden";
		}
		function MouseOverSubmenuItem(source)
		{
		  source.style.backgroundColor = "#14433F";
		}
		function MouseOutSubmenuItem(source)
		{
		  source.style.backgroundColor = "#0D2E2B";
		}
	</script>
	<?php echo template_place_holder('head_end'); ?>
</head>
<body onBeforeUnLoad="SaveMenu();" onUnload="SaveMenu();" style="background-image:url(<?php echo $template_path; ?>/images/header/<?php echo $config['background_image']; ?>); background-position: center top; background-attachment: fixed; background-repeat: no-repeat; background-size: cover;">
	<?php echo template_place_holder('body_start'); ?>
	<?php if(!empty($config['network_facebook'])) {?>
	<script type="text/javascript">
        window.fbAsyncInit = function() {
            FB.init({
                appId      : 497232093667125, // App ID
                status     : true,              // check login status
                cookie     : true,              // enable cookies to allow the server to access the session
                xfbml      : true               // parse XFBML
            });
            FB.Event.subscribe('auth.login', function() {
                var URLHelper = "?";
                if (window.location.search.replace("?", "").length > 0) {
                    URLHelper = "&";
                }
                if (FB_TryLogin == 1) {
                    window.location = window.location + URLHelper + "step=facebooktrylogin&wasreloaded=1";
                } else if (FB_TryLogin == 2) {
                    window.location = window.location + URLHelper + "page=facebooktrylogin&wasreloaded=1";
                } else {
                    window.location = window.location + URLHelper + "wasreloaded=1";
                }
            });
            FB.Event.subscribe('auth.logout', function(a_Response) {
                if (a_Response.status !== 'connected') {
                    window.location.href=window.location.href;
                } else {
                    /* nothing to do here*/
                }
            });
            FB.Event.subscribe('auth.statusChange', function(response) {
                if (FB_ForceReload == 1 && response.status == "connected") {
                    var URLHelper = "?";
                    if (window.location.search.replace("?", "").length > 0) {
                        URLHelper = "&";
                    }
                    window.location = window.location + URLHelper + "step=facebooktrylogin&wasreloaded=1";
                }
            });
        };
        (function(d){
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));
	</script>
	<?php } ?>
  <div id="top"></div>
  <div id="ArtworkHelper" style="background-image:url(<?php echo $template_path; ?>/images/header/<?php echo $config['background_image']; ?>);" >
    <div id="Bodycontainer">
      <div id="ContentRow">
        <div id="MenuColumn">
          <div id="LeftArtwork">
            <img id="Statue_1" src="<?php echo $template_path; ?>/images/header/animated-statue.gif" alt="logoartwork" />
            <img id="TibiaLogoArtworkTop" src="<?php echo $template_path; ?>/images/header/<?php echo $config['logo_image']; ?>" onClick="window.location = '<?php echo getLink('news')?>';" alt="logoartwork" />
            <img id="TibiaLogoArtworkBottom" src="<?php echo $template_path; ?>/images/header/tibia-logo-artwork-bottom.gif" alt="logoartwork" />
            <img id="Statue_2" src="<?php echo $template_path; ?>/images/header/animated-statue.gif" alt="logoartwork" />
            <img id="LogoLink" src="<?php echo $template_path; ?>/images/header/tibia-logo-artwork-string.gif" onClick="window.location = 'mailto:<?php echo setting('core.mail_address'); ?>';" alt="logoartwork" />
          </div>

  <div id="Loginbox" >
    <div id="LoginTop" style="background-image:url(<?php echo $template_path; ?>/images/general/box-top.gif)" ></div>
    <div id="BorderLeft" class="LoginBorder" style="background-image:url(<?php echo $template_path; ?>/images/general/chain.gif)" ></div>

    <div class="Loginstatus" style="background-image:url(<?php echo $template_path; ?>/images/loginbox/loginbox-textfield-background.gif)" >
      <div id="LoginstatusText_1" class="LoginstatusText" style="background-image:url(<?php echo $template_path; ?>/images/loginbox/loginbox-font-you-are-not-logged-in.gif)" ></div>
    </div>

    <div id="LoginButtonContainer" style="background-image:url(<?php echo $template_path; ?>/images/loginbox/loginbox-textfield-background.gif)" >
      <div id="LoginButton" style="background-image:url(<?php echo $template_path; ?>/images/global/buttons/sbutton.gif)" >
        <div onClick="LoginButtonAction();" onMouseOver="MouseOverBigButton(this);" onMouseOut="MouseOutBigButton(this);"><div class="Button" style="background-image:url(<?php echo $template_path; ?>/images/global/buttons/sbutton_over.gif)" ></div>
			<?php
          echo '<div id="ButtonText" '.($logged ? '' : 'style="background-image:url('.$template_path.'/images/global/buttons/_sbutton_login.gif)"').'>
			 </div>';
			 ?>
        </div>
      </div>

    </div>

    <div style="clear:both" ></div>

    <div class="Loginstatus" style="background-image:url(<?php echo $template_path; ?>/images/loginbox/loginbox-textfield-background.gif)" >
      <div id="LoginstatusText_2" onClick="LoginstatusTextAction(this);" onMouseOver="MouseOverLoginBoxText(this);" onMouseOut="MouseOutLoginBoxText(this);" ><div id="LoginstatusText_2_1" class="LoginstatusText" style="background-image:url(<?php echo $template_path; ?>/images/loginbox/loginbox-font-create-account.gif)" ></div><div id="LoginstatusText_2_2" class="LoginstatusText" style="background-image:url(<?php echo $template_path; ?>/images/loginbox/loginbox-font-create-account-over.gif)" ></div></div>
    </div>

    <div id="BorderRight" class="LoginBorder" style="background-image:url(<?php echo $template_path; ?>/images/general/chain.gif)" ></div>
    <div id="LoginBottom" class="Loginstatus" style="background-image:url(<?php echo $template_path; ?>/images/general/box-bottom.gif)" ></div>
  </div>

<div id='Menu'>
<div id='MenuTop' style='background-image:url(<?php echo $template_path; ?>/images/general/box-top.gif);'></div>

<?php
$menus = get_template_menus();

$countElements = 0;
foreach($config['menu_categories'] as $id => $cat) {
	if (!isset($menus[$id]) || ($id == MENU_CATEGORY_SHOP && !setting('core.gifts_system'))) {
		continue;
	}

	$countElements++;
}

$i = 0;
foreach($config['menu_categories'] as $id => $cat) {
	if(!isset($menus[$id]) || ($id == MENU_CATEGORY_SHOP && !setting('core.gifts_system'))) {
		continue;
	}

	$i++;
	?>
<div id='<?php echo $cat['id']; ?>' class='menuitem'>
	<span onClick="MenuItemAction('<?php echo $cat['id']; ?>')">
		<div class='MenuButton' style='background-image:url(<?php echo $template_path; ?>/images/menu/button-background.gif);'>
			<div onMouseOver='MouseOverMenuItem(this);' onMouseOut='MouseOutMenuItem(this);'><div class='Button' style='background-image:url(<?php echo $template_path; ?>/images/menu/button-background-over.gif);'></div>
				<span id='<?php echo $cat['id']; ?>_Lights' class='Lights'>
					<div class='light_lu' style='background-image:url(<?php echo $template_path; ?>/images/menu/green-light.gif);'></div>
					<div class='light_ld' style='background-image:url(<?php echo $template_path; ?>/images/menu/green-light.gif);'></div>
					<div class='light_ru' style='background-image:url(<?php echo $template_path; ?>/images/menu/green-light.gif);'></div>
				</span>
				<div id='<?php echo $cat['id']; ?>_Icon' class='Icon' style='background-image:url(<?php echo $template_path; ?>/images/menu/icon-<?php echo $cat['id']; ?>.gif);'></div>
				<div id='<?php echo $cat['id']; ?>_Label' class='Label' style='background-image:url(<?php echo $template_path; ?>/images/menu/label-<?php echo $cat['id']; ?>.gif);'></div>
				<div id='<?php echo $cat['id']; ?>_Extend' class='Extend' style='background-image:url(<?php echo $template_path; ?>/images/general/plus.gif);'></div>
			</div>
		</div>
	</span>
	<div id='<?php echo $cat['id']; ?>_Submenu' class='Submenu'>
	<?php
		foreach($menus[$id] as $category => $menu) {
			$m_name = $menu['name'];
			$m_style = $menu['style_color'];

			if ($menu['link'] === 'donate') {
				$m_style = 'style="color: lime; animation: blinkDonate 1s linear infinite;"';
				$m_name = $m_name . ' <span style="font-family: Arial, sans-serif;">💳</span>';
			} elseif ($menu['link'] === 'whatsapp') {
				$m_name = $m_name . ' <img src="https://img.icons8.com/color/16/whatsapp--v1.png" style="vertical-align:middle;margin-left:3px;" alt="" />';
				$m_style = 'style="color: lime; background: transparent !important; animation: blinkDonate 1s linear infinite;"';
				$menu['link_full'] = 'https://chat.whatsapp.com/JfAG9EkXI5EJUofbr68UcP';
				$menu['target_blank'] = ' target="_blank"';
			} elseif ($menu['link'] === 'telegram') {
				$m_name .= ' <img src="' . $template_path . '/images/menu/hot.gif" style="vertical-align: middle; margin-left: 2px;" alt="HOT!" />';
				$m_style = 'style="color: lightblue; background: transparent !important;"';
			} elseif ($menu['link'] === 'discord') {
				$m_name = $m_name . ' <img src="https://rozinx.online/images/discord.png" style="width:16px;height:16px;vertical-align:middle;margin-left:3px;" alt="" />';
				$m_style = 'style="color: #7289DA; background: transparent !important; font-weight: bold;"';
				$menu['link_full'] = 'https://discord.gg/CH4njxpWk7';
				$menu['target_blank'] = ' target="_blank"';
			} elseif ($menu['link'] === 'tiktok') {
				$m_name = $m_name . ' <img src="https://img.icons8.com/color/16/tiktok--v1.png" style="vertical-align:middle;margin-left:3px;" alt="" />';
				$m_style = 'style="color: #ff0050; background: transparent !important; font-weight: bold;"';
				$menu['link_full'] = 'https://www.tiktok.com/@arielsonrodrigue22';
				$menu['target_blank'] = ' target="_blank"';
			} elseif ($menu['link'] === 'instagram') {
				$m_name = $m_name . ' <img src="https://img.icons8.com/color/16/instagram-new--v1.png" style="vertical-align:middle;margin-left:3px;" alt="" />';
				$m_style = 'style="color: #e1306c; background: transparent !important; font-weight: bold;"';
				$menu['link_full'] = 'https://www.instagram.com/nosleiraot/';
				$menu['target_blank'] = ' target="_blank"';
			} elseif ($menu['link'] === 'forum') {
				$m_style = 'style="color: yellow;"';
			} elseif ($menu['link'] === 'online') {
				$m_name = 'Who is <span style="color: lime;">Online</span>?';
			} elseif ($menu['link'] === 'account/lost') {
				$m_style = 'style="color: red;"';
			} elseif ($menu['link'] === 'downloads') {
				$m_style = 'style="color: red;"';
			} elseif ($menu['link'] === 'account/logout') {
				$m_style = 'style="color: red;"';
			} elseif ($menu['link'] === 'serverinfo') {
				$m_style = 'style="color: yellow;"';
			}
			?>
			<a href='<?php echo $menu['link_full']; ?>'<?= isset($menu['target_blank']) ? $menu['target_blank'] : (isset($menu['blank']) && $menu['blank'] ? ' target="_blank"' : '') ?> <?php if($menu['link'] === 'whatsapp') echo 'onclick="window.open(\'https://chat.whatsapp.com/JfAG9EkXI5EJUofbr68UcP\', \'_blank\'); return false;"'; ?>>
				<div id='submenu_<?php echo str_replace('/', '_', $menu['link']); ?>' class='Submenuitem' onMouseOver='MouseOverSubmenuItem(this)' onMouseOut='MouseOutSubmenuItem(this)' >
					<div class='LeftChain' style='background-image:url(<?php echo $template_path; ?>/images/general/chain.gif);'></div>
					<div id='ActiveSubmenuItemIcon_<?php echo str_replace('/', '_', $menu['link']); ?>' class='ActiveSubmenuItemIcon' style='background-image:url(<?php echo $template_path; ?>/images/menu/icon-activesubmenu.gif);'></div>
					<div class='SubmenuitemLabel' <?php echo $m_style; ?>><?php echo $m_name; ?></div>
					<div class='RightChain' style='background-image:url(<?php echo $template_path; ?>/images/general/chain.gif);'></div>
				</div>
			</a>
			<?php
		}
	?>
	</div>
	<?php
	if ($i == $countElements) {
	?>
		<div id='MenuBottom' style='background-image:url(<?php echo $template_path; ?>/images/general/box-bottom.gif);'></div>
	<?php
	}
	?>
</div>
	<?php
	}
	?>
</div>
		<script type="text/javascript">
			InitializePage();
        </script>
        </div>
        <div id="ContentColumn">
          <div class="Content">
            <div id="ContentHelper">
			<?php echo tickers(); ?>

			<?php if(PAGE === 'news'): ?>
			<div id="FeaturedArticle" class="Box">
				<div class="Corner-tl" style="background-image:url(<?php echo $template_path; ?>/images/content/corner-tl.gif);"></div>
				<div class="Corner-tr" style="background-image:url(<?php echo $template_path; ?>/images/content/corner-tr.gif);"></div>
				<div class="Border_1" style="background-image:url(<?php echo $template_path; ?>/images/content/border-1.gif);"></div>
				<div class="BorderTitleText" style="background-image:url(<?php echo $template_path; ?>/images/content/title-background-green.gif);"></div>
				<img class="Title" src="<?php echo $template_path; ?>/images/header/headline-featuredarticle.gif" alt="Contentbox headline" />
				<div class="Border_2">
					<div class="Border_3">
						<div class="BoxContent" style="background-image:url(<?php echo $template_path; ?>/images/content/scroll.gif);">
							<div style="padding: 5px; font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.4; color: #5a2800;">
								<center>
									<b>
										[<a href="?subtopic=downloads">Downloads</a>] 
										[<a href="?subtopic=highscores">Highscores</a>] 
										[<a href="?subtopic=outfits">Outfits</a>] 
										[<a href="?subtopic=security">Security</a>]
									</b>
								</center>
								<hr style="border: 0; border-bottom: 1px dashed #5a2800; margin: 10px -5px;">
								
								<div style="float: right; margin-left: 15px; margin-bottom: 5px;">
									<img src="<?php echo $template_path; ?>/images/custom/featured_game.png" alt="Featured Game" style="border: 2px solid #5a4430; width: 210px; height: auto; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="document.getElementById('featuredModal').style.display='flex'" title="Clique para ampliar">
								</div>
								
								<!-- Modal Tela Cheia -->
								<div id="featuredModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.85); z-index: 99999; justify-content: center; align-items: center; cursor: pointer;" onclick="this.style.display='none'">
									<img src="<?php echo $template_path; ?>/images/custom/featured_game.png" style="max-width: 90%; max-height: 90%; border: 3px solid #e7d1b3; box-shadow: 0 0 30px rgba(0,0,0,1);">
								</div>
								
								<div style="background: linear-gradient(180deg, #f8f1e5 0%, #ebdcc7 100%); border: 1px solid #c4ab84; border-left: 3px solid #7f0000; border-radius: 3px; padding: 3px 8px; margin-bottom: 4px; display: inline-block; font-size: 12px; color: #4a2505; box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.1);">
									<b style="color: #7f0000;">IP:</b> <b>www.nosleiraot.com</b> &nbsp;&nbsp;&bull;&nbsp;&nbsp; 
									<b style="color: #7f0000;">VERSION:</b> <b>7.4</b> &nbsp;&nbsp;&bull;&nbsp;&nbsp; 
									<b style="color: #7f0000;">PORT:</b> <b>7171</b>
								</div><br>
								A verdadeira experi&ecirc;ncia do Tibia est&aacute; aqui! Fa&ccedil;a sua <b>[<a href="?subtopic=donate">Doa&ccedil;&atilde;o</a>]</b> <img src="<?php echo $template_path; ?>/images/custom/setas.webp" style="height: 14px; vertical-align: middle; margin-left: 3px; animation: bounceLeft 0.5s infinite alternate;"><br>
								<b>NosleiraOT</b> private OTServer, <b>[<a href="?subtopic=serverinfo">Server Info</a>]</b>.<br>
								Servidor privado <b>100% fiel ao original</b>, com mapa completo, todas as miss&otilde;es, &aacute;reas de ca&ccedil;a, respawns e NPCs configurados.<br>
								Todas as cidades, &aacute;reas de ca&ccedil;a e sistemas cl&aacute;ssicos dispon&iacute;veis em um <b>servidor dedicado</b>, com <b>jogabilidade cl&aacute;ssica</b> e foco total na experi&ecirc;ncia que voc&ecirc; viveu<br>
						em 2004 na vers&atilde;o <b>7.4</b>.<br>
								Entre, crie sua conta em <b>[<a href="?subtopic=account/create">Criar Conta</a>]</b> e reviva a era de ouro do Tibia!
								
								<div style="clear: both;"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="Border_1" style="background-image:url(<?php echo $template_path; ?>/images/content/border-1.gif);"></div>
				<div class="CornerWrapper-b"><div class="Corner-bl" style="background-image:url(<?php echo $template_path; ?>/images/content/corner-bl.gif);"></div></div>
				<div class="CornerWrapper-b"><div class="Corner-br" style="background-image:url(<?php echo $template_path; ?>/images/content/corner-br.gif);"></div></div>
			</div>
			<?php endif; ?>


  <div id="News" class="Box">
    <div class="Corner-tl" style="background-image:url(<?php echo $template_path; ?>/images/content/corner-tl.gif);"></div>
    <div class="Corner-tr" style="background-image:url(<?php echo $template_path; ?>/images/content/corner-tr.gif);"></div>
    <div class="Border_1" style="background-image:url(<?php echo $template_path; ?>/images/content/border-1.gif);"></div>
    <div class="BorderTitleText" style="background-image:url(<?php echo $template_path; ?>/images/content/title-background-green.gif);"></div>
	<?php
	$headline = $template_path.'/images/header/headline-' . PAGE . '.gif';
	if(!file_exists($headline))
		$headline = $template_path . '/headline.php?t=' . ucfirst($title);
?>
	<img class="Title" src="<?php echo $headline; ?>" alt="Contentbox headline" />
    <div class="Border_2">
      <div class="Border_3">
		<?php $hooks->trigger(HOOK_TIBIACOM_BORDER_3); ?>
		<div class="BoxContent" style="background-image:url(<?php echo $template_path; ?>/images/content/scroll.gif);">
			
			<?php if(PAGE === 'news'): ?>
			<div style="margin-bottom: 10px; border: 1px solid #5a4430; background-color: #e7d1b3; padding: 5px;">
				<div style="background-color: #7b1212; border: 1px solid #4a0000; padding: 3px 5px; color: white; font-weight: bold; font-size: 11px; margin-bottom: 5px; text-shadow: 1px 1px 1px black;">
					[Most Powerful GUILDS]
				</div>
				<table width="100%" border="0" cellpadding="2" cellspacing="0">
					<tr>
<?php
$guilds = $db->query("SELECT id, name FROM guilds ORDER BY id DESC LIMIT 4")->fetchAll();
if (count($guilds) > 0) {
	foreach($guilds as $g) {
		$logoUrl = getGuildLogoById($g['id']);
		echo '		<td align="center" width="25%" style="vertical-align: top; padding-top: 5px;">
			<a href="?subtopic=guilds&action=show&guild=' . urlencode($g['name']) . '">
				<div style="width: 64px; height: 64px; margin: 0 auto 5px auto; background: transparent url(\'' . $logoUrl . '\') center center no-repeat; background-size: contain;"></div>
			</a>
			<b><a href="?subtopic=guilds&action=show&guild=' . urlencode($g['name']) . '" style="color: #004294; text-decoration: none; font-size: 11px;">' . htmlspecialchars($g['name']) . '</a></b>
		</td>';
	}
} else {
	echo '<td align="center">Nenhuma guild encontrada.</td>';
}
?>
					</tr>
				</table>
			</div>
			<?php endif; ?>
			
			<?php echo template_place_holder('center_top') . $content; ?>
		</div>
      </div>
    </div>
    <div class="Border_1" style="background-image:url(<?php echo $template_path; ?>/images/content/border-1.gif);"></div>

    <div class="CornerWrapper-b"><div class="Corner-bl" style="background-image:url(<?php echo $template_path; ?>/images/content/corner-bl.gif);"></div></div>
    <div class="CornerWrapper-b"><div class="Corner-br" style="background-image:url(<?php echo $template_path; ?>/images/content/corner-br.gif);"></div></div>
  </div>
           </div>
          </div>
          <div id="Footer"><?php echo template_footer(); ?></div>
        </div>
        <div id="ThemeboxesColumn">
          <div id="RightArtwork">
            <img id="Monster" style="max-width: 56px !important; max-height: 56px !important; width: auto !important; height: auto !important; top: -126px !important; left: 12px !important; position: absolute; z-index: 15; cursor: pointer;" src="images/monsters/<?php echo logo_monster() ?>.gif?v=<?php echo time(); ?>" onClick="window.location = '?subtopic=creatures&creature=<?php echo $config['logo_monster'] ?>';" alt="Monster of the Week" />
            <img id="PedestalAndOnline" src="<?php echo $template_path; ?>/images/header/pedestal-and-online.gif" alt="Monster Pedestal and Players Online Box"/>
          <div id="PlayersOnline" onClick="window.location = '<?php echo getLink('online'); ?>'">
		  <?php
			if(isset($config['server_maintenance']) && $config['server_maintenance']) {
				echo '<span style="color: orange; font-size: 11px;"><b>Server<br />em Manutenção</b></span>';
			} elseif($status['online']) {
				echo '<span style="font-size: 11px; font-weight: bold; color: #00ff66; text-shadow: 0 0 3px rgba(0, 255, 102, 0.4);">' . $status['players'] . '</span><br/><span style="color: #cfa600; font-size: 9px; font-weight: bold;">Players Online</span>';
			} else {
				echo '<span style="color: red"><b>Server<br />Offline</b></span>';
			}
			?></div>
        </div>

        <div id="Themeboxes">
			<?php
			$twig_loader->prependPath(__DIR__ . '/boxes/templates');

			foreach($config['boxes'] as $box) {
				/** @var string $template_name */
				$file = __DIR__ . '/boxes/' . $box . '.php';
				if(file_exists($file)) {
					include($file); ?>
				<?php
				}
			}

 ?>
        </div>
      </div>
     </div>
    </div>
  </div>
	<?php echo template_place_holder('body_end'); ?>
</body>
</html>
<?php
function logo_monster()
{
	global $config;
	return str_replace(" ", "", trim(strtolower($config['logo_monster'])));
}

