from .base_vet_viewset import *
from ....models import Clinic
from ...serializers import ClinicSerializer, AddressSerializer, VetSaveSerializer, AccountCreateSerializer

class VetClinicViewSet(BaseVetAuthenticatedViewSet, mixins.UpdateModelMixin, mixins.RetrieveModelMixin):
    def get_serializer_class(self):
        actions = {
            "adicionar_veterinario" : VetSaveSerializer
        }
        return actions.get(self.action, ClinicSerializer)
    
    def get_queryset(self):
        return Clinic.objects.filter(id = self._get_vet_authenticated().clinic.id)
    
    def update(self, request, *args, **kwargs):
        address_data = request.data.get('address', {})
        address_serializer = AddressSerializer(data=address_data, instance=self.get_queryset().first().address)
        clinic_serializer = self.get_serializer(data=request.data, instance=self.get_queryset().first())
        
        address_serializer.is_valid(raise_exception=True)
        clinic_serializer.is_valid(raise_exception=True)
        
        address_saved = address_serializer.save()
        clinic_serializer.save(address = address_saved)
        
        return Response(clinic_serializer.data, status.HTTP_202_ACCEPTED)
    
    @action(detail=True, methods=['post'], url_name="add-vet", url_path="addvet")
    def adicionar_veterinario(self, request, pk: None):
        current_clinic = self.get_queryset().filter(id = pk).first()
        account_data = request.data.get('account',{})
        
        vet_serializer = self.get_serializer(data=request.data)
        account_serializer = AccountCreateSerializer(data=account_data)
        
        
        account_serializer.is_valid(raise_exception=True)
        vet_serializer.is_valid(raise_exception=True)    
        
        account_saved = account_serializer.save()
        vet_serializer.save(clinic = current_clinic, account=account_saved)
        

        return Response(vet_serializer.data, status.HTTP_201_CREATED)
        
    
    