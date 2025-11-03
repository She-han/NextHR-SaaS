# Simple Database Reset Script
Write-Host "=== NextHR Database Reset ===" -ForegroundColor Cyan

# Try to find MySQL
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe"
)

$mysql = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysql = $path
        break
    }
}

if ($mysql) {
    Write-Host "Found MySQL: $mysql" -ForegroundColor Green
    Write-Host "Resetting database..." -ForegroundColor Yellow
    
    $sql = "DROP DATABASE IF EXISTS nexthr_db; CREATE DATABASE nexthr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo $sql | & $mysql -u root -p1234
    
    Write-Host "Database reset complete!" -ForegroundColor Green
} else {
    Write-Host "MySQL not found automatically." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please open MySQL Workbench and run:" -ForegroundColor Cyan
    Write-Host "  DROP DATABASE IF EXISTS nexthr_db;" -ForegroundColor White
    Write-Host "  CREATE DATABASE nexthr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor White
}

Write-Host ""
Write-Host "Next: Run './mvnw spring-boot:run'" -ForegroundColor Cyan
