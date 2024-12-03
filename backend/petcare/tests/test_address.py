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

@pytest.mark.django_db
def test_cep_invalido():
    # Testa a criação com um CEP inválido
    with pytest.raises(IntegrityError):
        Address.objects.create(
            city="Rio de Janeiro",
            state="RJ",
            country="Brasil",
            cep="123"  # CEP inválido
        )
