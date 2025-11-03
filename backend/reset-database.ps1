# Reset NextHR Database
# This script drops and recreates the nexthr_db database

Write-Host "=== NextHR Database Reset Script ===" -ForegroundColor Cyan
Write-Host ""

# Common MySQL installation paths
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 9.0\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.x\bin\mysql.exe"
)

# Find MySQL executable
$mysqlExe = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlExe = $path
        Write-Host "Found MySQL at: $path" -ForegroundColor Green
        break
    }
}

if ($null -eq $mysqlExe) {
    Write-Host "ERROR: MySQL executable not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please do ONE of the following:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1 - Use MySQL Workbench:" -ForegroundColor Cyan
    Write-Host "  1. Open MySQL Workbench"
    Write-Host "  2. Connect to your MySQL server"
    Write-Host "  3. Run these SQL commands:"
    Write-Host "     DROP DATABASE IF EXISTS nexthr_db;"
    Write-Host "     CREATE DATABASE nexthr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    Write-Host ""
    Write-Host "Option 2 - Use MySQL Command Line:" -ForegroundColor Cyan
    Write-Host "  1. Find mysql.exe in your MySQL installation folder"
    Write-Host "  2. Run: mysql -u root -p"
    Write-Host "  3. Enter password: 1234"
    Write-Host "  4. Run the same SQL commands as above"
    Write-Host ""
    Write-Host "Option 3 - Add MySQL to PATH:" -ForegroundColor Cyan
    Write-Host "  1. Find your MySQL bin folder (e.g., C:\Program Files\MySQL\MySQL Server 8.0\bin)"
    Write-Host "  2. Add it to System PATH environment variable"
    Write-Host "  3. Restart PowerShell and run this script again"
    Write-Host ""
    exit 1
}

# MySQL credentials
$username = "root"
$password = "1234"

Write-Host ""
Write-Host "Connecting to MySQL..." -ForegroundColor Yellow

# SQL commands
$sqlCommands = @"
DROP DATABASE IF EXISTS nexthr_db;
CREATE DATABASE nexthr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES LIKE 'nexthr_db';
"@

# Execute SQL commands
try {
    $sqlCommands | & $mysqlExe -u $username -p$password 2>&1 | ForEach-Object {
        if ($_ -match "nexthr_db") {
            Write-Host ""
            Write-Host "✓ Database 'nexthr_db' created successfully!" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "=== Database Reset Complete ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: ./mvnw spring-boot:run" -ForegroundColor White
    Write-Host "  2. Flyway will create all tables automatically" -ForegroundColor White
    Write-Host "  3. System admin will be seeded (admin@nexthr.com / Admin@123)" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to reset database" -ForegroundColor Red
    Write-Host "Error details: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please try manually using MySQL Workbench instead." -ForegroundColor Yellow
    exit 1
}
