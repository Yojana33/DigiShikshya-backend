CREATE TABLE teacherassign
(
    id UUID PRIMARY KEY,
    teacher_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    created_by VARCHAR(255),
    modified_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (subject_id) REFERENCES subject(id),
    FOREIGN KEY (teacher_id) REFERENCES userprofile(user_id)
);
