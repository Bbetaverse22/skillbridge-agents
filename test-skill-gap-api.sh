#!/bin/bash

echo "🧪 Testing Skill Gap Storage API"
echo "================================"
echo ""

# Test 1: Store skill gap
echo "📝 Test 1: Storing skill gap analysis..."
curl -X POST http://localhost:3000/api/skill-gaps \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "githubAnalysis": {
      "repository": "https://github.com/vercel/next.js",
      "technologies": ["React", "Next.js"],
      "frameworks": ["Next.js"],
      "languages": ["TypeScript", "JavaScript"],
      "tools": ["npm", "Git"],
      "skillLevel": "intermediate",
      "recommendations": ["Learn Server Components"]
    },
    "skillAssessment": {
      "overallScore": 75,
      "skillGaps": [
        {
          "skill": {
            "id": "typescript",
            "name": "TypeScript",
            "currentLevel": 3,
            "targetLevel": 5,
            "importance": 5,
            "category": "technical"
          },
          "gap": 2,
          "priority": 10,
          "recommendations": ["Learn advanced TypeScript features"]
        }
      ],
      "categories": [],
      "recommendations": ["Focus on TypeScript"],
      "learningPath": ["Master TypeScript", "Learn testing"]
    }
  }'

echo ""
echo ""

# Test 2: Retrieve skill gap
echo "📖 Test 2: Retrieving skill gap analysis..."
curl -X GET "http://localhost:3000/api/skill-gaps?userId=user_123"

echo ""
echo ""
echo "✅ Tests complete!"

