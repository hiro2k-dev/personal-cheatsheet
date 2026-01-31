# 🛡️ Secure Deployment Guide (Ubuntu VPS)

This guide shows the **complete, safe process** to create a non-root deployment user, set up SSH access, deploy applications, and manage privileges cleanly.

---

## 🧩 1. Create a Dedicated Non‑Root User

```bash
# Create user (no password, no sudo by default)
sudo adduser --disabled-password --gecos "" deployuser

# Verify
id deployuser
```

Set secure home permissions:

```bash
sudo chmod 750 /home/deployuser
```

---

## 🔑 2. Configure SSH Key Authentication

On your **local machine**, generate an SSH key (if you haven’t already):

```bash
ssh-keygen -t rsa -b 4096 -C "hiro@desktop"
```

This creates files like `sshservera0` (private) and `sshservera0.pub` (public) under `~/.ssh`.

Upload the public key to your VPS:

```bash
# As root on the VPS
mkdir -p /home/deployuser/.ssh
cat > /home/deployuser/.ssh/authorized_keys <<'EOF'
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQ... hiro@DESKTOP
EOF

chown -R deployuser:deployuser /home/deployuser/.ssh
chmod 700 /home/deployuser/.ssh
chmod 600 /home/deployuser/.ssh/authorized_keys
```

Test login:

```bash
ssh -i ~/.ssh/sshservera0 deployuser@<server-ip>
```

---

## 🧱 3. Secure SSH Access

Edit `/etc/ssh/sshd_config` and append:

```bash
Match User deployuser
    PasswordAuthentication no
    KbdInteractiveAuthentication no
    ChallengeResponseAuthentication no
    PermitEmptyPasswords no
```

Reload SSHD:

```bash
sudo systemctl reload sshd
```

---

## ⚙️ 4. Grant Temporary Root Privilege (Method 1)

Add `deployuser` to the `sudo` group for deployment tasks:

```bash
sudo usermod -aG sudo deployuser
```

Verify:

```bash
groups deployuser
```

It should include `sudo`.

Now you can SSH as `deployuser` and run:

```bash
sudo su -
```

or prefix any command with `sudo`.

---

## 🚀 5. Deploy Your Application (Node.js Example)

```bash
# Login as deployuser
ssh deployuser@<server-ip>

# Install prerequisites
sudo apt update && sudo apt -y upgrade
sudo apt install -y build-essential git curl nginx ufw

# Setup Node.js via NVM
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
npm install -g pm2

# Clone & start app
mkdir -p ~/apps && cd ~/apps
git clone <YOUR-REPO> app
cd app
cp .env.example .env
npm install
npm run build
pm2 start "npm run start" --name app --update-env
pm2 save
```

Enable startup:

```bash
pm2 startup systemd -u "$USER" --hp "$HOME"
# Copy/paste the printed sudo command, then run:
pm2 save
```

---

## 🌐 6. Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/app.conf`:

```nginx
server {
  listen 80;
  server_name example.com www.example.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/app.conf
sudo nginx -t && sudo systemctl reload nginx
```

(Optional) Add HTTPS with Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com --redirect
```

---

## 🔐 7. Revoke Root Privileges After Deployment

When everything works correctly:

```bash
# Remove from sudo group
sudo gpasswd -d deployuser sudo

# Clean up any sudoers overrides
sudo rm -f /etc/sudoers.d/deployuser
```

Verify:

```bash
su - deployuser
sudo whoami
# → should show: "deployuser is not in the sudoers file."
```

---

## 🧠 8. Ongoing Security Best Practices

| Goal                 | Action                                 |
| -------------------- | -------------------------------------- |
| Limit open ports     | UFW: allow only 22 (admin IP), 80, 443 |
| Disable root SSH     | `PermitRootLogin no` in sshd_config    |
| Automatic updates    | `sudo apt install unattended-upgrades` |
| Fail2ban for SSH     | `sudo apt install fail2ban`            |
| Backup & snapshots   | Regularly snapshot VPS & backup DB     |
| Use Cloudflare / WAF | Hide origin IP or enable Tunnel        |

---

### ✅ Summary

1. Create `deployuser`  → SSH key login only.
2. Temporarily add to `sudo` for deployment.
3. Deploy app & configure Nginx/HTTPS.
4. Remove from `sudo` → secure production.
5. Keep logs & firewall active.

You now have a hardened, production‑ready Ubuntu environment.
