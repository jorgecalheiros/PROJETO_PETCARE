from django.shortcuts import render

prefix = 'pages'

def inicio(request):
    return render(request, f'{prefix}/inicio.html')

def buscarclinicas(request):
    return render(request, f'{prefix}/buscarclinicas.html')
   
def buscarclinicas_por_id(request, id):
    return render(request, f'{prefix}/clinica_detail.html')
    
def mostrarconsultas(request):
    return render(request, f"{prefix}/consultas.html")