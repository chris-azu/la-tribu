from flask import Blueprint, request, jsonify
from app import get_db
from services.model3d_service import start_generation, get_status

models3d_bp = Blueprint('models3d', __name__)


@models3d_bp.route('/generate', methods=['POST'])
def generate_model():
    try:
        data = request.get_json()
        product_id = data.get('product_id')
        image_url = data.get('image_url')

        if not product_id or not image_url:
            return jsonify({"error": "product_id and image_url required"}), 400

        result = start_generation(product_id, image_url)
        return jsonify(result), 202
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@models3d_bp.route('/status/<int:model_id>', methods=['GET'])
def check_status(model_id):
    try:
        result = get_status(model_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@models3d_bp.route('/regenerate', methods=['POST'])
def regenerate_model():
    try:
        data = request.get_json()
        model_id = data.get('id')
        if not model_id:
            return jsonify({"error": "id required"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM modelos_3d WHERE id = %s", (model_id,))
        model = cursor.fetchone()
        cursor.close()
        db.close()

        if not model:
            return jsonify({"error": "Model not found"}), 404

        result = start_generation(model['producto_id'], model['imagen_original'])
        return jsonify(result), 202
    except Exception as e:
        return jsonify({"error": str(e)}), 500
