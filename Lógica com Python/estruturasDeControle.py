""" LAÇOS 
Loop » repete a conduição ate q ela seja FALSA
    for » quando sabemos o numero de repetiçoes 

    
Enquanto o contador(i) estiver entre 1 e 6
    for i in range(1,6)
    print (i)

    i = 0
for i in range(1, 10):
    if i ==4 : break
    print(i)
                

    while » quando NAO sabemos o numero de repetiçoes 
        contador = 1 
        while contador <= 5:
            print(contador)
            contador += 1
    
    


senha = ""
while senha != "1234":
    senha = input("Senha incorreta, digite a senha: ")

print("Acesso liberado.")     
contador = 1

while contador <= 10:
    print(contador)
    contador += 1 

soma = 0
for i in range(1, 101):
    soma += i
print("A soma de todos os numeros de 1 a 100 é : ", soma) 

"""


""" ARRAYS E COLEÇÕES

frutas = ["maçã", "banana", "laranja"]

print(frutas[0]) 
print(frutas[2])


dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
print(dias[6])


frutas = []
frutas.append("Maçã")
frutas.append("Banana")
frutas.append("Goiaba") 

frutas.remove("Maçã")

print(frutas)

"""




