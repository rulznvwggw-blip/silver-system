#!/bin/bash
set -e

echo "=================================================="
echo "    🚀 PTERODACTYL PANEL AUTO INSTALLER (ACAK)    "
echo "=================================================="

# Generate random strings
random_string() {
    openssl rand -hex 12 2>/dev/null || tr -dc A-Za-z0-9 </dev/urandom | head -c 16
}

DB_PASSWORD=$(random_string)
DB_ROOT_PASSWORD=$(random_string)
ADMIN_PASSWORD=$(random_string)
ADMIN_USERNAME="admin_$(openssl rand -hex 3 2>/dev/null || tr -dc a-z0-9 </dev/urandom | head -c 5)"
ADMIN_EMAIL="${ADMIN_USERNAME}@local.host"

echo "[1/5] Menyiapkan environment & kredensial acak..."

# Buat file .env
cat <<EOF > .env
MYSQL_DATABASE=pterodactyl
MYSQL_USER=pterodactyl
MYSQL_PASSWORD=${DB_PASSWORD}
MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
APP_URL=http://localhost:8080
APP_TIMEZONE=Asia/Jakarta
RECAPTCHA_ENABLED=false
EOF

# Buat folder data jika belum ada
mkdir -p data/database data/redis data/var data/nginx data/certs data/logs

echo "[2/5] Menjalankan Docker Compose..."
docker compose up -d

echo "[3/5] Menunggu database dan panel siap (sekitar 15 detik)..."
sleep 15

echo "[4/5] Menginisialisasi migrasi database & template egg..."
docker compose exec -T panel sh -c 'echo -e "[client]\nssl=0\n[mysql]\nssl=0" > /root/.my.cnf && echo -e "[client]\nssl=0\n[mysql]\nssl=0" > /etc/my.cnf.d/nossl.cnf 2>/dev/null || true'
docker compose exec -T panel php artisan migrate --seed --force || true

echo "[5/5] Membuat akun Admin otomatis..."
docker compose exec -T panel php artisan p:user:make \
  --email="${ADMIN_EMAIL}" \
  --username="${ADMIN_USERNAME}" \
  --name-first="Super" \
  --name-last="Admin" \
  --password="${ADMIN_PASSWORD}" \
  --admin=1 \
  --no-interaction

# Simpan kredensial ke file
cat <<EOF > credentials.txt
==================================================
        KREDENSIAL PTERODACTYL PANEL (ACAK)
==================================================
URL Panel       : http://localhost:8080
Email Admin     : ${ADMIN_EMAIL}
Username Admin  : ${ADMIN_USERNAME}
Password Admin  : ${ADMIN_PASSWORD}

--------------------------------------------------
Database Host   : database:3306
Database User   : pterodactyl
Database Pass   : ${DB_PASSWORD}
Database Root   : ${DB_ROOT_PASSWORD}
==================================================
EOF

echo ""
echo "=================================================="
echo "              ✅ INSTALASI SELESAI!               "
echo "=================================================="
cat credentials.txt
echo ""
echo "Informasi login di atas juga disimpan di file: credentials.txt"
