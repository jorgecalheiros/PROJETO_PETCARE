import pytest
from petcare.models import Pet, Owner, Gender, MedicalHistory  


@pytest.mark.django_db
def test_criacao_pet_valido():
    """Teste de criação de um animal de estimação com dados válidos."""
    # Criando registros relacionados
    gender = Gender.objects.create(description="Macho", id=1)
    owner = Owner.objects.create(
        name="João Silva",
        cpf="12345678901",
        phone="11999999999"
    )
    medical_history = MedicalHistory.objects.create()

    # Criando o pet
    pet = Pet.objects.create(
        name="Rex",
        species="Cachorro",
        race="Labrador",
        age=5,
        weight=20.50,
        gender=gender,
        owner=owner,
        medical_history=medical_history
    )

    # Verificando os dados salvos
    assert pet.id is not None
    assert pet.name == "Rex"
    assert pet.species == "Cachorro"
    assert pet.race == "Labrador"
    assert pet.age == 5
    assert pet.weight == 20.50
    assert pet.gender == gender
    assert pet.owner == owner
    assert pet.medical_history == medical_history


@pytest.mark.django_db
def test_pet_campos_obrigatorios():
    """Teste para verificar a ausência de campos obrigatórios."""
    gender = Gender.objects.create(description="Fêmea", id=1)
    owner = Owner.objects.create(
        name="Maria Oliveira",
        cpf="98765432100",
        phone="21999999999"
    )
    medical_history = MedicalHistory.objects.create()

    # Tentativa de criar um pet sem nome
    with pytest.raises(Exception):
        Pet.objects.create(
            name=None,  # Nome ausente
            species="Gato",
            race="Persa",
            age=3,
            weight=4.20,
            gender=gender,
            owner=owner,
            medical_history=medical_history
        )

    # Tentativa de criar um pet sem peso
    with pytest.raises(Exception):
        Pet.objects.create(
            name="Bella",
            species="Gato",
            race="Persa",
            age=3,
            weight=None,  # Peso ausente
            gender=gender,
            owner=owner,
            medical_history=medical_history
        )


@pytest.mark.django_db
def test_pet_relacionamentos():
    """Teste para verificar os relacionamentos com `Owner`, `Gender` e `MedicalHistory`."""
    gender = Gender.objects.create(description="Macho", id=1)
    owner = Owner.objects.create(
        name="Carlos Santos",
        cpf="11223344556",
        phone="31999999999"
    )
    medical_history = MedicalHistory.objects.create()

    # Criando o pet
    pet = Pet.objects.create(
        name="Thor",
        species="Cachorro",
        race="Bulldog",
        age=4,
        weight=25.75,
        gender=gender,
        owner=owner,
        medical_history=medical_history
    )

    # Verificando os relacionamentos
    assert pet.gender.description == "Macho"
    assert pet.owner.name == "Carlos Santos"


@pytest.mark.django_db
def test_pet_exclusao_relacionamentos():
    """Teste para verificar a integridade referencial ao excluir registros relacionados."""
    gender = Gender.objects.create(description="Fêmea", id=1)
    owner = Owner.objects.create(
        name="Ana Paula",
        cpf="55667788990",
        phone="41999999999"
    )
    medical_history = MedicalHistory.objects.create()

    # Criando o pet
    pet = Pet.objects.create(
        name="Mila",
        species="Gato",
        race="Siamês",
        age=6,
        weight=5.10,
        gender=gender,
        owner=owner,
        medical_history=medical_history
    )

    # Excluindo o owner e verificando a exclusão do pet
    owner.delete()
    assert not Pet.objects.filter(name="Mila").exists()

    # Excluindo o medical_history e verificando que ele foi removido
    assert not MedicalHistory.objects.filter(pet__name="Mila").exists()
