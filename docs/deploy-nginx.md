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


## autodeploy script:
```
#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=== HiroDev Ultimate Nginx Automation Tool v3 ===${NC}"

# 1. Environment Check & Dependency Installation
check_pkg() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${YELLOW}Installing $1...${NC}"
        sudo apt update && sudo apt install -y $1
    fi
}

check_pkg nginx
check_pkg git
check_pkg certbot

# Check for Node.js (required for build)
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Check for Yarn
if ! command -v yarn &> /dev/null; then
    echo -e "${YELLOW}Yarn not found. Installing...${NC}"
    sudo npm install --global yarn
fi

# 2. Gather Configuration Info
read -p "Enter Domain (e.g., api.hirodev.space): " DOMAIN
read -p "Project Type (1: Frontend Static, 2: Backend/Service Port): " PROJ_TYPE
read -p "GitHub Repository URL (HTTPS): " GIT_URL
read -p "Branch Name (default: main): " BRANCH
BRANCH=${BRANCH:-main}
read -p "Is Cloudflare Proxy (Orange Cloud) enabled? (y/n): " CF_PROXY

# Define paths
SOURCE_DIR="/home/$USER/projects/$DOMAIN"
CONF_FILE="/etc/nginx/sites-available/$DOMAIN.conf"

# 3. Git Operations
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${BLUE}Cloning repository...${NC}"
    mkdir -p "/home/$USER/projects"
    git clone -b "$BRANCH" "$GIT_URL" "$SOURCE_DIR"
else
    echo -e "${YELLOW}Project directory already exists. Pulling latest...${NC}"
    cd "$SOURCE_DIR" && git pull origin "$BRANCH"
fi

# 4. Generate Nginx Config & Run Initial Build
if [[ $PROJ_TYPE == "1" ]]; then
    # --- FRONTEND LOGIC ---
    read -p "Enter build output folder (e.g., dist or build): " BUILD_FOLDER
    WEB_ROOT="/var/www/$DOMAIN"
    sudo mkdir -p "$WEB_ROOT"
    sudo chown -R $USER:$USER "$WEB_ROOT" # Ensure we can copy files here

    # Run Initial Build NOW
    echo -e "${BLUE}Running initial build...${NC}"
    cd "$SOURCE_DIR"
    if [ -f "yarn.lock" ]; then
        yarn install && yarn build
    else
        npm install && npm run build
    fi

    # Copy files to Web Root
    sudo rm -rf "$WEB_ROOT"/*
    sudo cp -r "$SOURCE_DIR/$BUILD_FOLDER"/* "$WEB_ROOT/"
    sudo chown -R www-data:www-data "$WEB_ROOT" # Give Nginx permission

    # Nginx Config
    sudo tee $CONF_FILE > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    root $WEB_ROOT;
    index index.html;
    location / { try_files \$uri \$uri/ /index.html; }
}
EOF

    # Save Redeploy Script
    REDEPLOY_SCRIPT="$SOURCE_DIR/redeploy.sh"
    cat <<EOF > "$REDEPLOY_SCRIPT"
#!/bin/bash
cd "$SOURCE_DIR"
git pull origin "$BRANCH"
[ -f "yarn.lock" ] && (yarn install && yarn build) || (npm install && npm run build)
sudo rm -rf $WEB_ROOT/*
sudo cp -r $BUILD_FOLDER/* $WEB_ROOT/
sudo chown -R www-data:www-data $WEB_ROOT
sudo systemctl reload nginx
EOF

else
    # --- BACKEND LOGIC ---
    read -p "Enter Local Port (e.g., 8031): " PORT
    sudo tee $CONF_FILE > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF
    REDEPLOY_SCRIPT="$SOURCE_DIR/redeploy.sh"
    echo -e "cd $SOURCE_DIR && git pull origin $BRANCH" > "$REDEPLOY_SCRIPT"
fi

chmod +x "$REDEPLOY_SCRIPT"

# 5. Nginx Activation
sudo ln -sf "$CONF_FILE" "/etc/nginx/sites-enabled/"
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}✔ Deployment and Initial Build Finished!${NC}"
```