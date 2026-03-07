"""Run seed.sql and check for errors."""
import psycopg2

DB = "host=34.87.55.176 port=3306 dbname=Pathora user=postgres password=123abc@A"

def get_columns(cur, table):
    cur.execute(
        "SELECT column_name, data_type, column_default FROM information_schema.columns "
        "WHERE table_name = %s ORDER BY ordinal_position", (table,)
    )
    return [(r[0], r[1], r[2]) for r in cur.fetchall()]

def run_seed():
    conn = psycopg2.connect(DB)
    conn.autocommit = False
    cur = conn.cursor()

    # Show columns for key tables
    for t in ["TourImages"]:
        cols = get_columns(cur, t)
        print(f"{t}: {cols}")

    # Run seed
    with open("seed.sql", "r", encoding="utf-8") as f:
        sql = f.read()

    try:
        cur.execute(sql)
        conn.commit()
        print("\nSEED SUCCESS")
    except Exception as e:
        conn.rollback()
        print(f"\nSEED FAILED: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    run_seed()
