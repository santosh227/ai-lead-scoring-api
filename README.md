Project Information : 

LIVE URL : https://ai-lead-scoring-api-1.onrender.com/

DOCKER HUB: https://hub.docker.com/r/santoshkumar42/lead-scoring-api

API DOCUMENTATION IN POSTMAN : https://documenter.getpostman.com/view/46079757/2sB3HrmHxC

PORTFOLIO: https://santoshkumar-portfolio-520a.onrender.com/

Project Overview : 

AI Lead Scoring API is an intelligent sales qualification system that automates B2B lead scoring through a hybrid approach combining rule-based business logic with artificial intelligence analysis. The system addresses the critical challenge where sales teams spend hours manually qualifying leads with inconsistent criteria, often missing high-value opportunities. This solution processes leads in seconds, providing consistent scoring and detailed reasoning to help sales teams prioritize their efforts effectively.

Technology Stack : 

Backend Framework: Node.js 18.x with Express.js 5.1

Database: MongoDB 6.0 with Mongoose ODM

AI Integration: OpenAI GPT-3.5-turbo API

File Processing: Multer for uploads, CSV-parser for data processing

Containerization: Docker and Docker Compose

Deployment: Render cloud platform

Development: Nodemon for hot reload, CORS middleware

Installation and Setup : 

Prerequisites: Node.js 18+, MongoDB 6.0+, OpenAI API key

Local Development Setup:

```
git clone https://github.com/santosh227/ai-lead-scoring-api.git
cd ai-lead-scoring-api
npm install
cp .env.example .env
```
Environment Configuration (.env file):
```
OPENAI_API_KEY=sk-your-openai-api-key-here
MONGO_URI=mongodb://localhost:27017/lead-scoring
PORT=3000
NODE_ENV=development
```

Start Development Server:
```
npm run dev
```
Docker Setup:
```
docker-compose up --build
```

