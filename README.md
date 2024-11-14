# YouTube-Scraping
 
O programa usa da API do Youtube para fazer uma busca pela playlist informada pelo link dado pelo usuário. 

Python para fazer a comunicação com o Youtube e tratar os dados usando o Skilearn e a tabela é criada com uso de uso de Pandas.


## Parte do código do backend

```python
def gerar_topicos(texto):
  vectorizer = CountVectorizer(stop_words=stop_words)
  vetores_palavras = vectorizer.fit_transform(texto)

  lda = LatentDirichletAllocation(n_components=5, random_state=42)
  lda.fit(vetores_palavras)

  for i, topic in enumerate(lda.components_):
    top_palavras = [vectorizer.get_feature_names_out()[index] for index in topic.argsort()[-10:]]
  return top_palavras
```

## 🚀 Sobre mim

Estudante de Ciência da Computação em Uberlândia, me contrata.

## Usado por

Esse projeto é usado pelas seguintes empresas:
- Eu
- Eu mesmo
