# Redis

This guide explains how to install, configure, and run **Redis** both on a **VPS (Linux server)** and on a **local laptop (Windows/macOS/Linux)** for development or production use.

---

## 🧩 1. What is Redis?

**Redis** is an in-memory data store used as a **database, cache, or message broker**. It’s extremely fast and lightweight — ideal for caching, sessions, queues, and real-time data processing.

---

## ⚙️ 2. Installation on VPS (Ubuntu/Debian)

### Step 1: Update system packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Redis

```bash
sudo apt install redis-server -y
```

### Step 3: Enable and start Redis service

```bash
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### Step 4: Verify Redis is running

```bash
sudo systemctl status redis-server
```

Expected output:

```
Active: active (running)
```

### Step 5: Test connection

```bash
redis-cli ping
```

Expected output:

```
PONG
```

---

## 🔐 3. Secure Redis (for VPS)

By default, Redis listens on `127.0.0.1` (localhost). To allow remote connections securely:

### Edit Redis config:

```bash
sudo nano /etc/redis/redis.conf
```

Find and modify:

```
bind 127.0.0.1 ::1
```

Change to:

```
bind 0.0.0.0
```

Then set a password:

```
requirepass your_strong_password
```

Restart Redis:

```bash
sudo systemctl restart redis-server
```

### Allow Redis port via UFW:

```bash
sudo ufw allow 6379/tcp
```

> ⚠️ **Warning:** Never expose Redis to the public internet without a password or firewall rules.

---

## 🧱 4. Installation on Local Laptop

### 🪟 Windows (via WSL2 or Docker)

#### Option 1: Install via WSL (Ubuntu)

```bash
sudo apt update && sudo apt install redis-server -y
sudo service redis-server start
redis-cli ping
```

#### Option 2: Install via Docker

```bash
docker run --name redis -p 6379:6379 -d redis
```

Check:

```bash
docker exec -it redis redis-cli ping
```

Output:

```
PONG
```

#### Option 3: Native Windows Build (less recommended)

You can download Redis for Windows from:
👉 [https://github.com/microsoftarchive/redis/releases](https://github.com/microsoftarchive/redis/releases)

Run with:

```cmd
redis-server.exe redis.windows.conf
```

---

### 🍎 macOS

#### Using Homebrew

```bash
brew install redis
brew services start redis
redis-cli ping
```

#### Manual start

```bash
redis-server /usr/local/etc/redis.conf
```

---

## ⚡ 5. Redis Configuration Basics

Main configuration file:

```
/etc/redis/redis.conf
```

Common parameters:

| Parameter          | Description                         |
| ------------------ | ----------------------------------- |
| `bind`             | IP address Redis listens to         |
| `port`             | Default is 6379                     |
| `requirepass`      | Authentication password             |
| `maxmemory`        | Limit memory usage                  |
| `maxmemory-policy` | Eviction policy (e.g., allkeys-lru) |

Reload configuration after changes:

```bash
sudo systemctl restart redis-server
```

---

## 🧠 6. Connecting from Applications

Example (Node.js):

```javascript
import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  password: "your_strong_password",
});

await redis.set("key", "Hello Redis");
const value = await redis.get("key");
console.log(value);
```

Example (Python):

```python
import redis

r = redis.Redis(host='localhost', port=6379, password='your_strong_password')
print(r.ping())
```

---

## 🧩 7. Persistence & Data Safety

Redis uses two persistence methods:

- **RDB (Snapshotting)** – saves data periodically to disk (`dump.rdb`).
- **AOF (Append Only File)** – logs every write operation (`appendonly.aof`).

Check config:

```bash
sudo nano /etc/redis/redis.conf
```

Make sure:

```
save 900 1
save 300 10
save 60 10000
appendonly yes
```

Restart Redis after changes:

```bash
sudo systemctl restart redis-server
```

---

## 🧰 8. Common Troubleshooting

| Issue                        | Fix                                                              |
| ---------------------------- | ---------------------------------------------------------------- |
| `Could not connect to Redis` | Ensure service is running (`sudo systemctl status redis-server`) |
| Port 6379 blocked            | Allow via firewall or use SSH tunnel                             |
| Data lost after restart      | Enable AOF persistence                                           |
| Redis won’t start            | Check `/var/log/redis/redis-server.log`                          |

---

## 🔍 9. Useful Commands

```bash
redis-cli info
redis-cli keys '*'
redis-cli flushall
redis-cli monitor
```

Stop Redis:

```bash
sudo systemctl stop redis-server
```

Restart Redis:

```bash
sudo systemctl restart redis-server
```

---

## 🎯 10. Summary

| Environment             | Recommended Install        | Notes                      |
| ----------------------- | -------------------------- | -------------------------- |
| **VPS (Production)**    | `apt install redis-server` | Secure with password + UFW |
| **Local (Development)** | Docker or WSL2             | Easier to reset & test     |

Redis is lightweight, fast, and perfect for caching, session management, and message brokering.

---

📅 **Last Updated:** November 2025
🧑‍💻 **Author:** Huy Pham
