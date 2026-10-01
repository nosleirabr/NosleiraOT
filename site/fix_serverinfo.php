<?php
$file = 'D:\Server\site\system\templates\serverinfo.html.twig';
$content = file_get_contents($file);

$content = preg_replace('/\.TableContainer \.Table3 \{.*?\}/s', '', $content);
$content = preg_replace('/\.Table3 th \{.*?\}/s', '.TableContent th { background-color: #505050; color: #fff; padding: 5px; text-align: left; font-weight: bold; border: 1px solid #faf0d7; }', $content);
$content = preg_replace('/\.Table3 td \{.*?\}/s', '', $content);

$sections = [
    'STATUS' => 'Status',
    'RATES' => 'Rates',
    'INFO SERVER' => 'Info Server',
    'COMMANDS' => 'Commands',
    'FRAGS' => 'Frags',
    'OTHER INFORMATION' => 'Other Information'
];

foreach ($sections as $marker => $title) {
    $anchor = strtolower(str_replace(' ', '', $marker));
    $var = substr($anchor, 0, 4); // stat, rate, info, comm, frag, othe
    
    $regex = '/<!-- ' . preg_quote($marker) . ' -->.*?<div style="border-left: 1px solid #000; border-right: 1px solid #000; border-bottom: 1px solid #000;"><table class="Table3" cellpadding="4" cellspacing="0">(.*?)<\/table>\s*<\/div>\s*<\/div>/s';
    
    $replace = "<!-- $marker -->
<a name=\"$anchor\"></a>
{% set {$var}_content %}
$1
{% endset %}
{% set {$var}_shadowbox %}
    {% include 'tables.shadowbox.html.twig' with {'content': {$var}_content} %}
{% endset %}
{% include 'tables.headline.html.twig' with {'title': '$title', 'content': {$var}_shadowbox} %}";

    $content = preg_replace($regex, $replace, $content);
}

file_put_contents($file, $content);
