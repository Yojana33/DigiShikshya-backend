CREATE TABLE userprofile
(
    user_id UUID PRIMARY KEY,
    profile_picture BYTEA,
    has_logged_in BOOLEAN DEFAULT FALSE
);