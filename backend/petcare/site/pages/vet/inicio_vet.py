from django.shortcuts import render
from django.views import View

class InicioVetView(View):
    def get(self, request):
        return render(request, 'pages/inicio_vet.html')
