<?php
/**
 * Gerador dinâmico de Headline para o template TibiaCom
 * Suporte completo a UTF-8 e caracteres acentuados (ã, õ, á, é, í, ó, ú, ç, ê, ô)
 */
$text = isset($_GET['t']) ? trim($_GET['t']) : '';
if(strlen($text) > 120) {
	$text = '';
}

// Normaliza traços longos Unicode para hífen comum
$text = str_replace(["\xE2\x80\x93", "\xE2\x80\x94", '–', '—'], '-', $text);

// Configuração do caminho de fontes
putenv('GDFONTPATH=' . __DIR__);

// Cria a imagem de 600x28 com fundo transparente
$image = imagecreatetruecolor(600, 28);
imagecolortransparent($image, imagecolorallocate($image, 0, 0, 0));

// A fonte martel.ttf original da CipSoft possui apenas 91 caracteres ASCII básicos (sem acentos).
// Quando o texto possui acentos ou caracteres latinos estendidos, utilizamos uncial.ttf
// que possui o mapa de caracteres medieval completo com suporte nativo a acentuação.
$hasAccents = preg_match('/[^\x20-\x7E]/', $text);
$fontFile = $hasAccents ? 'uncial.ttf' : 'martel.ttf';

$font = __DIR__ . DIRECTORY_SEPARATOR . $fontFile;
if(!file_exists($font)) {
	$font = __DIR__ . DIRECTORY_SEPARATOR . 'martel.ttf';
	$fontFile = 'martel.ttf';
}

$color = imagecolorallocate($image, 240, 209, 164);

if($fontFile === 'uncial.ttf') {
	$fontSize = 16;
	$yOffset = 21;
} else {
	$fontSize = 18;
	$yOffset = 20;
}

imagettftext($image, $fontSize, 0, 4, $yOffset, $color, $font, $text);

// Header e saída da imagem
header('Content-type: image/png');
imagepng($image);
