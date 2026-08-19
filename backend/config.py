import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = int(os.getenv('DB_PORT', 3306))
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'la_tribu')

SECRET_KEY = os.getenv('SECRET_KEY', 'la-tribu-secret-change-in-production')
WHATSAPP_NUMBER = os.getenv('WHATSAPP_NUMBER', '5491123456789')
AI3D_API_KEY = os.getenv('AI3D_API_KEY', '')
AI3D_PROVIDER = os.getenv('AI3D_PROVIDER', 'meshy')

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'uploads')
PRODUCTS_UPLOAD = os.path.join(UPLOAD_FOLDER, 'products')
MODELS_UPLOAD = os.path.join(UPLOAD_FOLDER, 'models')

for d in [UPLOAD_FOLDER, PRODUCTS_UPLOAD, MODELS_UPLOAD]:
    os.makedirs(d, exist_ok=True)
