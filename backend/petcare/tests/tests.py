from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from petcare.models import Owner, Gender

class ClinicNotAuthenticatedViewSetTestCase(APITestCase):
    def test_create_clinic(self):
        url = reverse('clinic-notauthenticated-list')  # Baseado no nome registrado na rota
        data = {
                "vet": {
                    "account": {
                    "email": "felipe@gmail.com",
                    "password": "12345678"
                    },
                    "name": "Felipe",
                    "phone": "5512991584288",
                    "specialization": "Assistente"
                },
                "address": {
                    "city": "Jacareí",
                    "state": "SP",
                    "country": "Brasil",
                    "cep": "12308061"
                },
                "name": "Clínica São Francisco",
                "cnpj": "08924375000150"
            }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('name', response.data)
        
class OwnerViewSetTestCase(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="securepassword"
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        self.url = reverse('owner-list') 
    
    def test_create_owner_success(self):
        data ={
            "address": {
                "city": "Jacareí",
                "state": "SP",
                "country": "Brasil",
                "cep": "12308061"
            },
            "name": "Felipe",
            "cpf": "41192909054",
            "phone": "5512991584288"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('name', response.data)


class PetViewSetTestCase(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="securepassword"
        )
        self.owner = Owner.objects.create(account=self.user)
    
        Gender.objects.create(id=1, description="Macho")
        
        self.client.force_authenticate(user=self.user)
        
        self.url = reverse('pet-list')
    
    def test_create_pet_success(self):
        data = {
            "name": "Rex",
            "species": "Cachorro",
            "race": "Boder Clay",
            "age": 9,
            "weight": "30.5",
            "gender": 1
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('name', response.data)
