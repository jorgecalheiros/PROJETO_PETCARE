from ..base_viewset import *
from ...serializers import ClinicSerializer
from ....models import Clinic
from django.db.models import Q

class ClinicAuthenticatedViewSet(BaseAuthenticatedViewSet, mixins.RetrieveModelMixin):
    queryset = Clinic.objects.all()
    
    def get_serializer_class(self):
        return ClinicSerializer
    
    
    @action(detail=False, methods=['get'], url_path="buscarclinicasproximas")
    def buscarclinicasproximas(self, request):
        owner = self._get_owner_authenticated()
        
        owner_city = owner.address.city
        owner_state = owner.address.state
        
        # Buscando clínicas na mesma cidade e estado
        clinics = Clinic.objects.filter(
            Q(address__city=owner_city) & Q(address__state=owner_state)
        )
        
        if not clinics.exists():
            return Response({'message': 'Nenhuma clínica encontrada próxima.'}, status=404)
        
        # Serializando os dados das clínicas encontradas
        serializer = self.get_serializer(clinics, many=True)
        return Response(serializer.data, status=200)