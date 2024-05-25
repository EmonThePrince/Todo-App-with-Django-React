from django.db import models
from django.contrib.auth.models import User

class Todo(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.CharField(max_length=50)
    date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    completed = models.BooleanField(default=False)
    def __str__(self):
        return self.text
    