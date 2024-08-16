CREATE TABLE batch
(
    id UUID PRIMARY KEY,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    course_id UUID NOT NULL,
    status INT NOT NULL,
    created_by VARCHAR(255),
    modified_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (course_id) REFERENCES course(id)
);
