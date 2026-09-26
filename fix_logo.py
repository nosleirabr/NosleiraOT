import base64

img_path = r'C:\Users\ariel\.gemini\antigravity\brain\5920ead5-a9d5-4569-a28a-85e3e91bba4a\.user_uploaded\media_1790351666964.png'
html_path = r'C:\Users\ariel\.gemini\antigravity\brain\5920ead5-a9d5-4569-a28a-85e3e91bba4a\flyer_ademicon.html'

with open(img_path, 'rb') as f:
    encoded = base64.b64encode(f.read()).decode('utf-8')
    data_uri = f'data:image/png;base64,{encoded}'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace old URI
old_uri = 'file:///C:/Users/ariel/.gemini/antigravity/brain/5920ead5-a9d5-4569-a28a-85e3e91bba4a/.user_uploaded/media_1790351354178.png'
html = html.replace(old_uri, data_uri)

# Fix email capitalization
html = html.replace('arielsonx3@hotmail.com', 'Arielsonx3@hotmail.com')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print('Logo embedded successfully!')
