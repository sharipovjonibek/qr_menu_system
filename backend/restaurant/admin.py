from django.contrib import admin
from .models import Table, Category, MenuItem, Order, OrderItem, TableSession

# Register your models here.
admin.site.register(Table)
admin.site.register(Category)
admin.site.register(MenuItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(TableSession)