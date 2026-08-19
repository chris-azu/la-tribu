from flask import Blueprint, request, jsonify
from app import get_db
from config import WHATSAPP_NUMBER

config_bp = Blueprint('config', __name__)


@config_bp.route('', methods=['GET'])
def get_config():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT clave, valor FROM configuracion")
        rows = cursor.fetchall()
        cursor.close()
        db.close()
        config = {row['clave']: row['valor'] for row in rows}
        config['whatsapp_number'] = WHATSAPP_NUMBER
        return jsonify(config)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@config_bp.route('', methods=['PUT'])
def update_config():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        for key, value in data.items():
            cursor.execute(
                "INSERT INTO configuracion (clave, valor) VALUES (%s, %s) ON DUPLICATE KEY UPDATE valor = %s",
                (key, value, value)
            )
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Configuration updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
