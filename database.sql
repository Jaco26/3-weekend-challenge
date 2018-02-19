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
	task_id INT,
	category_id INT,
	notes VARCHAR(240),
	due_date DATE,
	date_completed DATE
);


CREATE TABLE categories
(
	id SERIAL PRIMARY KEY,
	description VARCHAR,
);

INSERT INTO categories
	(description)
VALUES
	('school'),
	('house');


-- create a "school_tasks" table
CREATE TABLE school
(
	id SERIAL PRIMARY KEY,
	task VARCHAR(120),
	notes VARCHAR(240),
	completed VARCHAR(5),
	due_date DATE,
	date_added DATE
);

-- create a "house_tasks" table
CREATE TABLE house
(
	id SERIAL PRIMARY KEY,
	task VARCHAR(120),
	notes VARCHAR(240),
	completed VARCHAR(5),
	due_date DATE,
	date_added DATE
);

