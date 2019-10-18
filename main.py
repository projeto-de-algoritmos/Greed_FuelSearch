# -*- coding: utf-8 -*
import heapq

# Defining temporary model data

lista = {"Origem1": [{"destino1": [("posto1", 2.0), ("posto2", 5.0)]}, {"destino2": [("posto3", 80.0), ("posto4", 50.0)]}]
                    ,"Origem2": [{"destino12": [("posto12", 2.0), ("posto22", 5.0)]}, {"destino22": [("posto32", 80.0), ("posto42", 50.0)]}]
                    }

def imprime_lista():
    for origem in lista:
        print("\nOrigem : " , origem)
        print("Destinos :  \n")
        for i in range(len(lista[origem])):
            for destino in (lista[origem])[i]:
                print("-", destino)
                print("\nPostos:\n")
                for j in range(len(((lista[origem])[i])[destino])):
                    posto, distancia = (((lista[origem])[i])[destino])[j]
                    print(posto, "-", distancia, "km")



def build_heap(breakpoints):
    heap_elts = [(item[1], item) for item in breakpoints]
    heapq.heapify(heap_elts)

    # Imprime Heap
    while len(heap_elts) > 0:
        print(heapq.heappop(heap_elts)[1])


def get_destiny_data(origem, wanted_destino):
    for i in range(len(lista[origem])):
        for destino in (lista[origem])[i]:
            if destino == wanted_destino:
                 return ((lista[origem])[i])[destino] ## Retorna vetor de tuplas (postos e distâncias)


# Com a mudança, receberá apenas o vetor final de postos

def select_breakpoints_algorithm(origem, destino):
    # Pega os postos que existem entre origem e destino com suas distâncias
    postos = get_destiny_data(origem, destino)
    # Ordena pelos menores valores
    build_heap(postos)
    breakpoints_selected = {}
    current_location = 0

    # while (current_location !=  bn)
    # let p be largest integer such that bp x + C
    # if (bp = x)
    # return "no solution"
    # x bp
    # S S {p}
    # return S

def main():
    select_breakpoints_algorithm("Origem2", "destino22")
main()
