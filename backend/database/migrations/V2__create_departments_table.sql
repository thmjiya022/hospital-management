-- Create departments table
CREATE TABLE departments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Create index on name for faster lookups
CREATE INDEX idx_departments_name ON departments(name);

-- Insert default departments
INSERT INTO departments (id, name, description, is_active, created_at) VALUES 
    (NEWID(), 'General Practice', 'General medical consultations', 1, GETDATE()),
    (NEWID(), 'Emergency', 'Emergency and urgent care', 1, GETDATE()),
    (NEWID(), 'Cardiology', 'Heart and cardiovascular services', 1, GETDATE()),
    (NEWID(), 'Pediatrics', 'Child healthcare', 1, GETDATE()),
    (NEWID(), 'Radiology', 'X-rays and imaging services', 1, GETDATE()),
    (NEWID(), 'Pharmacy', 'Medication dispensing', 1, GETDATE());