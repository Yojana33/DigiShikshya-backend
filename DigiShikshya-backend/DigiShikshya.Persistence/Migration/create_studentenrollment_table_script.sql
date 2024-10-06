CREATE TABLE studentenrollment
(
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL,
    batch_id UUID NOT NULL,
    semester_id UUID NOT NULL,
    enrolled_date DATE NOT NULL,
    created_by VARCHAR(255),
    modified_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (student_id) REFERENCES userprofile(user_id),
    FOREIGN KEY (batch_id) REFERENCES batch(id),
    FOREIGN KEY (semester_id) REFERENCES semester(id)
);
