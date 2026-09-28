<?php
require "common.php";
$cache->delete("template_ini_" . $config["template"]);
echo "Cache cleared!\n";
