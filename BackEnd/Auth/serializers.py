from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["user_id", "username", "email", "first_name", "last_name", "user_type"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)


    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "user_type"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            user_type=validated_data.get("user_type", "customer"),
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        # Try to find the user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        # Authenticate using username internally
        user = authenticate(username=user.username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password")

        data["user"] = user
        return data

class ProfileSerializer(serializers.ModelSerializer):
    purchase_history = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "user_id",
            "username",
            "email",
            "user_type",
            "billing_address",
            "purchase_history",
        ]
        read_only_fields = ["purchase_history"]

        def get_purchase_history(self, obj):
          orders = obj.Orders.all()
          return [
            {
                "id": order.id,
                "date": order.created_at.strftime("%Y-%m-%d"),
                "items" : [
                    {"name": item.product_name, "qty": item.quantity}
                    for item in order.items.all()
                ],
                "total": order.total_amount,
            }
            for order in orders
        ]

    