import re
with open('public/index.php', 'r', encoding='utf-8') as f:
    html = f.read()
idx = html.find('id="cms-module-selector"')
print(html[idx-50:idx+600].encode('ascii', 'ignore').decode('ascii'))

