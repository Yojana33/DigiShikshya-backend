ALTER TABLE semester
ADD COLUMN course_id UUID;

ALTER TABLE semester
ADD CONSTRAINT fk_course
FOREIGN KEY (course_id) REFERENCES course(id);