from rest_framework import serializers
from .models import Table, Category, MenuItem, Order, OrderItem, TableSession

class TableSerializer(serializers.ModelSerializer):

    class Meta:
        model = Table
        fields = '__all__'



class MenuItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = MenuItem
        fields = ('id','name','image','description','price','is_available')


class CategoryWithItemsSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = ('id','name','description','items')
    
    def get_items(self,obj):
        items = MenuItem.objects.filter(category=obj,is_available=True)
        return MenuItemSerializer(items,many=True).data
    

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id','menu_item','quantity','price')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True,read_only=True)

    class Meta:
        model = Order
        fields = ('id','table','session','status','payment_method','total_price','updated_at','created_at','items')

class TableSessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = TableSession
        fields = ('token','customer_name','table','active','created_at')



