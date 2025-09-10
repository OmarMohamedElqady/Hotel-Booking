CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phon_number VARCHAR(20) NOT NULL,
    role VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at DATE DEFAULT (CURRENT_DATE)
);
