
from flask import Flask
from app.config import Config
from app.models import db
from app.auth import auth_bp, login_manager
from app.views import views_bp

app = Flask(__name__, static_folder="static", template_folder="templates")
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
login_manager.init_app(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(views_bp)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
