CREATE TABLE tasks (
	id SERIAL PRIMARY KEY,
	task VARCHAR(120),
	category VARCHAR(40),
	completed VARCHAR(2),
	due_date DATE,
	date_added DATE
);
