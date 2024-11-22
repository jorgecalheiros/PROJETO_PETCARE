from django.urls import path
from .pages import *

urlpatterns = [
    path('bemvindo', BemVindoView.as_view(), name='bem_vindo'),  # Página inicial
    path('cadastrar/conta', CadastrarContaView.as_view(), name="cadastrar_conta"),
    path('cadastrar/informacoes', CadastrarInfoView.as_view(), name="cadastrar_info"),
    path('cadastrado', CadastradoComSucessoView.as_view(), name="cadastrado_com_sucesso"),
    path('login', LoginView.as_view(), name="login"),
    path('', InicioView.as_view(), name="inicio"),
    path('cadastrar/pet', CadastrarPetView.as_view(), name="cadastrar_pet")
]
