from ..base_viewset import *
from ....models import Pet

class BasePetAuthenticatedViewSet(BaseAuthenticatedViewSet):
    def get_queryset(self):
        return Pet.objects.filter(owner = self._get_owner_authenticated())