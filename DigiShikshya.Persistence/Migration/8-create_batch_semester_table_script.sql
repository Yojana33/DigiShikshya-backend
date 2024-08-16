CREATE TABLE course_semester
(
    id UUID PRIMARY KEY,
    batch_id UUID NOT NULL,
    semester_id UUID NOT NULL,
    created_by VARCHAR(255),
    modified_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (batch_id) REFERENCES batch(id),
    FOREIGN KEY (semester_id) REFERENCES semester(id)
);