# shop/serializers.py
from rest_framework import serializers
from .models import Product, ProductVariant, Order, OrderItem, AuditLog


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "product", "price", "stock"]


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "description", "category", "variants", "created_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(),
        source="variant",
        write_only=True,
    )

    class Meta:
        model = OrderItem
        fields = ["id", "variant", "variant_id", "quantity"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ["id", "user", "items", "status", "total_price", "created_at"]
        read_only_fields = ["id", "user", "total_price", "created_at", "status"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)

        total_price = 0
        for item in items_data:
            variant = item["variant"]
            quantity = item["quantity"]
            OrderItem.objects.create(order=order, variant=variant, quantity=quantity)
            total_price += variant.price * quantity

        order.total_price = total_price
        order.save()
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)

