ALTER TABLE assignment
ADD COLUMN teacher_id UUID;

ALTER TABLE assignment
ADD CONSTRAINT fk_teacher
    FOREIGN KEY (teacher_id)
    REFERENCES userprofile(user_id);
