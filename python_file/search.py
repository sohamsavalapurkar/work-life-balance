import sys
import requests
from bs4 import BeautifulSoup
try:
    from googlesearch import search
    
except ImportError:
    print("No module named 'google' found")
 
# to search
query = ' '.join(sys.argv[1:])
for j in search(query, tld="co.in", num=10, stop=10, pause=2):
    try:
        reqs = requests.get(j)
        soup = BeautifulSoup(reqs.text, 'html.parser')
        for title in soup.find_all('title'):
            temp = title.get_text()
            break
        if temp == '' or temp == '403 Forbidden':
            print(f'{j},{j}')
        else:
            print(f'{temp},{j}')
    except:
        pass
