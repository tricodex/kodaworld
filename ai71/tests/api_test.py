import asyncio
import aiohttp

BASE_URL = "http://localhost:8000"

async def test_api_calls():
    async with aiohttp.ClientSession() as session:
        # Test root endpoint
        async def test_root():
            async with session.get(f"{BASE_URL}/") as response:
                assert response.status == 200
                data = await response.json()
                assert data["message"] == "Welcome to the KodaWorld API"
            print("Root endpoint test passed")

        # Test AI tutor
        async def test_ai_tutor():
            payload = {
                "message": "What is the capital of France?",
                "studentId": "test_student",
                "character": "koda"
            }
            async with session.post(f"{BASE_URL}/api/ai-tutor", json=payload) as response:
                assert response.status == 200
                data = await response.json()
                assert "response" in data
            print("AI tutor test passed")

        # Test conversation history
        async def test_conversation_history():
            async with session.get(f"{BASE_URL}/api/conversation-history/test_student/koda") as response:
                assert response.status == 200
                data = await response.json()
                assert "history" in data
            print("Conversation history test passed")

        # Test clear history
        async def test_clear_history():
            async with session.post(f"{BASE_URL}/api/clear-history/test_student/koda") as response:
                assert response.status == 200
                data = await response.json()
                assert data["message"] == "Conversation history cleared successfully"
            print("Clear history test passed")

        # Test collect feedback
        async def test_collect_feedback():
            async with session.post(f"{BASE_URL}/api/collect-feedback/test_student", json="Great tutor!") as response:
                assert response.status == 200
                data = await response.json()
                assert data["message"] == "Feedback collected successfully"
            print("Collect feedback test passed")

        # Test learning progress
        async def test_learning_progress():
            async with session.get(f"{BASE_URL}/api/learning-progress/test_student") as response:
                assert response.status == 200
                data = await response.json()
                assert "progress" in data
            print("Learning progress test passed")

        # Test next steps
        async def test_next_steps():
            async with session.get(f"{BASE_URL}/api/next-steps/test_student") as response:
                assert response.status == 200
                data = await response.json()
                assert "nextSteps" in data
            print("Next steps test passed")

        # Test optimize curriculum
        async def test_optimize_curriculum():
            payload = {
                "current_curriculum": {
                    "subject": "Math",
                    "units": ["Algebra", "Geometry"],
                    "difficulty": "Intermediate"
                },
                "performance_data": [
                    {"chapter": "Algebra", "score": 0.8},
                    {"chapter": "Geometry", "score": 0.6}
                ],
                "learning_goals": ["Master quadratic equations", "Understand trigonometry"]
            }
            async with session.post(f"{BASE_URL}/api/optimize-curriculum", json=payload) as response:
                assert response.status == 200
                data = await response.json()
                assert "optimizedCurriculum" in data
            print("Optimize curriculum test passed")

        # Test get curriculum
        async def test_get_curriculum():
            async with session.get(f"{BASE_URL}/api/curriculum/latest") as response:
                assert response.status == 200
                data = await response.json()
                assert "curriculum" in data
            print("Get curriculum test passed")

        # Test generate achievements
        async def test_generate_achievements():
            payload = {
                "subject": "Science",
                "units": ["Biology", "Chemistry"],
                "difficulty": "Advanced"
            }
            async with session.post(f"{BASE_URL}/api/generate-achievements", json=payload) as response:
                assert response.status == 200
                data = await response.json()
                assert "achievementSystem" in data
            print("Generate achievements test passed")

        # Test update achievements
        async def test_update_achievements():
            payload = {
                "progress": {"Biology": 0.7, "Chemistry": 0.5},
                "achievement_system": {"achievements": []}  # Simplified for testing
            }
            async with session.post(f"{BASE_URL}/api/update-achievements/test_student", json=payload) as response:
                assert response.status == 200
                data = await response.json()
                assert "achievementUpdates" in data
            print("Update achievements test passed")

        # Test generate challenges
        async def test_generate_challenges():
            payload = {
                "progress": {"Biology": 0.7, "Chemistry": 0.5},
                "achievement_system": {"achievements": []}  # Simplified for testing
            }
            async with session.post(f"{BASE_URL}/api/generate-challenges/test_student", json=payload) as response:
                assert response.status == 200
                data = await response.json()
                assert "challenges" in data
            print("Generate challenges test passed")

        # Test calculate engagement
        async def test_calculate_engagement():
            payload = [
                {"timestamp": "2023-07-01T10:00:00", "activity": "login"},
                {"timestamp": "2023-07-01T10:30:00", "activity": "complete_lesson"}
            ]
            async with session.post(f"{BASE_URL}/api/calculate-engagement/test_student", json=payload) as response:
                assert response.status == 200
                data = await response.json()
                assert "engagementScore" in data
            print("Calculate engagement test passed")

        # Test match peers
        async def test_match_peers():
            payload = {
                "users": [
                    {"id": 1, "skills": {"math": 0.8, "science": 0.7}},
                    {"id": 2, "skills": {"math": 0.6, "science": 0.9}},
                    {"id": 3, "skills": {"math": 0.7, "science": 0.8}}
                ],
                "groupSize": 2
            }
            async with session.post(f"{BASE_URL}/api/match-peers", json=payload) as response:
                assert response.status == 200
                data = await response.json()
                assert "matches" in data
            print("Match peers test passed")

        # Test generate environment
        async def test_generate_environment():
            payload = {
                "topic": "Photosynthesis",
                "complexity": "Intermediate"
            }
            async with session.post(f"{BASE_URL}/api/generate-environment", json=payload) as response:
                assert response.status == 200
                data = await response.json()
                assert "environment" in data
            print("Generate environment test passed")

        

        # Test generate challenge
        async def test_generate_challenge():
            payload = {
                "environment": {
                    "topic": "Photosynthesis",
                    "complexity": "Intermediate",
                    "elements": ["sun", "plant", "water"]
                },
                "difficulty": "Intermediate"
            }
            async with session.post(f"{BASE_URL}/api/generate-challenge", json=payload) as response:
                status = response.status
                print(f"Generate challenge response - Status: {status}, Data: {await response.json()}")
                assert status == 200, f"Expected status 200, but got {status}"
                data = await response.json()
                assert "challenge" in data
            print("Generate challenge test passed")

        # Run all tests
        await asyncio.gather(
            test_root(),
            test_ai_tutor(),
            test_conversation_history(),
            test_clear_history(),
            test_collect_feedback(),
            test_learning_progress(),
            test_next_steps(),
            test_optimize_curriculum(),
            test_get_curriculum(),
            test_generate_achievements(),
            test_update_achievements(),
            test_generate_challenges(),
            test_calculate_engagement(),
            test_match_peers(),
            test_generate_environment(),
            test_generate_challenge()
        )

if __name__ == "__main__":
    asyncio.run(test_api_calls())