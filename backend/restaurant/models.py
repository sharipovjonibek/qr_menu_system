from django.db import models
import uuid
# Create your models here.


class Table(models.Model):
    number = models.IntegerField(unique=True)

    def __str__(self):
        return f"Table - {self.number}"
    

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True,blank=True)

    def __str__(self):
        return self.name
    

class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="menu_images/",null=True,blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    category = models.ForeignKey('Category',on_delete=models.CASCADE)
    is_available = models.BooleanField(default=True)


    def __str__(self):
        return self.name
    
    
class Order(models.Model):
    table_session = models.ForeignKey('TableSession',on_delete=models.CASCADE,null=True,blank=True)
    status = models.CharField(choices=[('pending','pending'),('preparing','preparing'),('served','served')])
    payment_method = models.CharField(choices=[('cash','cash'),('card','card')],null=True,blank=True)
    total_price = models.DecimalField(max_digits=16,decimal_places=2)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE,related_name='items')
    menu_item = models.ForeignKey(MenuItem,on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10,decimal_places=2)


class TableSession(models.Model):
    table = models.ForeignKey(Table,on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100,null=True,blank=True)

    token = models.CharField(max_length=255,unique=True,null=True,blank=True)

    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True,blank=True)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = str(uuid.uuid4())
        super().save(*args, **kwargs)




