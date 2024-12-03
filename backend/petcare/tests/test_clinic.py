import pytest
from petcare.models import Clinic, Address 

@pytest.mark.django_db
def test_criacao_clinica_com_endereco():
    """Teste de criação de uma clínica associada a um endereço válido."""
    # Criação de um endereço
    endereco = Address.objects.create(
        city="São Paulo",
        state="SP",
        country="Brasil",
        cep="12345678"
    )

    # Criação de uma clínica associada ao endereço
    clinica = Clinic.objects.create(
        name="Clínica Saúde",
        cnpj="12345678000199",
        address=endereco
    )

    # Verifica se os dados foram corretamente salvos
    assert clinica.id is not None
    assert clinica.name == "Clínica Saúde"
    assert clinica.cnpj == "12345678000199"
    assert clinica.address == endereco

@pytest.mark.django_db
def test_clinica_cnpj_unico():
    """Teste para garantir que o CNPJ é único."""
    # Criação do primeiro registro
    endereco1 = Address.objects.create(
        city="Rio de Janeiro",
        state="RJ",
        country="Brasil",
        cep="87654321"
    )
    Clinic.objects.create(
        name="Clínica Bem-Estar",
        cnpj="11111111000111",
        address=endereco1
    )

    # Tentativa de criar uma clínica com o mesmo CNPJ
    endereco2 = Address.objects.create(
        city="Belo Horizonte",
        state="MG",
        country="Brasil",
        cep="11223344"
    )

    with pytest.raises(Exception):
        Clinic.objects.create(
            name="Clínica Vida",
            cnpj="11111111000111",  # Mesmo CNPJ
            address=endereco2
        )

@pytest.mark.django_db
def test_clinica_sem_endereco():
    """Teste de criação de clínica sem endereço."""
    clinica = Clinic.objects.create(
        name="Clínica Simples",
        cnpj="22222222000122",
        address=None
    )

    # Verifica que a clínica foi criada mesmo sem endereço
    assert clinica.id is not None
    assert clinica.address is None
