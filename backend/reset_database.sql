-- Quick Database Reset Script for NextHR
-- This will drop and recreate the database with clean state

DROP DATABASE IF EXISTS nexthr_db;
CREATE DATABASE nexthr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- That's it! Now restart the backend and Flyway will run migrations automatically
