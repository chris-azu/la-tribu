from flask import Blueprint, request, jsonify
from app import get_db
from services.model3d_service import start_generation, get_status

models3d_bp = Blueprint('models3d', __name__)


@models3d_bp.route('/generate', methods=['POST'])
def generate_model():
    """Start 3D model generation from an uploaded image.
    Body: { product_id: int, image_url: string }
    Returns: { id, job_id, status: 'pending' }
    """
    try:
        data = request.get_json()
        product_id = data.get('product_id')
        image_url = data.get('image_url')

        if not product_id:
            return jsonify({"error": "product_id required"}), 400
        if not image_url:
            return jsonify({"error": "image_url required"}), 400

        result = start_generation(product_id, image_url)
        return jsonify(result), 202
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@models3d_bp.route('/upload-and-generate', methods=['POST'])
def upload_and_generate():
    """Upload an image and start generation in one step.
    Form data: product_id (int), image (file)
    Returns: { id, job_id, status: 'pending' }
    """
    try:
        product_id = request.form.get('product_id')
        image_file = request.files.get('image')

        if not product_id:
            return jsonify({"error": "product_id required"}), 400
        if not image_file:
            return jsonify({"error": "image file required"}), 400

        # Save uploaded image
        import os
        from config import PRODUCTS_UPLOAD
        filename = f"product_{product_id}_{image_file.filename}"
        filepath = os.path.join(PRODUCTS_UPLOAD, filename)
        image_file.save(filepath)

        image_url = f"/uploads/products/{filename}"

        result = start_generation(int(product_id), image_url)
        return jsonify(result), 202
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@models3d_bp.route('/status/<int:model_id>', methods=['GET'])
def check_status(model_id):
    """Check generation status.
    Returns: { id, estado, modelo_glb, modelo_usdz, job_id, error_mensaje }
    """
    try:
        result = get_status(model_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@models3d_bp.route('/regenerate', methods=['POST'])
def regenerate_model():
    """Regenerate a failed model.
    Body: { id: int }
    """
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


@models3d_bp.route('/product/<int:product_id>', methods=['GET'])
def get_product_models(product_id):
    """Get all 3D models associated with a product."""
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM modelos_3d WHERE producto_id = %s ORDER BY created_at DESC",
            (product_id,)
        )
        models = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(models)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
