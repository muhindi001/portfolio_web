from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0007_project"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="category",
            field=models.CharField(
                choices=[
                    ("data_science", "Data Science"),
                    ("web_development", "Web Development"),
                ],
                default="data_science",
                max_length=20,
            ),
        ),
    ]
