import pytest
from petcare.models import Vet, Clinic
from authentication.models import Account  


@pytest.mark.django_db
def test_criacao_vet_valido():
    """Teste de criação de um veterinário com dados válidos."""
    # Criando registros relacionados
    conta = Account.objects.create(username="dr_joao", email="joao@vetclinic.com", password="senha123")
    clinica = Clinic.objects.create(name="VetClinic", cnpj="12345678000199")

    # Criando o veterinário
    vet = Vet.objects.create(
        name="Dr. João Silva",
        phone="11999999999",
        account=conta,
        specialization="Cirurgia Veterinária",
        clinic=clinica
    )

    # Verificando os dados salvos
    assert vet.id is not None
    assert vet.name == "Dr. João Silva"
    assert vet.phone == "11999999999"
    assert vet.account == conta
    assert vet.specialization == "Cirurgia Veterinária"
    assert vet.clinic == clinica


@pytest.mark.django_db
def test_vet_campos_obrigatorios():
    """Teste para verificar a ausência de campos obrigatórios."""
    conta = Account.objects.create(username="dra_maria", email="maria@vetclinic.com", password="senha123")

    # Tentativa de criar um veterinário sem nome
    with pytest.raises(Exception):
        Vet.objects.create(
            name=None,  # Nome ausente
            phone="21999999999",
            account=conta,
            specialization="Dermatologia Veterinária"
        )

    # Tentativa de criar um veterinário sem especialização
    with pytest.raises(Exception):
        Vet.objects.create(
            name="Dra. Maria Oliveira",
            phone="21999999999",
            account=conta,
            specialization=None  # Especialização ausente
        )


@pytest.mark.django_db
def test_vet_account_unico():
    """Teste para garantir que uma conta só pode ser associada a um veterinário."""
    conta = Account.objects.create(username="dr_carlos", email="carlos@vetclinic.com", password="senha123")
    clinica = Clinic.objects.create(name="AnimalCare", cnpj="98765432000122")

    # Criando o primeiro veterinário
    Vet.objects.create(
        name="Dr. Carlos Mendes",
        phone="31999999999",
        account=conta,
        specialization="Anestesiologia",
        clinic=clinica
    )

    # Tentativa de criar um segundo veterinário com a mesma conta
    with pytest.raises(Exception):
        Vet.objects.create(
            name="Dr. Pedro Albuquerque",
            phone="31988888888",
            account=conta,  # Conta duplicada
            specialization="Radiologia",
            clinic=clinica
        )


@pytest.mark.django_db
def test_vet_relacionamento_clinica():
    """Teste para verificar o relacionamento de múltiplos veterinários com uma clínica."""
    clinica = Clinic.objects.create(name="PetLife", cnpj="22334455000166")

    conta1 = Account.objects.create(username="dr_ana", email="ana@vetclinic.com", password="senha123")
    conta2 = Account.objects.create(username="dr_pedro", email="pedro@vetclinic.com", password="senha123")

    # Criando dois veterinários para a mesma clínica
    vet1 = Vet.objects.create(
        name="Dra. Ana Costa",
        phone="21999999999",
        account=conta1,
        specialization="Cardiologia Veterinária",
        clinic=clinica
    )

    vet2 = Vet.objects.create(
        name="Dr. Pedro Souza",
        phone="21988888888",
        account=conta2,
        specialization="Ortopedia Veterinária",
        clinic=clinica
    )

    # Verificando os veterinários associados à clínica
    veterinarios = clinica.vets.all()
    assert len(veterinarios) == 2
    assert vet1 in veterinarios
    assert vet2 in veterinarios
