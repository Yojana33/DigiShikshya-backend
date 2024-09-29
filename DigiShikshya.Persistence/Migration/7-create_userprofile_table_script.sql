CREATE TABLE userprofile
(
    user_id UUID PRIMARY KEY,
    profile_picture BYTEA,
    created_by VARCHAR(255),
    modified_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
