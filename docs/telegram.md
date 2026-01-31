## SELF HOST API
```
sudo apt update
sudo apt install -y make cmake g++ flex bison gperf php-cli libssl-dev zlib1g-dev
```

```
git clone --recursive https://github.com/tdlib/telegram-bot-api.git
cd telegram-bot-api

mkdir build
cd build

cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX:PATH=/usr/local ..

cmake --build . --target install -j $(nproc)
```

```
mkdir -p /var/lib/telegram-bot-api
sudo chown $USER:$USER /var/lib/telegram-bot-api
```

```
sudo nano /etc/systemd/system/tg-bot-api.service
```
Paste this
```
[Unit]
Description=Telegram Bot API Server
After=network.target

[Service]
Type=simple
User=USER_CỦA_BẠN
ExecStart=/usr/local/bin/telegram-bot-api --local --api-id=24746709 --api-hash=1657f445b917a100154a00c52ba49a4d --http-port=8082 --dir=/var/lib/telegram-bot-api
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

```
sudo systemctl daemon-reload
sudo systemctl enable tg-bot-api
sudo systemctl start tg-bot-api
sudo systemctl status tg-bot-api
```
Check status
```
curl http://localhost:8082/bot<token>/getMe
```