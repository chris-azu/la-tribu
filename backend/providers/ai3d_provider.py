import requests
from config import AI3D_API_KEY


class AI3DProvider:
    def generate(self, image_url, product_id):
        raise NotImplementedError

    def check_status(self, job_id):
        raise NotImplementedError


class MeshyProvider(AI3DProvider):
    API_URL = "https://api.meshy.ai/v2"

    def generate(self, image_url, product_id):
        if not AI3D_API_KEY:
            raise ValueError("AI3D_API_KEY not configured")

        response = requests.post(
            f"{self.API_URL}/image-to-3d",
            headers={
                "Authorization": f"Bearer {AI3D_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "image_url": image_url,
                "enable_pbr": True,
                "topology": "triangle",
                "target_polycount": 30000
            },
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        return data.get('result', {}).get('id', '')

    def check_status(self, job_id):
        if not AI3D_API_KEY:
            raise ValueError("AI3D_API_KEY not configured")

        response = requests.get(
            f"{self.API_URL}/image-to-3d/{job_id}",
            headers={"Authorization": f"Bearer {AI3D_API_KEY}"},
            timeout=30
        )
        response.raise_for_status()
        data = response.json()

        status_map = {
            'PENDING': 'pendiente',
            'IN_PROGRESS': 'procesando',
            'COMPLETED': 'completed',
            'FAILED': 'error'
        }

        return {
            'status': status_map.get(data.get('status', ''), data.get('status')),
            'glb_url': data.get('model_urls', {}).get('glb', ''),
            'usdz_url': data.get('model_urls', {}).get('usdz', '')
        }


class TripoProvider(AI3DProvider):
    def generate(self, image_url, product_id):
        raise NotImplementedError("Tripo provider not yet implemented")

    def check_status(self, job_id):
        raise NotImplementedError("Tripo provider not yet implemented")


class RodinProvider(AI3DProvider):
    def generate(self, image_url, product_id):
        raise NotImplementedError("Rodin provider not yet implemented")

    def check_status(self, job_id):
        raise NotImplementedError("Rodin provider not yet implemented")


def get_provider(name='meshy'):
    providers = {
        'meshy': MeshyProvider,
        'tripo': TripoProvider,
        'rodin': RodinProvider
    }
    provider_class = providers.get(name, MeshyProvider)
    return provider_class()
