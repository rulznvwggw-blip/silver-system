#!/bin/bash
set -e

echo "=== Memulai Pterodactyl Panel dengan Docker Compose ==="

# Buat folder data jika belum ada
mkdir -p data/database data/redis data/var data/nginx data/certs data/logs

# Jalankan kontainer
docker compose up -d

echo ""
echo "Menunggu database siap..."
sleep 10

echo ""
echo "=== Membuat Akun Administrator Pterodactyl ==="
docker compose run --rm panel php artisan p:user:make

echo ""
echo "=== Selesai! ==="
echo "Pterodactyl Panel berjalan di: http://localhost:8080"
