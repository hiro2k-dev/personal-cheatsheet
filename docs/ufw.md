# UFW

This guide explains how to install, configure, and manage **UFW** — a simple yet powerful firewall tool for Ubuntu and other Linux distributions.

---

## 🧩 1. What Is UFW?

**UFW** stands for **Uncomplicated Firewall**, a frontend for `iptables` designed to simplify the process of managing firewall rules in Linux.

It allows you to easily control network traffic by allowing or denying specific ports, services, or IP addresses.

---

## ⚙️ 2. Installation

Most modern Ubuntu systems come with UFW preinstalled. To make sure it's installed, run:

```bash
sudo apt update
sudo apt install ufw -y
```

Check its status:

```bash
sudo ufw status
```

Expected output:

```
Status: inactive
```

---

## 🚀 3. Basic Commands

| Command                   | Description                             |
| ------------------------- | --------------------------------------- |
| `sudo ufw enable`         | Activate the firewall                   |
| `sudo ufw disable`        | Deactivate the firewall                 |
| `sudo ufw status verbose` | Show detailed firewall status           |
| `sudo ufw reload`         | Reload rules without disabling firewall |
| `sudo ufw reset`          | Reset all rules to default              |

---

## 🧱 4. Allow or Deny Traffic

### Allow a specific port

```bash
sudo ufw allow 22       # Allow SSH
sudo ufw allow 80       # Allow HTTP
sudo ufw allow 443      # Allow HTTPS
```

### Allow a port with a specific protocol

```bash
sudo ufw allow 53/udp   # Allow DNS (UDP)
```

### Deny a port

```bash
sudo ufw deny 21        # Deny FTP
```

### Delete a rule

```bash
sudo ufw delete allow 22
```

---

## 🌐 5. Allow or Deny by IP or Subnet

### Allow specific IP

```bash
sudo ufw allow from 192.168.1.10
```

### Allow an IP to access a specific port

```bash
sudo ufw allow from 192.168.1.10 to any port 22
```

### Deny specific IP

```bash
sudo ufw deny from 203.0.113.0
```

---

## 🧩 6. Application Profiles

UFW can recognize applications with predefined rules. List them using:

```bash
sudo ufw app list
```

Example output:

```
Available applications:
  OpenSSH
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
```

Enable one by name:

```bash
sudo ufw allow 'Nginx Full'
```

---

## ⚡ 7. Default Policies

By default, UFW blocks all incoming connections and allows outgoing traffic.

To verify:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

You can adjust them if needed.

---

## 🧠 8. Example Configurations

### Typical Web Server

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Database Server (internal only)

```bash
sudo ufw allow from 192.168.0.0/24 to any port 3306
```

### MQTT Broker (IoT setup)

```bash
sudo ufw allow 1883/tcp
sudo ufw allow 8883/tcp
```

---

## 🔍 9. Checking and Logging

View numbered rules:

```bash
sudo ufw status numbered
```

Enable logging:

```bash
sudo ufw logging on
```

Logs are stored in:

```
/var/log/ufw.log
```

---

## 🧰 10. Troubleshooting

| Problem                     | Solution                                              |
| --------------------------- | ----------------------------------------------------- |
| SSH locked out              | Add `sudo ufw allow ssh` **before enabling** firewall |
| Firewall rules not applying | Run `sudo ufw reload` after editing rules             |
| UFW inactive on startup     | Enable service: `sudo systemctl enable ufw`           |
| Port still blocked          | Check other firewalls (cloud provider, router, etc.)  |

---

## ✅ 11. Disable or Reset UFW

Temporarily disable:

```bash
sudo ufw disable
```

Reset all rules:

```bash
sudo ufw reset
```

---

## 🧩 12. Verify UFW on Boot

Ensure UFW starts automatically:

```bash
sudo systemctl enable ufw
sudo systemctl start ufw
```

Check status:

```bash
sudo systemctl status ufw
```

---

## 🎯 Summary

- **Enable UFW:** `sudo ufw enable`
- **Allow SSH:** `sudo ufw allow ssh`
- **Check status:** `sudo ufw status verbose`
- **Reload rules:** `sudo ufw reload`

UFW gives you an easy and reliable way to secure your Linux system against unwanted network access.

---

📅 **Last Updated:** November 2025
🧑‍💻 **Author:** Huy Pham
