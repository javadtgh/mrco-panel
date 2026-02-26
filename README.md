# mrco-panel
install panel:

1.
```bash
git clone https://github.com/javadtgh/mrco-panel.git
```

2.
```bash
cd mrco-panel
```
3.
```bash
chmod +x install.sh && ./install.sh
```
4.Now your panel available in: http://Your-ip:5006

----------------------------------------------------------
Domain setup:

1.
```bash
sudo apt install nginx -y
```
2.
```bash
sudo nano /etc/nginx/sites-available/mrco-panel
```
3.
```bash
server {
    listen 2083 ssl http2;
    server_name Your.Domain.com;

    ssl_certificate /path/to/your/fullchain.pem;
    ssl_certificate_key /path/to/your/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:5006;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

4.
```bash
sudo ln -s /etc/nginx/sites-available/mrco-panel /etc/nginx/sites-enabled/
```
5.Now your panel available in: https://Your.Domain.com:2083

