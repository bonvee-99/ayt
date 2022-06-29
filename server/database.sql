CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TABLE page (
  page_id UUID DEFAULT uuid_generate_v4(),
  page_start_time TIMESTAMP DEFAULT localtimestamp,
  PRIMARY KEY (page_id)
);

CREATE TABLE calendar (
  calendar_id SERIAL,
  page_id UUID NOT NULL REFERENCES page ON DELETE CASCADE,
  owner VARCHAR(50) NOT NULL,
  summary VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  start_time SMALLINT NOT NULL,
  end_time SMALLINT NOT NULL,
  day VARCHAR(2) NOT NULL,
  PRIMARY KEY (calendar_id),
  FOREIGN KEY (page_id) REFERENCES page(page_id)
);
