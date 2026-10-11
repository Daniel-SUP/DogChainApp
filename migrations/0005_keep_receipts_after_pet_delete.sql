CREATE TABLE orders_rebuilt (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pet_id INTEGER,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE SET NULL
);

INSERT INTO orders_rebuilt (id, pet_id, description, status, created_at, user_id)
SELECT id, pet_id, description, status, created_at, user_id FROM orders;

DROP TABLE orders;
ALTER TABLE orders_rebuilt RENAME TO orders;

CREATE INDEX idx_orders_pet_id ON orders(pet_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
