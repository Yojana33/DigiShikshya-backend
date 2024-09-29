CREATE TABLE submission
(
    id UUID PRIMARY KEY,
    assignment_id UUID NOT NULL,
    student_id UUID NOT NULL,
    submitted_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_file BYTEA,
    status BOOLEAN NOT NULL DEFAULT FALSE,
    
    FOREIGN KEY (assignment_id) REFERENCES assignment(id),
    FOREIGN KEY (student_id) REFERENCES userprofile(user_id)
);
