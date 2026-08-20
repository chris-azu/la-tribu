from flask import Blueprint, request, jsonify
import mysql.connector
from app import get_db

products_bp = Blueprint('products', __name__)


@products_bp.route('', methods=['GET'])
def get_products():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = "SELECT * FROM productos WHERE 1=1"
        params = []

        category = request.args.get('category')
        if category:
            query += " AND categoria_id = (SELECT id FROM categorias WHERE slug = %s)"
            params.append(category)

        featured = request.args.get('featured')
        if featured == 'true':
            query += " AND destacado = TRUE"

        available = request.args.get('available')
        if available != 'false':
            query += " AND disponible = TRUE"

        cursor.execute(query, params)
        products = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM productos WHERE id = %s", (product_id,))
        product = cursor.fetchone()
        cursor.close()
        db.close()
        if product:
            return jsonify(product)
        return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@products_bp.route('', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            """INSERT INTO productos (nombre, slug, descripcion, descripcion_corta, precio,
               categoria_id, imagen, modelo_glb, modelo_usdz, disponible, destacado)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (data['name'], data.get('slug', ''), data.get('description', ''),
             data.get('short_description', ''), data['price'], data.get('category_id'),
             data.get('image', ''), data.get('model_glb', ''), data.get('model_usdz', ''),
             data.get('available', True), data.get('featured', False))
        )
        db.commit()
        new_id = cursor.lastrowid
        cursor.close()
        db.close()
        return jsonify({"id": new_id, "message": "Product created"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@products_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        fields = []
        params = []
        for key in ['nombre', 'slug', 'descripcion', 'descripcion_corta', 'precio',
                     'categoria_id', 'imagen', 'modelo_glb', 'modelo_usdz',
                     'modelo_status', 'modelo_job_id', 'disponible', 'destacado',
                     'deleted_at']:
            api_key = key.replace('descripcion_corta', 'short_description').replace('_', '_')
            if api_key in data or key in data:
                val = data.get(api_key, data.get(key))
                fields.append(f"{key} = %s")
                params.append(val)
        if not fields:
            return jsonify({"error": "No fields to update"}), 400
        params.append(product_id)
        cursor.execute(f"UPDATE productos SET {', '.join(fields)} WHERE id = %s", params)
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Product updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Soft delete: set deleted_at timestamp. Products are never hard-deleted immediately."""
    try:
        from datetime import datetime
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE productos SET deleted_at = %s WHERE id = %s AND deleted_at IS NULL",
            (datetime.now(), product_id)
        )
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Product moved to trash"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@products_bp.route('/<int:product_id>/restore', methods=['POST'])
def restore_product(product_id):
    """Restore a soft-deleted product."""
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE productos SET deleted_at = NULL WHERE id = %s AND deleted_at IS NOT NULL",
            (product_id,)
        )
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Product restored"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@products_bp.route('/<int:product_id>/permanent', methods=['DELETE'])
def permanent_delete_product(product_id):
    """Permanent delete: remove product and associated 3D model files."""
    try:
        import os
        db = get_db()
        cursor = db.cursor(dictionary=True)

        # Get product to find associated files
        cursor.execute("SELECT imagen, modelo_glb, modelo_usdz FROM productos WHERE id = %s", (product_id,))
        product = cursor.fetchone()

        if product:
            # Delete associated files from disk
            from config import PRODUCTS_UPLOAD, MODELS_UPLOAD
            for field in ['imagen', 'modelo_glb', 'modelo_usdz']:
                if product.get(field):
                    filepath = os.path.join('..', product[field])
                    if os.path.exists(filepath):
                        os.remove(filepath)

        cursor.execute("DELETE FROM productos WHERE id = %s", (product_id,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Product permanently deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
