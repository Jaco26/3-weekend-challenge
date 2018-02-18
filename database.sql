CREATE TABLE tasks
(
	id SERIAL PRIMARY KEY,
	task VARCHAR(120),
	category VARCHAR(40),
	notes VARCHAR(240),
	completed VARCHAR(5),
	due_date DATE,
	date_added DATE
);

CREATE TABLE completed_tasks
(
	id SERIAL PRIMARY KEY,
	task VARCHAR(120),
	category VARCHAR(40),
	notes VARCHAR(240),
	due_date DATE,
	date_completed DATE
);
