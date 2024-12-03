from .base_pet_viewset import BasePetAuthenticatedViewSet, mixins, Response, status, action
from ...serializers import PetSerializer, PetSaveSerializer, PetDetailSerializer
from ....models import MedicalHistory, Consultation

class PetViewSet(BasePetAuthenticatedViewSet, mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
    def get_serializer_class(self):
        actions = {
            "list": PetSerializer,
            "retrieve": PetDetailSerializer
        }
        return actions.get(self.action, PetSaveSerializer)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)
        
        medical_history = MedicalHistory.objects.create()
        
        pet_saved = serializer.save(owner = self._get_owner_authenticated(), medical_history = medical_history)
        
        if pet_saved:
            return Response(serializer.data, status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    
    @action(detail=False, methods=['get'], url_path='buscartodasconsultas')
    def buscartodasconsultas(self, request):
        pets = self.get_queryset()
        medical_histories = MedicalHistory.objects.filter(pet__in=pets)
        consultations = Consultation.objects.filter(medical_history__in=medical_histories)

        consultations_data = [
            {
                'id': consultation.id,
                'reason': consultation.reason,
                'date': consultation.date,
                'vet': consultation.vet.name,
                'clinic': consultation.clinic.name,
                'address': {
                    'cep': consultation.clinic.address.cep,
                    'city': consultation.clinic.address.city,
                    'state': consultation.clinic.address.state,
                },
                'medical_history': consultation.medical_history.id,
                 'pet': {
                    'id': consultation.medical_history.pet.id,
                    'name': consultation.medical_history.pet.name,
                    'species': consultation.medical_history.pet.species,
                    'race': consultation.medical_history.pet.race,
                    'age': consultation.medical_history.pet.age,
                    'weight': consultation.medical_history.pet.weight
                }
            } for consultation in consultations
        ]

        return Response(consultations_data, status=status.HTTP_200_OK)
        
    
    