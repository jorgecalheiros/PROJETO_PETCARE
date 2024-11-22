# Generated by Django 5.1.2 on 2024-11-05 04:25

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('petcare', '0004_remove_vet_email_vet_account'),
    ]

    operations = [
        migrations.CreateModel(
            name='IllnessStatus',
            fields=[
                ('id', models.IntegerField(editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(max_length=155)),
            ],
        ),
        migrations.CreateModel(
            name='MedicineType',
            fields=[
                ('id', models.IntegerField(editable=False, primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=155)),
            ],
        ),
        migrations.CreateModel(
            name='SurgeryStatus',
            fields=[
                ('id', models.IntegerField(editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(max_length=155)),
            ],
        ),
        migrations.CreateModel(
            name='Consultation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('reason', models.TextField()),
                ('date', models.DateTimeField()),
                ('clinic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='petcare.clinic')),
                ('medical_history', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='queries', to='petcare.medicalhistory')),
                ('vet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='petcare.vet')),
            ],
        ),
        migrations.CreateModel(
            name='Illness',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('symptoms', models.TextField(null=True)),
                ('description', models.TextField(null=True)),
                ('date_diagnosis', models.DateTimeField()),
                ('medical_history', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='illnesses', to='petcare.medicalhistory')),
                ('illness_status', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='petcare.illnessstatus')),
            ],
        ),
        migrations.CreateModel(
            name='Medicine',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('date_application', models.DateTimeField()),
                ('date_reinforcement', models.DateTimeField()),
                ('details', models.TextField(null=True)),
                ('medical_history', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medicines', to='petcare.medicalhistory')),
                ('medicine_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='petcare.medicinetype')),
            ],
        ),
        migrations.CreateModel(
            name='Surgery',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('details', models.TextField(null=True)),
                ('date', models.DateTimeField()),
                ('medical_history', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='surgeries', to='petcare.medicalhistory')),
                ('surgery_status', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='petcare.surgerystatus')),
            ],
        ),
    ]
