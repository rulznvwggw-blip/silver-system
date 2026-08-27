<?php
require '/app/vendor/autoload.php';
$app = require_once '/app/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

require '/app/seed_multipurpose.php';
