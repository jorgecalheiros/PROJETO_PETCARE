# Generated by Django 5.1.2 on 2024-11-06 00:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('petcare', '0005_illnessstatus_medicinetype_surgerystatus_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='pet',
            name='weight',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=4),
        ),
        migrations.AlterField(
            model_name='clinic',
            name='cnpj',
            field=models.CharField(max_length=14),
        ),
    ]