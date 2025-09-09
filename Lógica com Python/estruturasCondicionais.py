""" 
> maior q
< menor q
== igual a
!= diferente de 
>= maior ou igual 
<= menor ou igual """

""" ESTRUTURA SWITCH
switch (diasDaSemana){
caso1:
    mostrar "Domingo"
    parar
caso2:
    mostrar "Segunda-feira"
    parar
}
"""


""" Exercicio 1: 
Crie uma variavel idade
Escreva um program que: 
    Mostre "pode entrar" se idade for > 18
    Mostre "Acesso negado" se idade for < 18
idade = 17
if idade >= 18:
    print("Pode entrar.")
else:
    print("Acesso negado.")    
 """



""" Exercicio 2
1. Se a tempora for maior que 30, mostre "Está quente!"
temperatura = 40
if temperatura > 30: 
    print("Está quente!")
else:
    print("Está normal")   


2. SE a nota do aluno for menor que 5, mostre "Preciso melhorar."
nota = 7
if nota < 5: 
    print("Precisa melhorar!")
else:{
    print(" Sua nota foi: " + str(nota) + ". Parabéns, você é um bom aluno.")
}
 




"""


""" EXERCICIOS COM SWITCH 
Crie um programa que leia uma variavel opcao e exiba:
1 - Iniciar
2 - Configuraçoes
3 - Sair
* Qualquer outro - Opcao invalida. 

"""

opcao = 4

if opcao == 1: 
 print("Iniciar")
elif opcao == 2:
 print("Configurações")
elif opcao == 3:
 print (" Sair")
else:
 print("Opção Invalida")