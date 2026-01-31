# WSL 2(Window)

This guide explains how to install and configure **WSL 2 (Windows Subsystem for Linux)** on Windows 10 or Windows 11.

---

## 🧩 1. Check System Requirements
Run this in PowerShell or Command Prompt to verify your system architecture (WSL 2 requires a 64‑bit system):

```powershell
systeminfo | find "System Type"
```

Expected output:

```
System Type: x64-based PC
```
Ensure that your system meets the following requirements:

* Windows 10, version **2004 (Build 19041)** or higher, or **Windows 11**
* **Virtualization** enabled in BIOS (Intel VT-x / AMD-V)
* Administrative privileges on your machine

Check your Windows version:

```powershell
winver
```

---

## ⚙️ 2. Enable WSL and Virtual Machine Platform

Open **PowerShell as Administrator** and run:

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Restart your computer after these commands complete.

---

## 🧠 3. Install the WSL 2 Kernel

Download the **Linux kernel update package** for WSL 2 from Microsoft:

👉 [https://aka.ms/wsl2kernel](https://aka.ms/wsl2kernel)

Run the `.msi` file to install the update.

---

## 🐚 4. Set WSL 2 as the Default Version

After installing the kernel, set WSL 2 as your default for new distributions:

```powershell
wsl --set-default-version 2
```

To verify:

```powershell
wsl --status
```

Expected output:

```
Default Version: 2
Kernel version: 5.x.x
```

---

## 🐧 5. Install a Linux Distribution

You can install your preferred Linux distribution from the Microsoft Store.

Example for Ubuntu:

```powershell
wsl --install -d Ubuntu-22.04
```

After installation, launch Ubuntu from the Start menu and set up your username and password.

Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 🔍 6. Check Installed WSL Versions

List all installed distributions and their versions:

```powershell
wsl -l -v
```

Example output:

```
  NAME            STATE           VERSION
* Ubuntu-22.04    Running         2
```

If a distribution is still using WSL 1, you can upgrade it:

```powershell
wsl --set-version Ubuntu-22.04 2
```

---

## ⚡ 7. Useful Commands

| Command                        | Description                                       |
| ------------------------------ | ------------------------------------------------- |
| `wsl --help`                   | Show all available options                        |
| `wsl --list --verbose`         | List all installed distros and their WSL versions |
| `wsl --set-default-version 2`  | Set WSL 2 as the default version                  |
| `wsl --set-version <Distro> 2` | Convert a specific distro to WSL 2                |
| `wsl --terminate <Distro>`     | Stop a specific distro                            |
| `wsl --shutdown`               | Stop all running WSL instances                    |

---

## 🧰 8. Common Troubleshooting

| Issue               | Solution                                                    |
| ------------------- | ----------------------------------------------------------- |
| `Error: 0x8007019e` | WSL is not enabled → enable WSL via PowerShell (Step 2)     |
| `Error: 0x80370102` | Virtualization not enabled → enable in BIOS                 |
| WSL not starting    | Restart LxssManager service or use `wsl --shutdown`         |
| Slow performance    | Check antivirus exclusion or disk usage in Windows settings |

---

## ✅ 9. Verify Everything Works

Run:

```powershell
wsl
uname -a
```

Expected output:

```
Linux <hostname> 5.x.x-microsoft-standard-WSL2 #1 SMP ... x86_64 GNU/Linux
```

Congratulations! 🎉 You now have **WSL 2** fully installed and ready to use.

---

## 🧑‍💻 Next Steps

* Install Docker Desktop (uses WSL 2 backend)
* Configure VS Code Remote – WSL extension
* Try running Python, Node.js, or other Linux-based tools directly from WSL

---

📅 **Last Updated:** November 2025
🧑‍💻 **Author:** Huy Pham
