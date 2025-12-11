# Prisma Setup Script for Windows PowerShell

Write-Host "Setting up Prisma Database..." -ForegroundColor Green

# Step 1: Generate Prisma Client
Write-Host "`n[Step 1/2] Generating Prisma Client..." -ForegroundColor Yellow
& "D:\Mohaned\node-v22.16.0-win-x64\npx.cmd" prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma client generated successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

# Step 2: Run Database Migrations
Write-Host "`n[Step 2/2] Running database migrations..." -ForegroundColor Yellow
& "D:\Mohaned\node-v22.16.0-win-x64\npx.cmd" prisma migrate dev --name init

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to run migrations" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ Setup complete! Restart your dev server with 'npm run dev'" -ForegroundColor Green
