from flask import Blueprint, request, jsonify
from app import get_db

categories_bp = Blueprint('categories', __name__)


@categories_bp.route('', methods=['GET'])
def get_categories():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM categorias WHERE activa = TRUE ORDER BY orden")
        categories = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(categories)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@categories_bp.route('', methods=['POST'])
def create_category():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO categorias (nombre, slug, descripcion, imagen, orden, activa) VALUES (%s, %s, %s, %s, %s, %s)",
            (data['name'], data.get('slug', ''), data.get('description', ''),
             data.get('image', ''), data.get('order', 0), data.get('active', True))
        )
        db.commit()
        new_id = cursor.lastrowid
        cursor.close()
        db.close()
        return jsonify({"id": new_id, "message": "Category created"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@categories_bp.route('/<int:cat_id>', methods=['PUT'])
def update_category(cat_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE categorias SET nombre=%s, slug=%s, descripcion=%s, imagen=%s, activa=%s WHERE id=%s",
            (data.get('name', ''), data.get('slug', ''), data.get('description', ''),
             data.get('image', ''), data.get('active', True), cat_id)
        )
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Category updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@categories_bp.route('/<int:cat_id>', methods=['DELETE'])
def delete_category(cat_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM categorias WHERE id = %s", (cat_id,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Category deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
