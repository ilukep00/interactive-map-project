import psycopg2
import os 
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "dbname": os.getenv("DB_NAME", "your_db"),
    "user": os.getenv("DB_USER", "your_user"),
    "password": os.getenv("DB_PASSWORD", "yout_password"),
    "port": int(os.getenv("DB_PORT", 5432))
}

def fn_building_register_call(p_wkt,p_building_cod,p_observation):
    parts = []
    # read database configuration
    params = DB_CONFIG
    try:
        # connect to the PostgreSQL database
        with  psycopg2.connect(**params) as conn:
            print(conn)
            with conn.cursor() as cur:
                # create a cursor object for execution
                cur = conn.cursor()
                cur.callproc('fn_building_register', (p_wkt,p_building_cod,p_observation))
                # process the result set
                row = cur.fetchone()
                while row is not None:
                    parts.append(row)
                    row = cur.fetchone()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        return parts


