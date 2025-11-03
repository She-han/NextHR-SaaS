-- ================================================================
-- Seed Data: System Administrator
-- Default Credentials: admin@nexthr.com / Admin@123
-- Password is BCrypt hashed
-- ================================================================

-- Insert Default System Administrator
-- Password: Admin@123 (BCrypt hash with strength 10)
INSERT INTO system_user (email, password_hash, full_name, role, is_active) 
VALUES (
    'admin@nexthr.com',
    '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr6ELS0rqiuI4qYe72',
    'System Administrator',
    'ROLE_SYS_ADMIN',
    TRUE
);

-- Insert Sample Default Leave Types (Will be copied to new organizations)
-- These serve as templates for default leave type configuration
