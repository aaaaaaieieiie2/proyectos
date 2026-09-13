import re
with open('public/index.php', 'r', encoding='utf-8') as f:
    html = f.read()
idx = html.find('transfer-modal')
end = html.find('</div>\n</div>\n</div>', idx)
print(html[idx:end+20].encode('ascii', 'ignore').decode('ascii'))

