from rest_framework import serializers
from .models import Table, Category, MenuItem, Order, OrderItem, TableSession
from decimal import Decimal,ROUND_HALF_UP

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
    

class TableSessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = TableSession
        fields = ('token','customer_name','table','active','created_at')



class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True) # to show items inside cart

    menu_item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.filter(is_available=True),
        source="menu_item",
        write_only=True
    ) # to add items inside cart

    class Meta:
        model = OrderItem
        fields = ('id','menu_item','menu_item_id','quantity','price')
        read_only_fields = ('price',)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ('id','table_session','status','total_price','created_at','items')
        read_only_fields = ('total_price','status','table_session','created_at')
    
    def create(self,validated_data):
        items_data=validated_data.pop('items')
        
        order = Order.objects.create(total_price=Decimal("0.00"),status='pending',**validated_data)
        total_price = Decimal("0.00")

        for item_data in items_data:
            menu_item = item_data['menu_item']
            quantity = Decimal(item_data['quantity'])
            price = (menu_item.price * quantity).quantize(
                    Decimal("0.00"),
                    rounding=ROUND_HALF_UP
                    )

            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=int(quantity),
                price=price
            )
            total_price +=price
        
        order.total_price = total_price.quantize(
                    Decimal("0.00"),
                    rounding=ROUND_HALF_UP
        )

        order.save()

        return order








