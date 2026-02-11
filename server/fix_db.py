import pymysql

# Database connection details
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'smart_support_db'
}

def fix_database():
    try:
        # 1. Connect to MariaDB
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("✅ Connected to database.")

        # 2. Disable foreign key checks to allow deep cleaning
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")

        # 3. Wipe old/broken data to start fresh for your demo
        # This clears tickets and comments linked to IDs other than 1 and 2
        cursor.execute("DELETE FROM comments WHERE user_id > 2 OR user_id NOT IN (1, 2);")
        cursor.execute("DELETE FROM tickets WHERE created_by > 2 OR created_by NOT IN (1, 2);")
        cursor.execute("DELETE FROM users WHERE user_id > 2;")
        print("✅ Cleaned up old/broken user data.")

        # 4. Ensure Admin (ID 1) and Student (ID 2) exist with correct IDs
        # We use 'REPLACE INTO' to ensure they have the exact IDs you want
        cursor.execute("""
            REPLACE INTO users (user_id, username, email, password_hash, role_id) 
            VALUES (1, 'admin', 'admin@smartsupport.com', 'admin123', 1);
        """)
        cursor.execute("""
            REPLACE INTO users (user_id, username, email, password_hash, role_id) 
            VALUES (2, 'student1', 'email@test.com', 'pass123', 2);
        """)
        print("✅ Verified Admin (ID: 1) and Student1 (ID: 2) are set.")

        # 5. Reset the Auto-Increment counter so new users start from 3
        cursor.execute("ALTER TABLE users AUTO_INCREMENT = 3;")

        # 6. Re-enable foreign key checks
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        
        conn.commit()
        print("\n🚀 DATABASE CORRECTED SUCCESSFULLY!")
        print("You can now log in with:")
        print(" - admin / admin123")
        print(" - student1 / pass123")

    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    fix_database()