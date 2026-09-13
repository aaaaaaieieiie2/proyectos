import re

path = 'assets/js/cms.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace variables in string concatenations
content = content.replace('t.emoji +', 'esc(t.emoji) +')
content = content.replace('b.emoji ||', 'esc(b.emoji) ||')
content = content.replace('x.emoji +', 'esc(x.emoji) +')
content = content.replace('\'<option value="\' + t.id + \'">\'', '\'<option value="\' + esc(t.id) + \'">\'')
content = content.replace('\'<option value="\' + b.id + \'">\'', '\'<option value="\' + esc(b.id) + \'">\'')
content = content.replace('\'<option value="\' + x.id + \'">\'', '\'<option value="\' + esc(x.id) + \'">\'')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('cms.js patched')
