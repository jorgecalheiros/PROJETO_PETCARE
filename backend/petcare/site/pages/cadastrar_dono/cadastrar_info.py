from django.shortcuts import render
from django.views import View

class CadastrarInfoView(View):
    def get(self, request):
        return render(request, 'pages/cadastrar_info.html')
