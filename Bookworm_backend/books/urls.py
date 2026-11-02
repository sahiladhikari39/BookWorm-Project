from django.urls import path, include
from .views import book_list, book_list_detail

urlpatterns = [
    path('list/', book_list),
    path('list/<int:pk>', book_list_detail, name='book-detail'),
]