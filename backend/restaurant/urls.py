from django.urls import path
from .views import StartSessionView,MenuView,ActiveSessionByTable,AddOrderView,MyOrdersView

urlpatterns = [
    path('session/active/<int:table_number>',ActiveSessionByTable.as_view(),name="active-session"),
    path('session/start',StartSessionView.as_view(),name='start-session'),
    path('menu/',MenuView.as_view(),name='menu'),
    path('add-order',AddOrderView.as_view(),name='add-order'),
    path('my-order',MyOrdersView.as_view(),name='my-orders')
]