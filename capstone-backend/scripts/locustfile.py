from urllib.parse import parse_qs, urlparse
from locust import HttpUser, LoadTestShape, between, task

auth_headers: dict[str,str] | None = None

class LoadTester(HttpUser):
    wait_time = between(1, 5)

    @task
    def me(self):
        self.client.get("/user/me", headers=auth_headers)

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
                        token = query_params.get('token', [None])[0]
                        
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