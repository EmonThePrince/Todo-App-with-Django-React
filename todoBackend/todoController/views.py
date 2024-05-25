from rest_framework.response import Response
from .serializers import postSerializer
from .models import Todo
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login, logout
from rest_framework.request import Request
from django.views.decorators.csrf import csrf_exempt

# Todo handling
@csrf_exempt
@api_view(['GET','POST','PUT'])
def requestToApi(request):
    if not request.user.is_authenticated:
        return Response({'error': 'You are not logged in'}, status=401)
    data = Todo.objects.filter(user=request.user)
    seri = postSerializer(data, many = True)

    if request.method == 'GET':
        return Response(seri.data)
    
    elif request.method == 'POST':
        dataSeri = postSerializer(data=request.data)
        if dataSeri.is_valid():
            dataSeri.save()
            return Response(dataSeri.data, status=status.HTTP_201_CREATED)
        else:
            return Response(dataSeri.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        todo_id = request.data.get('id')
        try:
            todo_instance = Todo.objects.get(id=todo_id)
        except Todo.DoesNotExist:
            return Response({"error": "Todo item not found"})

        dataSeri = postSerializer(todo_instance, data=request.data)
        if dataSeri.is_valid():
            dataSeri.save()
            return Response(dataSeri.data)
        return Response(dataSeri.errors)
    

@api_view(['DELETE'])
def deleteTodo(request,id):
    try:
        todo_instance = Todo.objects.get(id=id)
    except Todo.DoesNotExist:
        return Response({"error": "Todo item not found"})
    todo_instance.delete()
    return Response({"message": "Todo item deleted successfully"})

@api_view(['GET'])
def getTodo(request, id):
    try:
        todo_instance = Todo.objects.get(id = id)
        seri = postSerializer(todo_instance)
    except Todo.DoesNotExist:
        return Response({"error": "Todo item not found"})
    return Response(seri.data)

# To know the current user id
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({'id': user.id, 'username': user.username})



#authentication using normal django authentication
@api_view(['POST'])
def register(request: Request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not (username and email and password):
        return Response({"error": "Missing required fields"}, status=400)

    try:
        user = User.objects.create_user(username, email, password)
        if user is not None:
            return Response({"message": "User registered and logged in successfully!"})
        else:
            return Response({"error": "Invalid Credentials!"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def login_view(request):
    try:
        username = request.data.get("username")
        password = request.data.get("password")

        if not (username and password):
            return Response({"error": "Missing username or password"}, status=400)

        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({"message": "User logged in successfully"},status=200)
        else:
            return Response({"error": "Invalid credentials"}, status=401)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def logout_view(request):
    logout(request)  
    return Response({"message": "Logout success!"})


# users
# {
#     "username": "john",
#     "email": "lennon@thebeatles.com",
#     "password": "johnpassword"
# }
