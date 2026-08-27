<?php

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

$now = Carbon::now();

// 1. Create Location
$location = DB::table('locations')->where('short', 'ID-JKT')->first();
if (!$location) {
    $locId = DB::table('locations')->insertGetId([
        'short' => 'ID-JKT',
        'long' => 'Jakarta Main Datacenter',
        'created_at' => $now,
        'updated_at' => $now,
    ]);
    echo "Location created with ID: {$locId}\n";
} else {
    $locId = $location->id;
    echo "Location already exists with ID: {$locId}\n";
}

// 2. Create Node
$node = DB::table('nodes')->where('name', 'Node-Main-01')->first();
if (!$node) {
    $token = Str::random(32);
    $tokenId = Str::random(16);
    $nodeUuid = Str::uuid()->toString();

    $nodeId = DB::table('nodes')->insertGetId([
        'uuid' => $nodeUuid,
        'public' => 1,
        'name' => 'Node-Main-01',
        'description' => 'Main Multi-Purpose Node',
        'location_id' => $locId,
        'fqdn' => 'pteronode.rullzyestorepremium.my.id',
        'scheme' => 'https',
        'behind_proxy' => 1,
        'maintenance_mode' => 0,
        'memory' => 16384,
        'memory_overallocate' => 0,
        'disk' => 100000,
        'disk_overallocate' => 0,
        'upload_size' => 500,
        'daemon_token_id' => $tokenId,
        'daemon_token' => encrypt($token),
        'daemonListen' => 8080,
        'daemonSFTP' => 2022,
        'daemonBase' => '/var/lib/pterodactyl/volumes',
        'created_at' => $now,
        'updated_at' => $now,
    ]);
    echo "Node created with ID: {$nodeId}, UUID: {$nodeUuid}\n";
} else {
    $nodeId = $node->id;
    echo "Node already exists with ID: {$nodeId}\n";
}

// 3. Create Allocations for Node
$ports = [
    // Minecraft ports
    25565, 25566, 25567, 25568, 25569, 25570,
    // Bot & Webhook ports
    3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010,
    // Custom & Generic App ports
    8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 8010
];

foreach ($ports as $port) {
    $exists = DB::table('allocations')
        ->where('node_id', $nodeId)
        ->where('port', $port)
        ->exists();

    if (!$exists) {
        DB::table('allocations')->insert([
            'node_id' => $nodeId,
            'ip' => '0.0.0.0',
            'ip_alias' => 'pteronode.rullzyestorepremium.my.id',
            'port' => $port,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }
}
echo "Allocations created successfully.\n";

// 4. Create Nest: Bot Services
$botNest = DB::table('nests')->where('name', 'Bot Services')->first();
if (!$botNest) {
    $botNestId = DB::table('nests')->insertGetId([
        'uuid' => Str::uuid()->toString(),
        'author' => 'admin@local.host',
        'name' => 'Bot Services',
        'description' => 'Layanan Hosting Bot WhatsApp & Telegram',
        'created_at' => $now,
        'updated_at' => $now,
    ]);
} else {
    $botNestId = $botNest->id;
}
echo "Nest 'Bot Services' ID: {$botNestId}\n";

// 5. Create Egg: WhatsApp Bot (Baileys / Node.js)
$waEgg = DB::table('eggs')->where('nest_id', $botNestId)->where('name', 'WhatsApp Bot (Baileys)')->first();
if (!$waEgg) {
    $waEggId = DB::table('eggs')->insertGetId([
        'uuid' => Str::uuid()->toString(),
        'nest_id' => $botNestId,
        'author' => 'admin@local.host',
        'name' => 'WhatsApp Bot (Baileys)',
        'description' => 'Bot WhatsApp berbasis Node.js / Baileys dengan auto npm install',
        'docker_images' => json_encode([
            'NodeJS 20' => 'ghcr.io/parkervcp/yolks:nodejs_20',
            'NodeJS 22' => 'ghcr.io/parkervcp/yolks:nodejs_22',
            'NodeJS 18' => 'ghcr.io/parkervcp/yolks:nodejs_18'
        ]),
        'config_startup' => json_encode(['done' => 'Bot connected', 'userInteraction' => []]),
        'config_stop' => '^C',
        'startup' => 'if [[ -d .git ]] && [[ "{{AUTO_UPDATE}}" == "1" ]]; then git pull; fi; if [[ ! -d node_modules ]] || [[ "{{REINSTALL_NODE_MODULES}}" == "1" ]]; then npm install --production; fi; node {{MAIN_FILE}}',
        'script_container' => 'ghcr.io/parkervcp/installers:alpine',
        'script_entry' => 'ash',
        'script_is_privileged' => 0,
        'script_install' => "#!/bin/ash\nmkdir -p /mnt/server\ncd /mnt/server\n",
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    // Variables for WA Egg
    DB::table('egg_variables')->insert([
        [
            'egg_id' => $waEggId,
            'name' => 'Main File',
            'description' => 'File entrypoint bot (contoh: index.js atau main.js)',
            'env_variable' => 'MAIN_FILE',
            'default_value' => 'index.js',
            'user_viewable' => 1,
            'user_editable' => 1,
            'rules' => 'required|string|max:40',
            'created_at' => $now,
            'updated_at' => $now,
        ],
        [
            'egg_id' => $waEggId,
            'name' => 'Auto Update (Git)',
            'description' => 'Tarik kode git terbaru otomatis saat server mulai (1 = Ya, 0 = Tidak)',
            'env_variable' => 'AUTO_UPDATE',
            'default_value' => '0',
            'user_viewable' => 1,
            'user_editable' => 1,
            'rules' => 'required|boolean',
            'created_at' => $now,
            'updated_at' => $now,
        ],
        [
            'egg_id' => $waEggId,
            'name' => 'Reinstall Dependencies',
            'description' => 'Jalankan npm install ulang saat server mulai (1 = Ya, 0 = Tidak)',
            'env_variable' => 'REINSTALL_NODE_MODULES',
            'default_value' => '0',
            'user_viewable' => 1,
            'user_editable' => 1,
            'rules' => 'required|boolean',
            'created_at' => $now,
            'updated_at' => $now,
        ]
    ]);
}
echo "Egg 'WhatsApp Bot' ready.\n";

// 6. Create Egg: Telegram Bot (Node.js & Python)
$tgEgg = DB::table('eggs')->where('nest_id', $botNestId)->where('name', 'Telegram Multi-Bot')->first();
if (!$tgEgg) {
    $tgEggId = DB::table('eggs')->insertGetId([
        'uuid' => Str::uuid()->toString(),
        'nest_id' => $botNestId,
        'author' => 'admin@local.host',
        'name' => 'Telegram Multi-Bot',
        'description' => 'Bot Telegram dengan dukungan Node.js dan Python',
        'docker_images' => json_encode([
            'Python 3.11' => 'ghcr.io/parkervcp/yolks:python_3.11',
            'Python 3.12' => 'ghcr.io/parkervcp/yolks:python_3.12',
            'NodeJS 20' => 'ghcr.io/parkervcp/yolks:nodejs_20'
        ]),
        'config_startup' => json_encode(['done' => 'Bot is running', 'userInteraction' => []]),
        'config_stop' => '^C',
        'startup' => 'if [[ -f package.json ]]; then if [[ ! -d node_modules ]]; then npm install; fi; node {{BOT_START_FILE}}; elif [[ -f requirements.txt ]]; then pip install -r requirements.txt; python3 {{BOT_START_FILE}}; else python3 {{BOT_START_FILE}}; fi',
        'script_container' => 'ghcr.io/parkervcp/installers:alpine',
        'script_entry' => 'ash',
        'script_is_privileged' => 0,
        'script_install' => "#!/bin/ash\nmkdir -p /mnt/server\ncd /mnt/server\n",
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    DB::table('egg_variables')->insert([
        [
            'egg_id' => $tgEggId,
            'name' => 'Bot Start File',
            'description' => 'File eksekusi bot (contoh: bot.py atau bot.js)',
            'env_variable' => 'BOT_START_FILE',
            'default_value' => 'main.py',
            'user_viewable' => 1,
            'user_editable' => 1,
            'rules' => 'required|string|max:40',
            'created_at' => $now,
            'updated_at' => $now,
        ],
        [
            'egg_id' => $tgEggId,
            'name' => 'Telegram Bot Token',
            'description' => 'Token API Telegram Bot dari BotFather',
            'env_variable' => 'BOT_TOKEN',
            'default_value' => '',
            'user_viewable' => 1,
            'user_editable' => 1,
            'rules' => 'nullable|string',
            'created_at' => $now,
            'updated_at' => $now,
        ]
    ]);
}
echo "Egg 'Telegram Multi-Bot' ready.\n";

// 7. Create Nest: Custom Applications
$customNest = DB::table('nests')->where('name', 'Custom Applications')->first();
if (!$customNest) {
    $customNestId = DB::table('nests')->insertGetId([
        'uuid' => Str::uuid()->toString(),
        'author' => 'admin@local.host',
        'name' => 'Custom Applications',
        'description' => 'Layanan Hosting SIAO & Aplikasi Generic Kustom',
        'created_at' => $now,
        'updated_at' => $now,
    ]);
} else {
    $customNestId = $customNest->id;
}
echo "Nest 'Custom Applications' ID: {$customNestId}\n";

// 8. Create Egg: SIAO Engine
$siaoEgg = DB::table('eggs')->where('nest_id', $customNestId)->where('name', 'SIAO Engine')->first();
if (!$siaoEgg) {
    $siaoEggId = DB::table('eggs')->insertGetId([
        'uuid' => Str::uuid()->toString(),
        'nest_id' => $customNestId,
        'author' => 'admin@local.host',
        'name' => 'SIAO Engine',
        'description' => 'Engine aplikasi start-stop custom (Node/Python/Binary) dengan alokasi port',
        'docker_images' => json_encode([
            'Debian Bookworm' => 'ghcr.io/parkervcp/yolks:debian',
            'Alpine Linux' => 'ghcr.io/parkervcp/yolks:alpine',
            'Ubuntu 22.04' => 'ghcr.io/parkervcp/yolks:ubuntu'
        ]),
        'config_startup' => json_encode(['done' => 'Application started', 'userInteraction' => []]),
        'config_stop' => '^C',
        'startup' => 'chmod +x {{STARTUP_SCRIPT}} && ./{{STARTUP_SCRIPT}}',
        'script_container' => 'ghcr.io/parkervcp/installers:alpine',
        'script_entry' => 'ash',
        'script_is_privileged' => 0,
        'script_install' => "#!/bin/ash\nmkdir -p /mnt/server\ncd /mnt/server\n",
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    DB::table('egg_variables')->insert([
        [
            'egg_id' => $siaoEggId,
            'name' => 'Startup Script',
            'description' => 'Nama file skrip yang akan dijalankan',
            'env_variable' => 'STARTUP_SCRIPT',
            'default_value' => 'start.sh',
            'user_viewable' => 1,
            'user_editable' => 1,
            'rules' => 'required|string|max:40',
            'created_at' => $now,
            'updated_at' => $now,
        ],
        [
            'egg_id' => $siaoEggId,
            'name' => 'App Port',
            'description' => 'Port aplikasi (otomatis sesuai alokasi server)',
            'env_variable' => 'APP_PORT',
            'default_value' => '{{SERVER_PORT}}',
            'user_viewable' => 1,
            'user_editable' => 0,
            'rules' => 'required|string',
            'created_at' => $now,
            'updated_at' => $now,
        ]
    ]);
}
echo "Egg 'SIAO Engine' ready.\n";

// 9. Create Egg: Generic Container
$genericEgg = DB::table('eggs')->where('nest_id', $customNestId)->where('name', 'Generic Container')->first();
if (!$genericEgg) {
    $genericEggId = DB::table('eggs')->insertGetId([
        'uuid' => Str::uuid()->toString(),
        'nest_id' => $customNestId,
        'author' => 'admin@local.host',
        'name' => 'Generic Container',
        'description' => 'Aplikasi generic dengan Docker Image dan Startup Command kustom',
        'docker_images' => json_encode([
            'Debian' => 'ghcr.io/parkervcp/yolks:debian',
            'Ubuntu' => 'ghcr.io/parkervcp/yolks:ubuntu',
            'Alpine' => 'ghcr.io/parkervcp/yolks:alpine'
        ]),
        'config_startup' => json_encode(['done' => 'Started', 'userInteraction' => []]),
        'config_stop' => '^C',
        'startup' => '{{CUSTOM_START_CMD}}',
        'script_container' => 'ghcr.io/parkervcp/installers:alpine',
        'script_entry' => 'ash',
        'script_is_privileged' => 0,
        'script_install' => "#!/bin/ash\nmkdir -p /mnt/server\ncd /mnt/server\n",
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    DB::table('egg_variables')->insert([
        [
            'egg_id' => $genericEggId,
            'name' => 'Custom Startup Command',
            'description' => 'Perintah bash untuk menjalankan aplikasi',
            'env_variable' => 'CUSTOM_START_CMD',
            'default_value' => 'bash start.sh',
            'user_viewable' => 1,
            'user_editable' => 1,
            'rules' => 'required|string',
            'created_at' => $now,
            'updated_at' => $now,
        ]
    ]);
}
echo "Egg 'Generic Container' ready.\n";
echo "\n=== ALL SEEDING FINISHED SUCCESSFULLY! ===\n";
