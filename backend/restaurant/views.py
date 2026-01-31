from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TableSession,Table,Category
from .serializers import TableSessionSerializer,CategoryWithItemsSerializer


class ActiveSessionByTable(APIView):
    def get(self,request,table_number):
        try:
            table = Table.objects.get(number=table_number)
        except Table.DoesNotExist:
            return Response({"error":"Table not exist."},status=status.HTTP_404_NOT_FOUND)

        session = TableSession.objects.filter(table=table,active=True).first()

        if not session:
            return Response({"active":False},status=status.HTTP_200_OK)
        
        serializer = TableSessionSerializer(session)
        return Response({"active":True,"session":serializer.data},status=status.HTTP_200_OK)



class StartSessionView(APIView):

    def post(self,request):
        table_number = request.data.get('table_number')
        customer_name = request.data.get('customer_name',None)

        if not table_number or not customer_name:
            return Response({"error":"table_number and customer_name are required."},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            table = Table.objects.get(number=table_number)
        
        except Table.DoesNotExist:
            return Response({"error":"Table does not exist."},status=status.HTTP_404_NOT_FOUND)
        
        active_session = TableSession.objects.filter(table=table,active=True).first()

        if active_session:
            serializer = TableSessionSerializer(active_session)
            return Response(serializer.data,status=status.HTTP_200_OK)
        
        if not customer_name:
            return Response({"error":"customer_name is required for new session."},status=status.HTTP_400_BAD_REQUEST)

        session = TableSession.objects.create(table=table,customer_name=customer_name)

        serializer = TableSessionSerializer(session)

        return Response(serializer.data,status=status.HTTP_201_CREATED)


class MenuView(APIView):
    
    def get(self,request):

        token = request.headers.get('Authorization')
        if not token:
            return Response({"error":"Authorization token is required."},status=status.HTTP_401_UNAUTHORIZED)
        token = token.replace('Token','').strip()

        try:
            session = TableSession.objects.get(token=token,active=True)

        except TableSession.DoesNotExist:
            return Response({"error":"Invalid or inactive session token."},status=status.HTTP_401_UNAUTHORIZED)

        categories = Category.objects.all()
        serializer = CategoryWithItemsSerializer(categories,many=True)

        response_data = {
            "customer_name":session.customer_name,
            "categories":serializer.data
        }

        return Response(response_data,status=status.HTTP_200_OK)
    
