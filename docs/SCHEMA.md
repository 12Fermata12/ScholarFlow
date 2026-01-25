# ScholarFlow Database Schema

This document outlines the database schema design for ScholarFlow, supporting both PostgreSQL (relational) and MongoDB (document-based) implementations.

---

## PostgreSQL Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    language VARCHAR(10) DEFAULT 'tr',
    theme VARCHAR(20) DEFAULT 'dark',
    api_key TEXT
);

CREATE INDEX idx_users_email ON users(email);
```

### Citations Table
```sql
CREATE TABLE citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    citation_type VARCHAR(50) NOT NULL, -- 'book', 'article', 'website'
    author VARCHAR(255),
    initial VARCHAR(10),
    year INTEGER,
    title TEXT NOT NULL,
    publisher VARCHAR(255),
    journal VARCHAR(255),
    site_name VARCHAR(255),
    citation_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_citations_user_id ON citations(user_id);
CREATE INDEX idx_citations_created_at ON citations(created_at DESC);
```

### Reading List Table
```sql
CREATE TABLE reading_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author VARCHAR(255),
    year INTEGER,
    status VARCHAR(20) DEFAULT 'todo', -- 'todo', 'reading', 'done'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reading_list_user_id ON reading_list(user_id);
CREATE INDEX idx_reading_list_status ON reading_list(status);
```

### Planner Items Table
```sql
CREATE TABLE planner_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20), -- 'low', 'medium', 'high'
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_planner_items_user_id ON planner_items(user_id);
CREATE INDEX idx_planner_items_completed ON planner_items(completed);
CREATE INDEX idx_planner_items_due_date ON planner_items(due_date);
```

### Research Notes Table
```sql
CREATE TABLE research_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500),
    content TEXT NOT NULL,
    tags TEXT[], -- PostgreSQL array type
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_research_notes_user_id ON research_notes(user_id);
CREATE INDEX idx_research_notes_created_at ON research_notes(created_at DESC);
CREATE INDEX idx_research_notes_tags ON research_notes USING GIN(tags);
```

### Pomodoro Stats Table
```sql
CREATE TABLE pomodoro_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

CREATE INDEX idx_pomodoro_stats_user_id ON pomodoro_stats(user_id);
CREATE INDEX idx_pomodoro_stats_date ON pomodoro_stats(date DESC);
```

---

## MongoDB Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,  // unique indexed
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  language: String,  // default: 'tr'
  theme: String,     // default: 'dark'
  apiKey: String
}

// Indexes
db.users.createIndex({ "email": 1 }, { unique: true });
```

### Citations Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,  // reference to users
  citationType: String,  // 'book', 'article', 'website'
  author: String,
  initial: String,
  year: Number,
  title: String,
  publisher: String,
  journal: String,
  siteName: String,
  citationText: String,
  createdAt: Date
}

// Indexes
db.citations.createIndex({ "userId": 1 });
db.citations.createIndex({ "createdAt": -1 });
```

### Reading List Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  author: String,
  year: Number,
  status: String,  // 'todo', 'reading', 'done'
  notes: String,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.readingList.createIndex({ "userId": 1 });
db.readingList.createIndex({ "status": 1 });
```

### Planner Items Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  task: String,
  completed: Boolean,
  priority: String,  // 'low', 'medium', 'high'
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.plannerItems.createIndex({ "userId": 1 });
db.plannerItems.createIndex({ "completed": 1 });
db.plannerItems.createIndex({ "dueDate": 1 });
```

### Research Notes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  content: String,
  tags: [String],
  category: String,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.researchNotes.createIndex({ "userId": 1 });
db.researchNotes.createIndex({ "createdAt": -1 });
db.researchNotes.createIndex({ "tags": 1 });
```

### Pomodoro Stats Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  date: Date,
  count: Number,
  createdAt: Date
}

// Indexes
db.pomodoroStats.createIndex({ "userId": 1, "date": 1 }, { unique: true });
db.pomodoroStats.createIndex({ "date": -1 });
```

---

## Migration Strategy

### From LocalStorage to Database

1. **Export Current Data**: Use the Export feature to download all user data as JSON
2. **Backend API**: Create REST/GraphQL endpoints for CRUD operations
3. **Authentication**: Implement JWT or session-based authentication
4. **Data Sync**: Migrate localStorage data to server on first login post-migration
5. **Fallback**: Keep localStorage as a fallback for offline functionality

### API Endpoints (Suggested)

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/citations
POST   /api/citations
DELETE /api/citations/:id

GET    /api/reading-list
POST   /api/reading-list
PATCH  /api/reading-list/:id
DELETE /api/reading-list/:id

GET    /api/planner
POST   /api/planner
PATCH  /api/planner/:id
DELETE /api/planner/:id

GET    /api/notes
POST   /api/notes
PATCH  /api/notes/:id
DELETE /api/notes/:id

GET    /api/pomodoro/stats
POST   /api/pomodoro/stats

GET    /api/user/profile
PATCH  /api/user/profile
POST   /api/user/import-data
```

---

## Notes

- **Security**: Always hash passwords using bcrypt or similar before storing
- **API Key**: Store encrypted or use a secure vault for sensitive API keys
- **Soft Deletes**: Consider adding `deleted_at` fields for soft delete functionality
- **Audit Trail**: Consider adding `created_by`, `updated_by` for audit purposes
- **Indexes**: Adjust indexes based on actual query patterns in production
- **Data Privacy**: Ensure GDPR/KVKK compliance for user data storage
