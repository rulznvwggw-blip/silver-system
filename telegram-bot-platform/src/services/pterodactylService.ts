import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { HostingPackage } from '../data/packages300.js';
import { db } from '../database/db.js';

const execAsync = promisify(exec);

const PTERO_API_URL = 'http://localhost:8080/api/application';
const PTERO_API_KEY = 'AdgM9Jbg92evbI3mcSdQ1Jm89fge8N8vUFnTXS4kUgRGiOG9';
const PUBLIC_NODE_DOMAIN = 'pteronode.rullzyestorepremium.my.id';
const PUBLIC_PANEL_URL = 'https://ptero.rullzyestorepremium.my.id';

export interface PteroUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ProvisionResult {
  serverId: number;
  serverIdentifier: string;
  name: string;
  port: number;
  panelUrl: string;
  username: string;
  nodeHost: string;
}

export async function seedServerStarterFiles(uuid: string, category: string, port: number): Promise<void> {
  const volPath = `/var/lib/pterodactyl/volumes/${uuid}`;
  try {
    await fs.mkdir(volPath, { recursive: true });

    if (category === 'whatsapp') {
      const packageJson = {
        name: 'rullzyestore-whatsapp-bot',
        version: '1.0.0',
        description: 'WhatsApp Bot Ready-to-Use',
        main: 'index.js',
        scripts: { start: 'node index.js' },
        dependencies: {
          '@whiskeysockets/baileys': '^6.7.8',
          'pino': '^9.0.0',
          'qrcode-terminal': '^0.12.0',
        },
      };

      const indexJs = `const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');

async function startBot() {
  console.log('====================================================');
  console.log('🚀 [RULLZYESTORE CLOUD] MEMULAI BOT WHATSAPP...');
  console.log('🌐 Node: ${PUBLIC_NODE_DOMAIN} | Port: ${port}');
  console.log('====================================================\\n');
  
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['RullzyeStore Cloud', 'Chrome', '1.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log('\\n📲 SILAKAN SCAN QR CODE DI ATAS DENGAN WHATSAPP ANDA!\\n');
    }
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('⚠️ Koneksi terputus. Mencoba menghubungkan kembali:', shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('✅ BOT WHATSAPP BERHASIL TERHUBUNG & AKTIF 24 JAM NONSTOP!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;
    
    const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const from = m.key.remoteJid;

    if (text.startsWith('.ping') || text.startsWith('/ping')) {
      await sock.sendMessage(from, { text: '🏓 Pong! Bot WhatsApp Anda aktif 24 jam di RullzyeStore Cloud 🚀' });
    }
  });
}

startBot().catch(err => console.error('Error:', err));
`;

      const readme = `=========================================================
🚀 RULLZYE STORE CLOUD - WHATSAPP BOT SIAP PAKAI
=========================================================
Status Server : SIAP DIGUNAKAN (READY TO USE)
Domain Node   : ${PUBLIC_NODE_DOMAIN}
Alokasi Port  : ${port}

PANDUAN MENJALANKAN BOT:
1. Klik tab "Console" di menu samping kiri panel.
2. Klik tombol "START" warna biru di pojok kanan atas.
3. Scan QR Code yang muncul di layar console menggunakan WhatsApp Anda!
4. Ketik .ping di WhatsApp untuk menguji bot Anda.

👉 Anda dapat mengunggah file bot Anda di tab "File Manager" kapan saja.
=========================================================
`;

      await fs.writeFile(path.join(volPath, 'package.json'), JSON.stringify(packageJson, null, 2));
      await fs.writeFile(path.join(volPath, 'index.js'), indexJs);
      await fs.writeFile(path.join(volPath, 'README.txt'), readme);
      await fs.writeFile(path.join(volPath, '.env'), 'BOT_NAME="Rullzye WhatsApp Bot"\nPREFIX="."\n');

    } else if (category === 'telegram') {
      const mainPy = `import os
import sys
import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

TOKEN = os.getenv("BOT_TOKEN", "").strip()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Halo! Bot Telegram Anda aktif 24 jam di RullzyeStore Cloud 🚀\\n\\n"
        "Perintah tersedia:\\n"
        "/start - Menampilkan pesan ini\\n"
        "/ping - Cek status bot"
    )

async def ping(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🏓 Pong! Server RullzyeStore Cloud Online 💚")

def main():
    print("====================================================")
    print("🚀 [RULLZYESTORE CLOUD] MEMULAI BOT TELEGRAM...")
    print("🌐 Node: ${PUBLIC_NODE_DOMAIN} | Port: ${port}")
    print("====================================================\\n")
    if not TOKEN or TOKEN == "ISI_TOKEN_BOT_DI_TAB_STARTUP":
        print("⚠️ PERINGATAN: BOT_TOKEN belum diisi!")
        print("👉 Silakan buka tab 'Startup' di panel kiri atau edit file '.env' dan masukkan Token Bot Telegram dari @BotFather.")
        print("Kemudian klik tombol 'Restart' di pojok kanan atas.")
        return

    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("ping", ping))
    print("✅ Bot Telegram siap menerima perintah!")
    app.run_polling()

if __name__ == '__main__':
    main()
`;

      const reqs = `python-telegram-bot>=20.0\nrequests\npython-dotenv\n`;
      const readme = `=========================================================
🚀 RULLZYE STORE CLOUD - TELEGRAM BOT SIAP PAKAI
=========================================================
Status Server : SIAP DIGUNAKAN (READY TO USE)
Domain Node   : ${PUBLIC_NODE_DOMAIN}
Alokasi Port  : ${port}

PANDUAN MENJALANKAN BOT:
1. Buka tab "Startup" di panel kiri.
2. Masukkan Bot Token dari @BotFather ke kolom "BOT_TOKEN".
3. Buka tab "Console", lalu klik tombol "START"!
=========================================================
`;

      await fs.writeFile(path.join(volPath, 'main.py'), mainPy);
      await fs.writeFile(path.join(volPath, 'requirements.txt'), reqs);
      await fs.writeFile(path.join(volPath, 'README.txt'), readme);
      await fs.writeFile(path.join(volPath, '.env'), 'BOT_TOKEN=\n');

    } else if (category === 'minecraft') {
      const serverProps = `server-port=${port}
server-ip=0.0.0.0
query.port=${port}
enable-query=true
online-mode=false
motd=\\u00A7b\\u00A7lRullzyeStore\\u00A7r \\u00A77- \\u00A7aMinecraft Server 24/7
max-players=50
difficulty=easy
gamemode=survival
pvp=true
view-distance=10
simulation-distance=8
spawn-protection=0
allow-flight=true
`;

      const readme = `=========================================================
⛏️ RULLZYE STORE CLOUD - MINECRAFT SERVER SIAP PAKAI
=========================================================
Status Server : SIAP DIGUNAKAN (READY TO USE)
IP Server     : ${PUBLIC_NODE_DOMAIN}:${port}

PANDUAN MENJALANKAN SERVER:
1. Buka tab "Console" di panel kiri.
2. Klik tombol "START" warna biru di pojok kanan atas!
3. Buka Minecraft (Java Edition / PojavLauncher) dan connect ke:
   ${PUBLIC_NODE_DOMAIN}:${port}
=========================================================
`;

      await fs.writeFile(path.join(volPath, 'eula.txt'), 'eula=true\n');
      await fs.writeFile(path.join(volPath, 'server.properties'), serverProps);
      await fs.writeFile(path.join(volPath, 'README.txt'), readme);

    } else if (category === 'vps') {
      const readme = `=========================================================
🚀 RULLZYE STORE CLOUD - LINUX VPS CONTAINER SIAP PAKAI
=========================================================
Status Server : SIAP DIGUNAKAN (READY TO USE)
Node Host     : ${PUBLIC_NODE_DOMAIN}
Alokasi Port  : ${port}

Container Linux Debian siap digunakan 24 jam nonstop.
=========================================================
`;
      await fs.writeFile(path.join(volPath, 'README.txt'), readme);
    }

    // Set ownership to pterodactyl daemon user (999:984)
    await execAsync(`sudo chown -R 999:984 ${volPath}`);
  } catch (err: any) {
    console.warn('[SEED FILES WARNING]', err.message);
  }
}

export const pterodactylService = {
  async getOrCreateUser(telegramId: number, name: string, username?: string): Promise<{ user: PteroUser; generatedPassword: string }> {
    const cleanUsername = (username || `tg_${telegramId}`).toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 16);
    const email = `user_${telegramId}@rullzyestore.my.id`;
    
    // Check if user already exists with password
    const existingDbUser = await db.getUser(telegramId);
    const finalPassword = existingDbUser?.ptero_password || `Rullzye_${Math.random().toString(36).slice(-6)}!`;

    // Direct Instant Container User Provisioning with Password Sync
    try {
      const phpScript = `
        $email = '${email}';
        $user = Pterodactyl\\Models\\User::where('email', $email)->first();
        if (!$user) {
          $user = Pterodactyl\\Models\\User::create([
            'external_id' => '${telegramId}',
            'email' => $email,
            'username' => '${cleanUsername}',
            'name_first' => '${name.replace(/'/g, '') || 'Customer'}',
            'name_last' => 'RullzyeStore',
            'password' => bcrypt('${finalPassword}'),
            'language' => 'en',
            'root_admin' => false,
          ]);
        } else {
          $user->update([
            'password' => bcrypt('${finalPassword}')
          ]);
        }
        echo json_encode([
          'id' => $user->id,
          'username' => $user->username,
          'email' => $user->email,
          'first_name' => $user->name_first,
          'last_name' => $user->name_last,
        ]);
      `;

      const encoded = Buffer.from(phpScript).toString('base64');
      const cmd = `docker exec silver-system-panel-1 php -r "require 'vendor/autoload.php'; \\$app = require_once 'bootstrap/app.php'; \\$kernel = \\$app->make(Illuminate\\Contracts\\Console\\Kernel::class); \\$kernel->bootstrap(); eval(base64_decode('${encoded}'));"`;
      
      const { stdout } = await execAsync(cmd);
      const data = JSON.parse(stdout.trim());

      await db.savePteroCredentials(telegramId, data.id, data.username, finalPassword);

      return {
        user: data,
        generatedPassword: finalPassword,
      };
    } catch (err: any) {
      console.error('[PTERO USER ERROR]', err);
      return {
        user: {
          id: existingDbUser?.ptero_user_id || 1,
          username: existingDbUser?.ptero_username || cleanUsername,
          email,
          first_name: name || 'Customer',
          last_name: 'RullzyeStore',
        },
        generatedPassword: finalPassword,
      };
    }
  },

  async createServer(pteroUserId: number, pkg: HostingPackage, serverName: string): Promise<ProvisionResult> {
    const cleanServerName = serverName.replace(/['"\\]/g, '').slice(0, 40);

    let eggId = pkg.eggId || 15;
    let image = pkg.dockerImage || 'ghcr.io/parkervcp/yolks:nodejs_20';
    let startup = 'if [[ -d .git ]] && [[ "{{AUTO_UPDATE}}" == "1" ]]; then git pull; fi; if [[ ! -d node_modules ]] || [[ "{{REINSTALL_NODE_MODULES}}" == "1" ]]; then npm install --production; fi; node {{MAIN_FILE}}';

    if (pkg.category === 'minecraft') {
      eggId = 2;
      image = 'ghcr.io/pterodactyl/yolks:java_21';
      startup = 'java -Xms128M -XX:MaxRAMPercentage=95.0 -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}';
    } else if (pkg.category === 'telegram') {
      eggId = 16;
      image = 'ghcr.io/parkervcp/yolks:python_3.11';
      startup = 'if [[ -f package.json ]]; then if [[ ! -d node_modules ]]; then npm install; fi; node {{BOT_START_FILE}}; elif [[ -f requirements.txt ]]; then pip install -r requirements.txt; python3 {{BOT_START_FILE}}; else python3 {{BOT_START_FILE}}; fi';
    } else if (pkg.category === 'vps') {
      eggId = 18;
      image = 'ghcr.io/parkervcp/yolks:debian';
      startup = 'bash';
    }

    const phpCode = `
      $user = Pterodactyl\\Models\\User::find(${pteroUserId});
      if (!$user) {
        $user = Pterodactyl\\Models\\User::first();
      }
      
      $node = Pterodactyl\\Models\\Node::find(1);
      $alloc = Pterodactyl\\Models\\Allocation::where('node_id', 1)->whereNull('server_id')->first();
      if (!$alloc) {
        $maxPort = Pterodactyl\\Models\\Allocation::where('node_id', 1)->max('port') ?? 3000;
        $alloc = Pterodactyl\\Models\\Allocation::create([
          'node_id' => 1,
          'ip' => '0.0.0.0',
          'port' => $maxPort + 1,
          'ip_alias' => '${PUBLIC_NODE_DOMAIN}',
        ]);
      }

      $egg = Pterodactyl\\Models\\Egg::find(${eggId});
      if (!$egg) $egg = Pterodactyl\\Models\\Egg::first();

      $uuid = Ramsey\\Uuid\\Uuid::uuid4()->toString();
      $uuidShort = substr($uuid, 0, 8);

      $server = Pterodactyl\\Models\\Server::create([
        'uuid' => $uuid,
        'uuidShort' => $uuidShort,
        'node_id' => 1,
        'name' => '${cleanServerName}',
        'description' => 'Server otomatis RullzyeStore (${pkg.durationLabel}) - Siap Pakai',
        'status' => null,
        'installed_at' => now(),
        'owner_id' => $user->id,
        'memory' => ${pkg.ramMb},
        'swap' => 0,
        'disk' => ${pkg.diskGb * 1024},
        'io' => 500,
        'cpu' => ${pkg.cpuPercent},
        'threads' => null,
        'oom_disabled' => true,
        'allocation_id' => $alloc->id,
        'nest_id' => $egg->nest_id,
        'egg_id' => $egg->id,
        'startup' => '${startup.replace(/'/g, "\\'")}',
        'image' => '${image}',
        'database_limit' => 1,
        'allocation_limit' => 1,
        'backup_limit' => 2,
        'created_at' => now(),
        'updated_at' => now()
      ]);

      $alloc->update(['server_id' => $server->id]);

      // Seed egg variables
      $eggVars = Pterodactyl\\Models\\EggVariable::where('egg_id', $egg->id)->get();
      foreach ($eggVars as $v) {
        Pterodactyl\\Models\\ServerVariable::create([
          'server_id' => $server->id,
          'variable_id' => $v->id,
          'variable_value' => $v->default_value ?? '',
        ]);
      }

      echo json_encode([
        'serverId' => $server->id,
        'serverIdentifier' => $server->uuidShort,
        'uuid' => $server->uuid,
        'name' => $server->name,
        'port' => $alloc->port,
        'username' => $user->username,
        'panelUrl' => '${PUBLIC_PANEL_URL}',
        'nodeHost' => '${PUBLIC_NODE_DOMAIN}'
      ]);
    `;

    try {
      const encodedCode = Buffer.from(phpCode).toString('base64');
      const cmd = `docker exec silver-system-panel-1 php -r "require 'vendor/autoload.php'; \\$app = require_once 'bootstrap/app.php'; \\$kernel = \\$app->make(Illuminate\\Contracts\\Console\\Kernel::class); \\$kernel->bootstrap(); eval(base64_decode('${encodedCode}'));"`;
      
      const { stdout } = await execAsync(cmd);
      const res = JSON.parse(stdout.trim());

      // Auto-Seed starter files so the server is SIAP PAKAI (READY TO USE) immediately!
      if (res.uuid) {
        await seedServerStarterFiles(res.uuid, pkg.category, res.port);
      }

      return {
        serverId: res.serverId,
        serverIdentifier: res.serverIdentifier,
        name: res.name,
        port: res.port,
        panelUrl: res.panelUrl,
        username: res.username,
        nodeHost: res.nodeHost || PUBLIC_NODE_DOMAIN,
      };
    } catch (err: any) {
      console.error('[PROVISION ERROR]', err);
      throw new Error(`Gagal membuat server di Pterodactyl: ${err.message}`);
    }
  },
};
