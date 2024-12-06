import pytest
import os
from django.core.files.uploadedfile import SimpleUploadedFile
from petcare.models import Owner, Address
from authentication.models import Account


@pytest.mark.django_db
def test_criacao_owner_com_dados_validos():
    """Teste de criação de um proprietário com dados válidos."""
    # Criando os registros necessários
    endereco = Address.objects.create(city="São Paulo", state="SP", country="Brasil", cep="12345678")
    conta = Account.objects.create(username="joao", email="joao@email.com", password="senha123")

    # Simulando o upload de uma imagem
    imagem = SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")

    # Criando o proprietário
    owner = Owner.objects.create(
        name="João Silva",
        photo=imagem,
        cpf="12345678901",
        phone="11999999999",
        address=endereco,
        account=conta
    )

    # Verificando os dados salvos
    assert owner.id is not None
    assert owner.name == "João Silva"
    assert owner.photo.name.startswith("images/")
    assert owner.cpf == "12345678901"
    assert owner.phone == "11999999999"
    assert owner.address == endereco
    assert owner.account == conta


@pytest.mark.django_db
def test_cpf_unico():
    """Teste para garantir que o CPF é único."""
    endereco1 = Address.objects.create(city="Rio de Janeiro", state="RJ", country="Brasil", cep="87654321")
    conta1 = Account.objects.create(username="maria", email="maria@email.com", password="senha123")

    Owner.objects.create(
        name="Maria Oliveira",
        cpf="11111111111",
        phone="21999999999",
        address=endereco1,
        account=conta1
    )

    # Tentativa de criar um segundo proprietário com o mesmo CPF
    endereco2 = Address.objects.create(city="Belo Horizonte", state="MG", country="Brasil", cep="11223344")
    conta2 = Account.objects.create(username="ana", email="ana@email.com", password="senha123")

    with pytest.raises(Exception):
        Owner.objects.create(
            name="Ana Souza",
            cpf="11111111111",  # CPF duplicado
            phone="31999999999",
            address=endereco2,
            account=conta2
        )


@pytest.mark.django_db
def test_save_altera_imagem():
    """Teste para verificar a substituição de uma imagem existente."""
    endereco = Address.objects.create(city="Curitiba", state="PR", country="Brasil", cep="44556677")
    conta = Account.objects.create(username="carlos", email="carlos@email.com", password="senha123")

    # Upload inicial de uma imagem
    imagem1 = SimpleUploadedFile("image1.jpg", b"file_content", content_type="image/jpeg")
    owner = Owner.objects.create(
        name="Carlos Mendes",
        photo=imagem1,
        cpf="22222222222",
        phone="41999999999",
        address=endereco,
        account=conta
    )

    # Substituindo a imagem
    imagem2 = SimpleUploadedFile("image2.jpg", b"new_file_content", content_type="image/jpeg")
    owner.photo = imagem2
    owner.save()

    # Verificando se a imagem antiga foi excluída e a nova foi salva
    assert owner.photo.name.startswith("images/")
    assert owner.photo.name.endswith("image2.jpg")


@pytest.mark.django_db
def test_delete_owner_remove_dependencias():
    """Teste para verificar se a exclusão de um proprietário remove a imagem e o endereço."""
    endereco = Address.objects.create(city="Florianópolis", state="SC", country="Brasil", cep="99887766")
    conta = Account.objects.create(username="lucas", email="lucas@email.com", password="senha123")

    imagem = SimpleUploadedFile("image_to_delete.jpg", b"file_content", content_type="image/jpeg")
    owner = Owner.objects.create(
        name="Lucas Almeida",
        photo=imagem,
        cpf="33333333333",
        phone="48999999999",
        address=endereco,
        account=conta
    )

    # Salvando os caminhos antes de deletar
    photo_path = owner.photo.path
    address_id = owner.address.id

    # Deletando o proprietário
    owner.delete()

    # Verificando se a imagem foi excluída
    assert not os.path.exists(photo_path)

    # Verificando se o endereço foi excluído
    assert not Address.objects.filter(id=address_id).exists()
