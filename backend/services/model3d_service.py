from app import get_db
from config import AI3D_API_KEY, AI3D_PROVIDER
from providers.ai3d_provider import get_provider


def start_generation(product_id, image_url):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """INSERT INTO modelos_3d (producto_id, estado, proveedor, imagen_original)
           VALUES (%s, 'procesando', %s, %s)""",
        (product_id, AI3D_PROVIDER, image_url)
    )
    db.commit()
    model_id = cursor.lastrowid
    cursor.close()
    db.close()

    provider = get_provider(AI3D_PROVIDER)

    try:
        job_id = provider.generate(image_url, product_id)

        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE modelos_3d SET job_id = %s WHERE id = %s",
            (job_id, model_id)
        )
        db.commit()
        cursor.close()
        db.close()

        return {
            "id": model_id,
            "job_id": job_id,
            "status": "procesando",
            "message": "3D generation started"
        }
    except Exception as e:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE modelos_3d SET estado = 'error', error_mensaje = %s WHERE id = %s",
            (str(e), model_id)
        )
        db.commit()
        cursor.close()
        db.close()
        return {"id": model_id, "status": "error", "error": str(e)}


def get_status(model_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM modelos_3d WHERE id = %s", (model_id,))
    model = cursor.fetchone()
    cursor.close()
    db.close()

    if not model:
        return {"error": "Model not found"}

    if model['estado'] == 'procesando' and model['job_id']:
        provider = get_provider(model['proveedor'])
        try:
            result = provider.check_status(model['job_id'])
            if result.get('status') == 'completed':
                db = get_db()
                cursor = db.cursor()
                cursor.execute(
                    "UPDATE modelos_3d SET estado = 'completado', modelo_glb = %s, modelo_usdz = %s WHERE id = %s",
                    (result.get('glb_url', ''), result.get('usdz_url', ''), model_id)
                )
                db.commit()
                cursor.close()
                db.close()
                model['estado'] = 'completado'
        except Exception:
            pass

    return model
