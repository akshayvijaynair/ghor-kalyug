# ghor-kalyug
CS 696A Project 

## Setup for local development
At the root level, run `docker-compose up --build`

## environment variables
Add the below to .env and a env_variables.yaml
### Client
```typescript
VITE_API_KEY="",
VITE_AUTH_DOMAIN="",
VITE_PROJECT_ID="",
VITE_STORAGE_BUCKET="",
VITE_MESSAGING_SENDER_ID="",
VITE_APP_ID="",
VITE_MEASUREMENT_ID=""
VITE_API_DOMAIN=""
```

### Server
```typescript
NODE_ENV=""
API_KEY=""
MONGODB_URI=""
DB_NAME=""
CORS_ORIGIN=""
```

## Steps for GCP deployment

> [!IMPORTANT]
> We use app engine for GCP deployment
>

At the root level, execute `./deploy.sh`

## System Design
https://drive.google.com/file/d/1QYruwR1wnb4nE4quxkjihrWymH5j_bSl/view?usp=sharing

## API design
Here’s an API design proposal for the described quiz application requirements. The APIs are categorized by functionality and stakeholders (Students, Teachers, and Admin), focusing on scalability, modularity, and ease of integration.

---

### **1. Student-Focused APIs**

#### 1.1 Quiz Generation
**Endpoint:** `POST /generate-quiz`  
**Description:** Allows students to create quizzes by selecting topics, difficulty levels, and the number of questions.  
**Request Body:**
```json
{
  "courseId": "string",
  "topics": ["string"],
  "difficulty": "easy|medium|hard",
  "numQuestions": "integer"
}
```
**Response:**

```json
{
  "quiz": {
    "questionId": "string",
    "question": "string",
    "options": [
      {"key":"string", "value":"string"} 
    ],
    "answer": "string"
  }
}
```

#### 1.2 Take Quiz
**Endpoint:** `GET /quizzes/{quizId}`  
**Description:** Fetches questions for the quiz.  
**Response:**
```json
{
  "quizId": "string",
  "questions": [
    {
      "questionId": "string",
      "questionText": "string",
      "options": ["string", "string", "string", "string"]
    }
  ]
}
```

#### 1.3 Submit Answer
**Endpoint:** `POST /quizzes/{quizId}/answers`  
**Description:** Submits answers and provides immediate feedback.  
**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "string",
      "selectedOption": "string"
    }
  ]
}
```
**Response:**
```json
{
  "feedback": [
    {
      "questionId": "string",
      "isCorrect": "boolean",
      "explanation": "string"
    }
  ],
  "score": "integer"
}
```

#### 1.4 Performance Tracking
**Endpoint:** `GET /performance`  
**Description:** Retrieves the student's performance data.  
**Response:**
```json
{
  "progress": [
    {
      "quizId": "string",
      "score": "integer",
      "topics": ["string"],
      "difficulty": "string"
    }
  ]
}
```

#### 1.5 Flashcard Suggestions
**Endpoint:** `GET /flashcards/suggestions`  
**Description:** Suggests flashcards based on past performance.  
**Response:**
```json
{
  "flashcards": [
    {
      "id": "string",
      "term": "string",
      "definition": "string"
    }
  ]
}
```

---

### **2. Teacher-Focused APIs**

#### 2.1 Question Bank Management
**Endpoint:** `POST /questions`  
**Description:** Allows teachers to create or upload questions.  
**Request Body:**
```json
{
  "courseId": "string",
  "questions": [
    {
      "questionText": "string",
      "options": ["string", "string", "string", "string"],
      "correctOption": "string",
      "topic": "string",
      "difficulty": "easy|medium|hard"
    }
  ]
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Questions uploaded successfully."
}
```

#### 2.2 Performance Analytics
**Endpoint:** `GET /analytics/performance`  
**Description:** Provides aggregated student performance data.  
**Response:**
```json
{
  "analytics": [
    {
      "topic": "string",
      "averageScore": "float",
      "commonMistakes": ["string"]
    }
  ]
}
```

#### 2.3 Quiz Scheduling
**Endpoint:** `POST /quizzes/schedule`  
**Description:** Allows teachers to schedule quizzes.  
**Request Body:**
```json
{
  "quizId": "string",
  "startTime": "ISO8601 timestamp",
  "endTime": "ISO8601 timestamp"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Quiz scheduled successfully."
}
```

#### 2.4 AI Content Approval
**Endpoint:** `PUT /ai-content/approve`  
**Description:** Enables teachers to review and approve AI-generated content.  
**Request Body:**
```json
{
  "contentId": "string",
  "approved": "boolean",
  "comments": "string"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Content reviewed successfully."
}
```

---

### **3. Shared APIs**

#### 3.1 Topic and Course List
**Endpoint:** `GET /courses/{courseId}/topics`  
**Description:** Fetches available topics for a course.  
**Response:**
```json
{
  "courseId": "string",
  "topics": ["string"]
}
```

#### 3.2 Notifications
**Endpoint:** `GET /notifications`  
**Description:** Retrieves notifications for the user.  
**Response:**
```json
{
  "notifications": [
    {
      "id": "string",
      "message": "string",
      "type": "quiz|flashcard|ai-feedback",
      "timestamp": "ISO8601 timestamp"
    }
  ]
}
```

---

### **4. Admin APIs (Optional)**

#### 4.1 AI Feedback
**Endpoint:** `GET /ai-feedback/issues`  
**Description:** Retrieves unresolved AI issues and feedback.  
**Response:**
```json
{
  "issues": [
    {
      "issueId": "string",
      "details": "string",
      "studentId": "string"
    }
  ]
}
```

---

### Design Highlights
1. **RESTful Design:** The endpoints follow REST principles, ensuring clarity and predictability.
2. **Topic-Difficulty Mapping:** APIs allow topic and difficulty-level filtering for both quiz and question bank management.
3. **Feedback Loop:** Real-time feedback on answers and teacher feedback for AI ensures quality and engagement.
4. **Extensibility:** APIs support dynamic expansion for future features, like gamification or integration with third-party tools.
