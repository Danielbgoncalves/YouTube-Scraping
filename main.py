from googleapiclient.discovery import build
import pandas as pd
import re
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer
import json
import sys
import os

stop_words = ['a', 'do', 'e', 'de', 'em', 'que', 'um', 'para', 'na', 'no', "mais", "menos", "da", "como", "uma", "por", "se", "ou"]
api_key = os.getenv('API_KEY')
youtubeApiKey = os.getenv("YOUTUBE_API_KEY")
youtube = build('youtube','v3', developerKey=youtubeApiKey)

#limpeza da descrição
def limpar_texto(texto):
  texto = re.sub(r'http\S+', '', texto) # r faz ignorar caracteres de escape como \n, http é o inio da string q deve ser tratada, \S+ indica que o q vem depois dela tambem deev ser ignorado até encontrarmos um espaço em branco, '' é o q substituirá o q tiramos
  texto = re.sub(r'[^a-zA-Z\s]', '', texto) # \s faz incluir espaço em branco
  texto = texto.lower()
  return texto

def gerar_topicos(texto):
  vectorizer = CountVectorizer(stop_words=stop_words)
  vetores_palavras = vectorizer.fit_transform(texto)

  lda = LatentDirichletAllocation(n_components=5, random_state=42)
  lda.fit(vetores_palavras)

  for i, topic in enumerate(lda.components_):
    top_palavras = [vectorizer.get_feature_names_out()[index] for index in topic.argsort()[-10:]]
  return top_palavras

def getPlaylistId(url):
  inicio = url.find("list=")
  inicio +=5
  urlId = url[inicio:inicio + 34]
  return urlId

def obter_playlist_dataFrame(complet_url):
  playlist_videos = []
  nextPage_token = None
  playlistId = getPlaylistId(complet_url) 

  while True:
    res = youtube.playlistItems().list(part='snippet', playlistId=playlistId, maxResults=50, pageToken=nextPage_token).execute()
    playlist_videos += res['items']
    
    nextPage_token = res.get('nestPageToken')

    if nextPage_token is None:
      break
    
  videosIDs = list (map( lambda x: x['snippet']['resourceId']['videoId'], playlist_videos))
  videosTitle = list(map( lambda x: x['snippet']['title'], playlist_videos))
  videosDescription = list(map( lambda x: x['snippet']['description'], playlist_videos))
  videosDescription_clean = list(map (lambda x: limpar_texto(x), videosDescription))
  videosDatepublished = list(map( lambda x: x['snippet']['publishedAt'], playlist_videos))

  stats = []

  for id in videosIDs:
    res = youtube.videos().list(part='statistics', id=id).execute()
    stats += res['items']

  videos_viewCount = list (map( lambda x: x['statistics']['viewCount'], stats))
  videos_likeCount = list (map( lambda x: x['statistics']['likeCount'], stats))
  videos_commentCount = list (map( lambda x: x['statistics']['commentCount'], stats))

  data = {
    'title': videosTitle,
    'description': videosDescription_clean,
    'views': videos_viewCount,
    'likes': videos_likeCount,
    'comments': videos_commentCount,
    'published at': videosDatepublished,
    'id': videosIDs
  }

  df = pd.DataFrame(data)
  topicos = gerar_topicos(videosDescription_clean)

  df_json = df.to_json(orient="records")
  topicos_json = json.dumps(topicos)
  print(json.dumps({"data":df_json, "topicos": topicos_json}))
  return df, topicos

obter_playlist_dataFrame(sys.argv[1])
#obter_playlist_dataFrame("https://www.youtube.com/watch?v=fq4-UXcVh5E&list=PLLksQWY1ipSiJlmy0WvM0x5i1O74ctwaY&pp=iAQB")






















