# Generated by Django 5.1.3 on 2024-12-03 04:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('petcare', '0016_alter_clinic_cnpj'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pet',
            name='medical_history',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='pet', to='petcare.medicalhistory'),
        ),
        migrations.AlterField(
            model_name='vet',
            name='clinic',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='vets', to='petcare.clinic'),
        ),
    ]
