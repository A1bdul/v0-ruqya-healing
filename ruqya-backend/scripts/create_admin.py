"""Create admin user only."""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash
import uuid


def create_admin():
    """Create an admin user."""
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.email == "admin@ruqyahealinghub.com").first()
        
        if admin:
            print("❌ Admin user already exists!")
            print("📧 Email: admin@ruqyahealinghub.com")
            return
        
        # Create admin user
        admin = User(
            id=str(uuid.uuid4()),
            email="admin@ruqyahealinghub.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            phone="+1234567890",
            role=UserRole.ADMIN,
            is_active=True
        )
        
        db.add(admin)
        db.commit()
        
        print("✅ Admin user created successfully!")
        print("="*50)
        print("📧 Email: admin@ruqyahealinghub.com")
        print("🔑 Password: admin123")
        print("="*50)
        print("⚠️  Please change the password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()
