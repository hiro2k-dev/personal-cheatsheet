# Nginx Deploy

---

## Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

---

## Create Nginx config file

```bash
sudo nano /etc/nginx/sites-available/name.conf
```

Choose **one of the three templates** below and paste it into the file.

---

## BE API (reverse proxy → localhost:8031)

**Suggested file:** `/etc/nginx/sites-available/easycopy-api.conf`

```nginx
server {
    listen 80;
    server_name easycopy-api.hirodev.space;

    client_max_body_size 2000M;

    location / {
        proxy_pass http://127.0.0.1:8031;

        proxy_http_version 1.1;

        # WebSocket support (if needed)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Forward headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto http;

        # Optional timeouts
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
```

---

## FE (static site + SPA fallback) → `/var/www/easycopy-frontend`

**Suggested file:** `/etc/nginx/sites-available/easycopy.conf`

```nginx
server {
    listen 80;
    server_name easycopy.hirodev.space;

    root /var/www/easycopy-frontend;
    index index.html;

    client_max_body_size 50M;

    # Cache static assets
    location ~* \.(?:css|js|mjs|map|png|jpg|jpeg|gif|svg|ico|webp|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files $uri =404;
    }

    # SPA fallback (React / Vue / Vite)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> If your frontend is **not an SPA**, replace the fallback with:
> `try_files $uri =404;`

---

## Docker service (Immich) reverse proxy → `127.0.0.1:2283`

**Suggested file:** `/etc/nginx/sites-available/immich.conf`

```nginx
server {
    listen 80;
    server_name photo.hirodev.space;

    client_max_body_size 2000M;

    location / {
        proxy_pass http://127.0.0.1:2283;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Forward headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto http;

        # Long timeouts (uploads / downloads)
        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
    }
}
```

---

## Enable site and reload Nginx

### Enable all three sites (example)

```bash
sudo ln -sf /etc/nginx/sites-available/easycopy-api.conf /etc/nginx/sites-enabled/easycopy-api.conf
sudo ln -sf /etc/nginx/sites-available/easycopy.conf     /etc/nginx/sites-enabled/easycopy.conf
sudo ln -sf /etc/nginx/sites-available/immich.conf       /etc/nginx/sites-enabled/immich.conf

# Recommended: disable default site to avoid conflicts
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl reload nginx
```

### Enable and reload a single site (generic)

```bash
sudo ln -sf /etc/nginx/sites-available/name.conf /etc/nginx/sites-enabled/name.conf
sudo nginx -t
sudo systemctl reload nginx
```

---

## Quick testing

### Test from the VPS (force correct server block via Host header)

```bash
curl -I http://127.0.0.1 -H "Host: easycopy.hirodev.space"
curl -I http://127.0.0.1 -H "Host: easycopy-api.hirodev.space"
curl -I http://127.0.0.1 -H "Host: photo.hirodev.space"
```

### Test upstream services directly

```bash
curl -I http://127.0.0.1:8031
curl -I http://127.0.0.1:2283
```

---

## Deploy FE (build → `/var/www/easycopy-frontend`)

> Frontend is built into `dist/`. Nginx root points to `/var/www/easycopy-frontend`.

### Manual deploy (no script)

```bash
sudo mkdir -p /var/www/easycopy-frontend
sudo rm -rf /var/www/easycopy-frontend/*
sudo cp -r dist/* /var/www/easycopy-frontend/
sudo systemctl reload nginx
```

---

### Script-based deploy (simple)

```bash
#!/bin/bash
set -e

REPO_DIR=""
DEPLOY_DIR="/var/www/<<NAME>>"
BRANCH="master"

echo "Deploying nocrop frontend..."

# 1) Update source
cd "$REPO_DIR" || { echo "ERROR: Cannot cd to $REPO_DIR"; exit 1; }
git fetch --all
git checkout "$BRANCH"
git pull origin "$BRANCH"

# 2) Install deps + build
yarn install --frozen-lockfile || yarn install
yarn build

# 3) Deploy dist -> web root
sudo mkdir -p "$DEPLOY_DIR"
sudo rm -rf "$DEPLOY_DIR"/*
sudo cp -r dist/* "$DEPLOY_DIR/"

# 4) Reload nginx
sudo nginx -t
sudo systemctl reload nginx

echo "Done."
```

---

## Add HTTPS (Certbot) — optional

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d easycopy.hirodev.space
```