import pytest
from django.db.utils import IntegrityError
from petcare.models import Address  

@pytest.mark.django_db
def test_criacao_endereco():
    # Dados de exemplo para criação de um endereço
    endereco = Address.objects.create(
        city="São Paulo",
        state="SP",
        country="Brasil",
        cep="12345678"
    )

    # Verifica se o objeto foi salvo no banco de dados
    assert endereco.id is not None
    assert endereco.city == "São Paulo"
    assert endereco.state == "SP"
    assert endereco.country == "Brasil"
    assert endereco.cep == "12345678"
