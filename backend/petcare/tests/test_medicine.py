import pytest
from django.utils.timezone import now, timedelta
from petcare.models import Medicine, MedicineType, MedicalHistory 

@pytest.mark.django_db
def test_criacao_medicamento_valido():
    """Teste de criação de um medicamento válido."""
    # Criando os registros necessários para as relações
    tipo_medicamento = MedicineType.objects.create(name="Antibiótico")
    historico_medico = MedicalHistory.objects.create(patient_name="João Silva", diagnosis="Infecção")

    # Criando o medicamento
    medicamento = Medicine.objects.create(
        medicine_type=tipo_medicamento,
        name="Amoxicilina",
        date_application=now(),
        date_reinforcement=now() + timedelta(days=7),
        details="Aplicar após as refeições.",
        medical_history=historico_medico
    )

    # Verificando os dados salvos
    assert medicamento.id is not None
    assert medicamento.medicine_type == tipo_medicamento
    assert medicamento.name == "Amoxicilina"
    assert medicamento.details == "Aplicar após as refeições."
    assert medicamento.medical_history == historico_medico

@pytest.mark.django_db
def test_medicamento_sem_detalhes():
    """Teste de criação de medicamento sem preencher o campo opcional 'details'."""
    tipo_medicamento = MedicineType.objects.create(name="Vacina")
    historico_medico = MedicalHistory.objects.create(patient_name="Maria Oliveira", diagnosis="Alergia")

    medicamento = Medicine.objects.create(
        medicine_type=tipo_medicamento,
        name="Vacina da Gripe",
        date_application=now(),
        date_reinforcement=now() + timedelta(days=365),
        details=None,
        medical_history=historico_medico
    )

    # Verificando que o campo 'details' pode ser nulo
    assert medicamento.id is not None
    assert medicamento.details is None

@pytest.mark.django_db
def test_medicamento_sem_campos_obrigatorios():
    """Teste de falha ao criar medicamento sem preencher campos obrigatórios."""
    tipo_medicamento = MedicineType.objects.create(name="Analgésico")
    historico_medico = MedicalHistory.objects.create(patient_name="Carlos Mendes", diagnosis="Dor crônica")

    with pytest.raises(Exception):
        Medicine.objects.create(
            medicine_type=None,  # Campo obrigatório ausente
            name="Paracetamol",
            date_application=now(),
            date_reinforcement=now() + timedelta(days=1),
            medical_history=historico_medico
        )

    with pytest.raises(Exception):
        Medicine.objects.create(
            medicine_type=tipo_medicamento,
            name="",  # Nome vazio
            date_application=now(),
            date_reinforcement=now() + timedelta(days=1),
            medical_history=historico_medico
        )

@pytest.mark.django_db
def test_relacao_medicamentos_historico():
    """Teste de relação entre histórico médico e medicamentos."""
    tipo_medicamento = MedicineType.objects.create(name="Antibiótico")
    historico_medico = MedicalHistory.objects.create(patient_name="Ana Paula", diagnosis="Infecção grave")

    # Criando dois medicamentos para o mesmo histórico médico
    medicamento1 = Medicine.objects.create(
        medicine_type=tipo_medicamento,
        name="Cefalexina",
        date_application=now(),
        date_reinforcement=now() + timedelta(days=10),
        medical_history=historico_medico
    )

    medicamento2 = Medicine.objects.create(
        medicine_type=tipo_medicamento,
        name="Azitromicina",
        date_application=now(),
        date_reinforcement=now() + timedelta(days=5),
        medical_history=historico_medico
    )

    # Verificando a relação reversa
    medicamentos = historico_medico.medicines.all()
    assert len(medicamentos) == 2
    assert medicamento1 in medicamentos
    assert medicamento2 in medicamentos
