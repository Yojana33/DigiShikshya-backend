CREATE TABLE semester
(
    id UUID PRIMARY KEY, 
    semester_name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    modified_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    course_id UUID, 
    CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES course(id)
);
