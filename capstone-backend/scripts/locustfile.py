from datetime import datetime, timezone
from random import randint

from time import sleep
from urllib.parse import parse_qs, urlparse
from locust import HttpUser, LoadTestShape, between, task

auth_headers: dict[str, str] | None = None
mood_log_ids = []
conversation_ids = []


class LoadTester(HttpUser):
    wait_time = between(1, 5)
    mood_options = ["awful", "bad", "good", "meh", "rad"]
    scenario_options = [
        "productivity",
        "school",
        "weather",
        "social",
        "food",
        "sleep",
        "hobbies",
        "health",
        "chores",
        "romance",
        "beauty",
        "places",
        "period_symptoms",
        "bad_habits",
        "work",
    ]

    def generate_test_moodlog(self):
        datetime_with_zulu = (
            datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        )

        return {
            "log_date": datetime_with_zulu,
            "mood": self.mood_options[randint(0, len(self.mood_options) - 1)],
            "note": "test note",
            "scenario": [
                self.scenario_options[randint(0, len(self.scenario_options) - 1)]
            ],
        }

    def get_random_id(self, arr: list):
        idx = randint(0, len(arr) - 1)
        return arr[idx]

    @task(2)
    def me(self):
        self.client.get("/user/me", headers=auth_headers)

    @task(10)
    def create_moodlog(self):
        resp = self.client.post(
            "/user/mood-log", headers=auth_headers, json=self.generate_test_moodlog()
        )
        match resp.status_code:
            case 200:
                res = resp.json()
                mood_log_ids.append(res["id"])
            case _:
                pass

    @task(5)
    def update_moodlog(self):
        match len(mood_log_ids):
            case 0:
                pass
            case _:
                id = self.get_random_id(mood_log_ids)
                self.client.patch(
                    f"/user/mood-log/{id}",
                    headers=auth_headers,
                    json=self.generate_test_moodlog(),
                    name="/update-moodlog",
                )

    @task(10)
    def delete_moodlog(self):
        match len(mood_log_ids):
            case 0:
                pass
            case _:
                id = self.get_random_id(mood_log_ids)
                resp = self.client.delete(
                    f"/user/mood-log/{id}",
                    headers=auth_headers,
                    name="/delete-moodlog",
                )
                if resp.status_code == 202:
                    mood_log_ids.remove(id)

    @task(6)
    def get_all_moodlogs(self):
        self.client.get("/user/mood-log", headers=auth_headers)

    @task(4)
    def mood_avg(self):
        self.client.get("/user/mood-log/mood-avg", headers=auth_headers)

    @task(4)
    def mood_count(self):
        self.client.get("/user/mood-log/mood-count", headers=auth_headers)

    @task(2)
    def get_conversation(self):
        self.client.get("/user/conversation", headers=auth_headers)

    @task(2)
    def create_conversation(self):
        resp = self.client.post("/user/conversation", headers=auth_headers)
        match resp.status_code:
            case 200:
                res = resp.json()
                conversation_ids.append(res["id"])
            case _:
                pass

    @task(2)
    def get_chat_messages(self):
        match len(conversation_ids):
            case 0:
                pass
            case _:
                id = self.get_random_id(conversation_ids)
                self.client.get(
                    f"/user/conversation/{id}", headers=auth_headers, name="/get-chat"
                )

    @task(2)
    def post_chat_messages(self):
        match len(conversation_ids):
            case 0:
                pass
            case _:
                id = self.get_random_id(conversation_ids)
                self.client.post(
                    f"/user/conversation/{id}",
                    headers=auth_headers,
                    name="/create-chat",
                    json={"content": "test ai chat message"},
                )
                sleep(1.5)

    def on_start(self) -> None:
        global auth_headers

        match auth_headers:
            case None:
                resp = self.client.get("/sign-in/test/callback")
                match resp.status_code:
                    case 200:
                        url = resp.url
                        parsed_url = urlparse(url)
                        query_params = parse_qs(parsed_url.query)
                        token = query_params.get("token", [None])[0]

                        auth_headers = {"Authorization": f"Bearer {token}"}
                    case _:
                        print(f"Failed to sign in, status code: {resp.status_code}")
            case _:
                pass


class StagesShapeWithCustomUsers(LoadTestShape):
    stages = [
        {"duration": 1, "users": 1, "spawn_rate": 1},
        {"duration": 60, "users": 60, "spawn_rate": 100},
        {"duration": 80, "users": 150, "spawn_rate": 100},
        {"duration": 100, "users": 300, "spawn_rate": 100},
        {"duration": 120, "users": 300, "spawn_rate": 100},
        {"duration": 160, "users": 150, "spawn_rate": 100},
        {"duration": 180, "users": 60, "spawn_rate": 100},
    ]

    def tick(self):
        run_time = self.get_run_time()

        for stage in self.stages:
            if run_time < stage["duration"]:
                tick_data = (stage["users"], stage["spawn_rate"])
                return tick_data

        return None
