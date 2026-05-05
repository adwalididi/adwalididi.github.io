Write-Host "Starting ngrok for Next.js on 127.0.0.1:3000..." -ForegroundColor Green
ngrok http 127.0.0.1:3000 --host-header=rewrite
