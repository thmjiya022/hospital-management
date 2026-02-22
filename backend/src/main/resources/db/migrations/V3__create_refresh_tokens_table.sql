-- Create refresh tokens table
CREATE TABLE refresh_tokens (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    token_hash NVARCHAR(255) NOT NULL UNIQUE,
    device_info NVARCHAR(500),
    ip_address NVARCHAR(50),
    expires_at DATETIME2 NOT NULL,
    revoked BIT NOT NULL DEFAULT 0,
    revoked_at DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create index on user_id for session lookups
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- Create index on token_hash for validation lookups
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- Create index on expires_at for cleanup job queries
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);