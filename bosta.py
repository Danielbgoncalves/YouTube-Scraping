link = input("Cole o link do YouTube\n=>")
print(f"Voce digitou: \'{link}\'")

inicio = link.find("list=")
print(f"A parte a retirar é {inicio}")
inicio +=5
final = link[inicio:inicio + 37]
print(f"A parte final é {final}")