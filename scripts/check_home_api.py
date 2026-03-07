"""
Home Page API Health Check Script
Verifies all 6 public API endpoints used by the Home page return valid data,
and cross-checks counts against the database.
"""

import sys
import time
import json
import requests
import psycopg2

# ── Configuration ────────────────────────────────────────────────────────────

API_BASE_URL = "http://localhost:8080"
DB_CONNECTION = "host=34.87.55.176 port=3306 dbname=Pathora user=postgres password=123abc@A"

ENDPOINTS = [
    {
        "name": "Featured Tours",
        "path": "/api/public/tours/featured?limit=8",
        "expected_fields": ["id", "tourName", "thumbnail"],
        "data_type": "array",
    },
    {
        "name": "Latest Tours",
        "path": "/api/public/tours/latest?limit=6",
        "expected_fields": ["id", "tourName", "createdAt"],
        "data_type": "array",
    },
    {
        "name": "Trending Destinations",
        "path": "/api/public/destinations/trending?limit=6",
        "expected_fields": ["city", "country"],
        "data_type": "array",
    },
    {
        "name": "Top Attractions",
        "path": "/api/public/attractions/top?limit=8",
        "expected_fields": ["name"],
        "data_type": "array",
    },
    {
        "name": "Home Stats",
        "path": "/api/public/stats",
        "expected_fields": [],
        "data_type": "object",
    },
    {
        "name": "Top Reviews",
        "path": "/api/public/reviews/top?limit=6",
        "expected_fields": ["rating", "comment"],
        "data_type": "array",
    },
]


# ── Connection checks ────────────────────────────────────────────────────────

def check_api_connection():
    """Check API server is reachable via health endpoint."""
    try:
        r = requests.get(f"{API_BASE_URL}/health", timeout=5)
        return r.status_code == 200
    except requests.ConnectionError:
        return False


def check_db_connection():
    """Check database is reachable."""
    try:
        conn = psycopg2.connect(DB_CONNECTION)
        conn.close()
        return True
    except Exception:
        return False


# ── Endpoint verification ────────────────────────────────────────────────────

def check_endpoint(endpoint):
    """Call an endpoint and verify response format. Returns result dict."""
    url = f"{API_BASE_URL}{endpoint['path']}"
    result = {
        "name": endpoint["name"],
        "status": "FAIL",
        "time_ms": 0,
        "items": 0,
        "error": None,
    }

    try:
        start = time.time()
        r = requests.get(url, timeout=15)
        elapsed = (time.time() - start) * 1000
        result["time_ms"] = round(elapsed, 1)

        if r.status_code != 200:
            result["error"] = f"HTTP {r.status_code}"
            return result

        body = r.json()
        data = body.get("data")

        if data is None:
            result["error"] = "data is null"
            return result

        if endpoint["data_type"] == "array":
            if not isinstance(data, list):
                result["error"] = "data is not an array"
                return result
            result["items"] = len(data)
            # Check expected fields on first item
            if data and endpoint["expected_fields"]:
                first = data[0]
                missing = [f for f in endpoint["expected_fields"] if f not in first]
                if missing:
                    result["error"] = f"missing fields: {missing}"
                    return result
        else:
            if not isinstance(data, dict):
                result["error"] = "data is not an object"
                return result
            result["items"] = len(data)

        result["status"] = "PASS"

    except requests.ConnectionError:
        result["error"] = "connection refused"
    except Exception as e:
        result["error"] = str(e)

    return result


# ── Database cross-checks ────────────────────────────────────────────────────

def cross_check_db(api_results):
    """Compare API counts with database counts."""
    checks = []
    try:
        conn = psycopg2.connect(DB_CONNECTION)
        cur = conn.cursor()

        # Tours: active and not deleted
        cur.execute("""SELECT COUNT(*) FROM "Tours" WHERE "Status" = 'Active' AND "IsDeleted" = false""")
        db_tours = cur.fetchone()[0]
        featured_count = next((r["items"] for r in api_results if r["name"] == "Featured Tours"), 0)
        latest_count = next((r["items"] for r in api_results if r["name"] == "Latest Tours"), 0)
        checks.append({
            "name": "Tours (Featured <= DB)",
            "api": featured_count,
            "db": db_tours,
            "status": "PASS" if featured_count <= db_tours else "FAIL",
        })
        checks.append({
            "name": "Tours (Latest <= DB)",
            "api": latest_count,
            "db": db_tours,
            "status": "PASS" if latest_count <= db_tours else "FAIL",
        })

        # Reviews
        cur.execute("""SELECT COUNT(*) FROM "Reviews" WHERE "IsApproved" = true""")
        db_reviews = cur.fetchone()[0]
        reviews_count = next((r["items"] for r in api_results if r["name"] == "Top Reviews"), 0)
        checks.append({
            "name": "Reviews (API <= DB)",
            "api": reviews_count,
            "db": db_reviews,
            "status": "PASS" if reviews_count <= db_reviews else "FAIL",
        })

        # Locations / destinations
        cur.execute("""SELECT COUNT(DISTINCT "City") FROM "TourPlanLocations" WHERE "City" IS NOT NULL""")
        db_locations = cur.fetchone()[0]
        dest_count = next((r["items"] for r in api_results if r["name"] == "Trending Destinations"), 0)
        attract_count = next((r["items"] for r in api_results if r["name"] == "Top Attractions"), 0)
        checks.append({
            "name": "Destinations (API <= DB)",
            "api": dest_count,
            "db": db_locations,
            "status": "PASS" if dest_count <= db_locations else "FAIL",
        })
        checks.append({
            "name": "Attractions (API <= DB)",
            "api": attract_count,
            "db": db_locations,
            "status": "PASS" if attract_count <= db_locations else "FAIL",
        })

        cur.close()
        conn.close()
    except Exception as e:
        checks.append({"name": "DB Cross-check", "api": "-", "db": "-", "status": f"ERROR: {e}"})

    return checks


# ── Report ────────────────────────────────────────────────────────────────────

def print_report(api_results, db_checks):
    """Print summary table and verdict."""
    sep = "-" * 80

    print(f"\n{'=' * 80}")
    print("  HOME PAGE API HEALTH CHECK REPORT")
    print(f"{'=' * 80}\n")

    # API endpoint results
    print(f"{'Endpoint':<28} {'Status':<8} {'Time (ms)':<12} {'Items':<8} {'Error'}")
    print(sep)
    for r in api_results:
        status_icon = "PASS" if r["status"] == "PASS" else "FAIL"
        error = r["error"] or ""
        print(f"{r['name']:<28} {status_icon:<8} {r['time_ms']:<12} {r['items']:<8} {error}")

    # DB cross-check results
    print(f"\n{'DB Cross-Check':<28} {'Status':<8} {'API Count':<12} {'DB Count'}")
    print(sep)
    for c in db_checks:
        print(f"{c['name']:<28} {c['status']:<8} {str(c['api']):<12} {c['db']}")

    # Verdict
    all_api_pass = all(r["status"] == "PASS" for r in api_results)
    all_db_pass = all(c["status"] == "PASS" for c in db_checks)

    print(f"\n{'=' * 80}")
    if all_api_pass and all_db_pass:
        print("  VERDICT: ALL PASS")
    else:
        failed_api = [r["name"] for r in api_results if r["status"] != "PASS"]
        failed_db = [c["name"] for c in db_checks if c["status"] != "PASS"]
        failures = failed_api + failed_db
        print(f"  VERDICT: FAIL — {', '.join(failures)}")
    print(f"{'=' * 80}\n")

    return all_api_pass and all_db_pass


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("Checking API server connection...")
    if not check_api_connection():
        print(f"FAIL: Cannot reach API server at {API_BASE_URL}")
        sys.exit(1)
    print(f"  API server OK ({API_BASE_URL})")

    print("Checking database connection...")
    db_ok = check_db_connection()
    if db_ok:
        print("  Database OK")
    else:
        print("  WARNING: Cannot connect to database — skipping cross-checks")

    # Check each endpoint
    api_results = []
    for ep in ENDPOINTS:
        result = check_endpoint(ep)
        api_results.append(result)

    # DB cross-checks
    db_checks = []
    if db_ok:
        db_checks = cross_check_db(api_results)

    # Report
    all_pass = print_report(api_results, db_checks)
    sys.exit(0 if all_pass else 1)


if __name__ == "__main__":
    main()
