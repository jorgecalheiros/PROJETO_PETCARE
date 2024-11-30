from .base_serializer import *
from .vet_serializer import VetSaveSerializer, VetSerializer
from .address_serializer import AddressSerializer
from ...models import Clinic

class ClinicAndVetSaveSerializer(BaseModelSerializer):
    vet = VetSaveSerializer(read_only=True)
    address = AddressSerializer(read_only=True)
    class Meta(BaseModelSerializer.Meta):
        model = Clinic

class ClinicSerializer(BaseModelSerializer):
    address = AddressSerializer(read_only=True)
    vets = VetSerializer(read_only=True, many=True)
    class Meta(BaseModelSerializer.Meta):
        model = Clinic
        

    