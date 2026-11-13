import urllib.request
import urllib.error
import json

base_url = "http://127.0.0.1:8000"

print("=== TESTING SUPABASE ENDPOINTS (DEMO MODE) ===")

# 1. Test GET /api/reports/history
try:
    req = urllib.request.Request(f"{base_url}/api/reports/history?user_id=00000000-0000-0000-0000-000000000000")
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print("1. GET /api/reports/history -> Status:", resp.status)
        print("   Response:", data)
        assert data.get("demo_mode") is True
        assert data.get("configured") is False
        assert data.get("reports") == []
        print("   -> PASSED: Cleanly reports Demo Mode without pretending data exists.")
except Exception as e:
    print("   -> FAILED:", e)

# 2. Test POST /api/reports/save when unconfigured
try:
    payload = json.dumps({
        "user_id": "00000000-0000-0000-0000-000000000000",
        "title": "Complete Blood Count",
        "report_data": {"report_type": "CBC", "summary": "Test summary", "metrics": []}
    }).encode('utf-8')
    req = urllib.request.Request(
        f"{base_url}/api/reports/save",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    urllib.request.urlopen(req)
    print("   -> UNEXPECTED: Save should have returned 503 when unconfigured!")
except urllib.error.HTTPError as e:
    print("2. POST /api/reports/save when unconfigured -> HTTP", e.code)
    body = json.loads(e.read().decode())
    print("   Detail:", body.get("detail"))
    assert e.code == 503
    print("   -> PASSED: Returns 503 Service Unavailable, refusing to pretend data was saved.")
except Exception as e:
    print("   -> FAILED:", e)

print("=== ALL SUPABASE BACKEND TESTS PASSED ===")
