-- Create users table
CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20)
    role NVARCHAR(20) NOT NULL,
    department_id UNIQUEIDENTIFIER,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create index on role for filtering
CREATE INDEX idx_users_role ON users(role);

-- Insert default admin user (password: admin123 - you'll hash this later)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at)

-- This is fake admim email, but I will keep it like this for now.
VALUES (NEWID(), 'admin@hospital.com', '$2a$10$YourHashedPasswordHere', 'System', 'Admin', 'ADMIN', 1, GETDATE());