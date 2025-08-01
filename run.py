from flask import Flask
from app.config import Config
from app.models import db
from app.auth import auth_bp, login_manager
from app.views import views_bp

app = Flask(__name__, static_folder="../static", template_folder="../templates")
app.config.from_object(Config)

# init extensions
db.init_app(app)
login_manager.init_app(app)

# register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(views_bp)

if __name__=="__main__":
    app.run(host="0.0.0.0", port=8000)
