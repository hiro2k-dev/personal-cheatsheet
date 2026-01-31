
# Docker

This guide explains how to properly install Docker Desktop on Windows using **WSL 2**, ensuring full compatibility with Ubuntu or other Linux distributions.

---

## 🧩 1. Prerequisites

Before installing Docker, ensure you have the following:

- **Windows 10 version 2004 (Build 19041)** or later, or **Windows 11**
- **WSL 2** enabled and configured (verify using `wsl -l -v` → version 2)
- At least **4 GB RAM** available
- Administrative privileges on your Windows machine

---

## ⚙️ 2. Enable Required Windows Features

Open **PowerShell as Administrator** and run:

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Then restart your computer.

---

## 🧠 3. Install WSL Kernel (if not already installed)

Download and install the WSL 2 kernel update package from Microsoft:
👉 [https://aka.ms/wsl2kernel](https://aka.ms/wsl2kernel)

After installation, set WSL 2 as your default:

```powershell
wsl --set-default-version 2
```

---

## 🐧 4. Install a Linux Distribution

If not already installed, you can install Ubuntu from the Microsoft Store:

```powershell
wsl --install -d Ubuntu-22.04
```

Then initialize your Linux environment:

```bash
wsl
sudo apt update && sudo apt upgrade -y
```

---

## 🐳 5. Install Docker Desktop

1. Download **Docker Desktop for Windows** from the official site:
   👉 [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Run the installer and make sure the option **“Use the WSL 2 based engine”** is checked.
3. Complete the installation and restart if prompted.

Once Docker starts, it will automatically integrate with your existing WSL 2 distributions.

---

## 🔗 6. Verify Installation

Run this command in PowerShell or WSL terminal:

```bash
docker --version
docker run hello-world
```

Expected output:

```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

---

## ⚡ 7. Optional Configurations

### Switch Docker backend (if needed)

If you need to switch between **Hyper-V** and **WSL 2**:

```powershell
wsl --set-default-version 2
```

Then, in Docker Desktop → **Settings → General**, ensure **Use WSL 2 based engine** is checked.

### Configure WSL integration

Go to Docker Desktop → **Settings → Resources → WSL Integration** → enable your desired Linux distribution.

### Enable auto-start on boot

Docker Desktop → **Settings → General** → enable **Start Docker Desktop when you log in**.

---

## 🧰 8. Common Troubleshooting

| Issue                           | Fix                                                       |
| ------------------------------- | --------------------------------------------------------- |
| `WSL 2 installation incomplete` | Reinstall kernel update (`https://aka.ms/wsl2kernel`)     |
| Docker fails to start           | Restart WSL (`wsl --shutdown`) and Docker Desktop         |
| `Error: 0x80370102`             | Enable virtualization in BIOS (Intel VT-x or AMD-V)       |
| Docker commands require `sudo`  | Add user to Docker group: `sudo usermod -aG docker $USER` |

---

## ✅ 9. Test Docker with Ubuntu in WSL2

Launch Ubuntu and run:

```bash
sudo service docker start
docker run -d -p 80:80 nginx
docker ps
```

You should see the running container listed.

---
## 🚀 10. Using `docker exec`

Use `docker exec` to run commands inside a running container.

Basic syntax:
```bash
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

Common examples:

- List running containers to get NAME or ID:
```bash
docker ps
```

- Start an interactive shell inside a running container:
```bash
docker exec -it <container-name-or-id> /bin/bash
# if bash is absent
docker exec -it <container-name-or-id> /bin/sh
```

- Run a one-off command (non-interactive):
```bash
docker exec <container-name-or-id> ls -la /usr/share/nginx/html
```

- Run a command detached (background) inside the container:
```bash
docker exec -d <container-name-or-id> touch /tmp/inside-docker
```

- Run as a specific user (e.g., UID 1000):
```bash
docker exec -u 1000 -it <container-name-or-id> id
```

Tips:
- The container must be running (`docker start <container>` or `docker run`) — `docker exec` cannot run commands in stopped containers.
- Use `-it` for interactive TTY sessions (shells).
- Combine with `docker ps -qf "ancestor=nginx"` to target containers by image:
```bash
docker exec -it $(docker ps -qf "ancestor=nginx") /bin/sh
```
- For troubleshooting, prefix commands with `docker logs <container>` to inspect output before exec.

This covers common `docker exec` use-cases for inspecting and interacting with containers.
## 🎯 Summary

You have successfully installed **Docker Desktop on Windows** using **WSL 2**, integrated it with Ubuntu, and verified it works correctly.

**Next Steps:**

- Try building your first Docker image.
- Use `docker-compose` for multi-container setups.
- Explore [Docker Hub](https://hub.docker.com) for pre-built images.

---

🧑‍💻 **Author:** Huy Pham
📅 **Last Updated:** November 2025
