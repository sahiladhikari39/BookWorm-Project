from django.db import models

# Create your models here.

class Book(models.Model):

    STATUS_CHOICES = [
        ("WANT_TO_READ", "Want to read"),
        ("READING", "Reading"),
        ("COMPLETED", "Completed")
    ]

    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    description = models.TextField()
    published_year = models.IntegerField()
    reading_status = models.CharField(max_length=12, choices = STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
