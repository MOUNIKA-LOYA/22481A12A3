await fetch("http://20.244.56.144/evaluation-service/logs", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtb3VuaWthLmxveWEyOEBnbWFpbC5jb20iLCJleHAiOjE3NTQzNzg1ODAsImlhdCI6MTc1NDM3NzY4MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjU0NWE4MjlmLWZjNmItNGJhMS04M2UxLTExZDBmOWI3YTA3NyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1vdW5pa2EgbG95YSIsInN1YiI6ImNmYWQwNjFkLTFmMTEtNDE1OC1iNGM2LTA2ZDU1ZDE2ZjUzNyJ9LCJlbWFpbCI6Im1vdW5pa2EubG95YTI4QGdtYWlsLmNvbSIsIm5hbWUiOiJtb3VuaWthIGxveWEiLCJyb2xsTm8iOiIyMjQ4MWExMmEzIiwiYWNjZXNzQ29kZSI6IkhiRHBwRyIsImNsaWVudElEIjoiY2ZhZDA2MWQtMWYxMS00MTU4LWI0YzYtMDZkNTVkMTZmNTM3IiwiY2xpZW50U2VjcmV0IjoiVVFXRlVQQ3JBbnl6bW1NUSJ9.g57lehNbPvyh8zsk0MrcRB0ZP6hdnaH8aOxhLkuDPs8`,
    },
    body: JSON.stringify(logData),
});
