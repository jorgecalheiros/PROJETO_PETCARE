# Generated by Django 5.1.3 on 2024-11-26 12:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('petcare', '0011_alter_medicine_details'),
    ]

    operations = [
        migrations.AddField(
            model_name='vet',
            name='phone',
            field=models.CharField(max_length=13, null=True),
        ),
    ]