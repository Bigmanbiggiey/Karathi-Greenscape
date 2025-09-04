from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminorVendor(BasePermission):
    """
    Allows access only to admins or vendors for write operations.
    Customers can only read.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.user_type in ["admin", "vendor"]
    
class IsOwnerorAdmin(BasePermission):
    """
    Customers can only view their own orders.
    Admins/Vendors can view all orders.
    """ 

    def has_object_permission(self, request, view, obj):
        if request.user.user_type in ["admin", "vendor"]:
            return True
        return obj.user == request.user
    