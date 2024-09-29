CREATE TABLE subject
(
    id UUID PRIMARY KEY,
    semester_id UUID NOT NULL,
    batch_id UUID NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    subject_code VARCHAR(255) NOT NULL,
    subject_description TEXT,
    credit_hour INT NOT NULL,
    created_by VARCHAR(255),
    modified_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (semester_id) REFERENCES semester(id),
    FOREIGN KEY (batch_id) REFERENCES batch(id)
);