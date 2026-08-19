import os
import mysql.connector
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, SECRET_KEY

app = Flask(__name__, static_folder='..', static_url_path='')
CORS(app)
app.secret_key = SECRET_KEY


def get_db():
    return mysql.connector.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        autocommit=True
    )


try:
    conn = get_db()
    conn.close()
    print("[OK] Database connection successful")
except Exception as e:
    print(f"[WARN] Database not available: {e}")
    print("[INFO] Running with frontend mock data only")


from routes.products import products_bp
from routes.categories import categories_bp
from routes.config import config_bp
from routes.models3d import models3d_bp

app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(categories_bp, url_prefix='/api/categories')
app.register_blueprint(config_bp, url_prefix='/api/config')
app.register_blueprint(models3d_bp, url_prefix='/api/3d')


@app.route('/')
def index():
    return send_from_directory('..', 'index.html')


@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('..', path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
