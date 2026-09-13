with open('public/index.php', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'map-container' in line or 'page-tours' in line or 'id="map"' in line:
            print('Line', i+1, line.strip()[:100])
