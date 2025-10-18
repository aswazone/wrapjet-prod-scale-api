# Start Development Environment Script (PowerShell)
# This script starts the development environment with Neon Local

Write-Host "🚀 Starting Wrapjet Development Environment..." -ForegroundColor Green
Write-Host ""

# Check if Docker is running
try {
    docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: Docker is not installed or not running." -ForegroundColor Red
    exit 1
}

# Check if .env.development exists
if (-Not (Test-Path ".env.development")) {
    Write-Host "⚠️  Warning: .env.development not found. Using default configuration." -ForegroundColor Yellow
}

# Stop any existing containers
Write-Host "🛑 Stopping any existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down 2>&1 | Out-Null

# Start services
Write-Host "🐳 Starting Docker containers..." -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if services are running
$runningContainers = docker-compose -f docker-compose.dev.yml ps
if ($runningContainers -match "Up") {
    Write-Host ""
    Write-Host "✅ Development environment is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Services:" -ForegroundColor Cyan
    Write-Host "   - Application: http://localhost:3000"
    Write-Host "   - PostgreSQL: localhost:5432"
    Write-Host "   - Database: wrapjet_dev"
    Write-Host ""
    Write-Host "📝 Run migrations:" -ForegroundColor Cyan
    Write-Host "   docker-compose -f docker-compose.dev.yml exec app npm run db:migrate"
    Write-Host ""
    Write-Host "📊 View logs:" -ForegroundColor Cyan
    Write-Host "   docker-compose -f docker-compose.dev.yml logs -f app"
    Write-Host ""
    Write-Host "🛑 Stop services:" -ForegroundColor Cyan
    Write-Host "   docker-compose -f docker-compose.dev.yml down"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Failed to start services. Check logs with:" -ForegroundColor Red
    Write-Host "   docker-compose -f docker-compose.dev.yml logs"
    exit 1
}
