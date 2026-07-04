import json
import os
from PIL import Image, ImageDraw

TILE_SIZE = 32
tiles = {
    'empty': (0, 0, 0, 0), # transparent
    'grass': (34, 197, 94),
    'grass2': (22, 163, 74),
    'path': (212, 163, 115),
    'path2': (196, 149, 106),
    'wall': (71, 85, 105),
    'wall_top': (51, 65, 85),
    'floor': (254, 243, 199),
    'floor2': (253, 230, 138),
    'door': (146, 64, 14),
    'bench': (120, 53, 15),
    'desk': (161, 98, 7),
    'board': (30, 58, 95),
    'chair': (124, 58, 237),
    'table': (133, 77, 14),
    'stage': (124, 45, 18),
    'flower': (251, 113, 133),
    'tree': (22, 101, 52),
    'water': (14, 165, 233),
    'bookshelf': (68, 64, 60),
    'path_1_3': (0, 0, 0, 0),
    'path_1_4': (0, 0, 0, 0),
    'path_2_2': (0, 0, 0, 0),
    'path_2_0': (0, 0, 0, 0),
    'path_2_4': (0, 0, 0, 0),
    'path_2_3': (0, 0, 0, 0),
    'path_3_1': (0, 0, 0, 0),
    'path_1_1': (0, 0, 0, 0),
    'path_3_2': (0, 0, 0, 0),
    'path_1_2': (0, 0, 0, 0),
}

tile_names = list(tiles.keys())
# Create spritesheet
cols = 5
rows = (len(tile_names) + cols - 1) // cols
img = Image.new('RGBA', (cols * TILE_SIZE, rows * TILE_SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

try:
    garden_sheet = Image.open('stuff/school_garden_sprites.png')
    custom_tiles = {
        'grass': garden_sheet.crop((0, 3*32, 32, 4*32)),
        'grass2': garden_sheet.crop((0, 4*32, 32, 5*32)),
        'path': garden_sheet.crop((0, 0, 32, 32)),
        'path2': garden_sheet.crop((0, 1*32, 32, 2*32)),
        'path_1_3': garden_sheet.crop((1*32, 3*32, 2*32, 4*32)),
        'path_1_4': garden_sheet.crop((1*32, 4*32, 2*32, 5*32)),
        'path_2_2': garden_sheet.crop((2*32, 2*32, 3*32, 3*32)),
        'path_2_0': garden_sheet.crop((2*32, 0*32, 3*32, 1*32)),
        'path_2_4': garden_sheet.crop((2*32, 4*32, 3*32, 5*32)),
        'path_2_3': garden_sheet.crop((2*32, 3*32, 3*32, 4*32)),
        'path_3_1': garden_sheet.crop((3*32, 1*32, 4*32, 2*32)),
        'path_1_1': garden_sheet.crop((1*32, 1*32, 2*32, 2*32)),
        'path_3_2': garden_sheet.crop((3*32, 2*32, 4*32, 3*32)),
        'path_1_2': garden_sheet.crop((1*32, 2*32, 2*32, 3*32))
    }
except Exception as e:
    custom_tiles = {}

for i, name in enumerate(tile_names):
    if name == 'empty': continue
    x = (i % cols) * TILE_SIZE
    y = (i // cols) * TILE_SIZE
    if name in custom_tiles:
        img.paste(custom_tiles[name], (x, y))
    else:
        color = tiles[name]
        draw.rectangle([x, y, x + TILE_SIZE - 1, y + TILE_SIZE - 1], fill=color, outline=(0, 0, 0, 20))

os.makedirs('assets/sprites', exist_ok=True)
os.makedirs('assets/tilemaps', exist_ok=True)
img.save('assets/sprites/tileset.png')

def make_tiled_json(width, height, ground_layer, object_layer):
    # Convert string grids to 1D arrays of 1-based tile IDs
    def grid_to_data(grid):
        data = []
        for r in range(height):
            for c in range(width):
                tile_name = grid[r][c]
                tile_id = tile_names.index(tile_name) + 1 if tile_name in tile_names else 0
                data.append(tile_id)
        return data

    return {
        "compressionlevel": -1,
        "height": height,
        "infinite": False,
        "layers": [
            {
                "data": grid_to_data(ground_layer),
                "height": height,
                "id": 1,
                "name": "Ground",
                "opacity": 1,
                "type": "tilelayer",
                "visible": True,
                "width": width,
                "x": 0,
                "y": 0
            },
            {
                "data": grid_to_data(object_layer),
                "height": height,
                "id": 2,
                "name": "Objects",
                "opacity": 1,
                "type": "tilelayer",
                "visible": True,
                "width": width,
                "x": 0,
                "y": 0
            }
        ],
        "nextlayerid": 3,
        "nextobjectid": 1,
        "orientation": "orthogonal",
        "renderorder": "right-down",
        "tiledversion": "1.10.1",
        "tileheight": 32,
        "tilesets": [
            {
                "columns": cols,
                "firstgid": 1,
                "image": "../sprites/tileset.png",
                "imageheight": rows * 32,
                "imagewidth": cols * 32,
                "margin": 0,
                "name": "tileset",
                "spacing": 0,
                "tilecount": len(tile_names),
                "tileheight": 32,
                "tilewidth": 32
            }
        ],
        "tilewidth": 32,
        "type": "map",
        "version": "1.10",
        "width": width
    }

W, H = 20, 15

def is_solid(name):
    return name in ['wall', 'wall_top', 'bench', 'desk', 'board', 'table', 'chair', 'tree', 'water', 'bookshelf']

def build_layers(base_grid, fallback='grass'):
    ground = [['empty']*W for _ in range(H)]
    objs = [['empty']*W for _ in range(H)]
    for r in range(H):
        for c in range(W):
            tile = base_grid[r][c]
            if is_solid(tile) or tile == 'door':
                ground[r][c] = fallback
                objs[r][c] = tile
            else:
                ground[r][c] = tile
                objs[r][c] = 'empty'
    return ground, objs

# 1. Garden
garden_grid = [['grass' if (r+c)%7 != 0 else 'grass2' for c in range(W)] for r in range(H)]
for c in range(W): garden_grid[0][c] = 'wall'; garden_grid[H-1][c] = 'wall'
for r in range(H): garden_grid[r][0] = 'wall'; garden_grid[r][W-1] = 'wall'
for c in range(2, 18): garden_grid[7][c] = 'path'
for r in range(1, 7): garden_grid[r][10] = 'path'

garden_grid[7][2] = 'path_1_3'
garden_grid[8][2] = 'path_1_4'
for c in range(3, 10): garden_grid[7][c] = 'path_2_2'
for c in range(3, 17): garden_grid[8][c] = 'path_2_0'

garden_grid[8][18] = 'path_2_4'
garden_grid[7][17] = 'path_2_3'
for c in range(12, 17): garden_grid[7][c] = 'path_2_2'
for r in range(1, 7): garden_grid[r][10] = 'path_3_1'
for r in range(1, 7): garden_grid[r][11] = 'path_1_1'
garden_grid[7][10] = 'path_3_2'
garden_grid[7][11] = 'path_1_2'
for r, c in [(3,3), (3,4), (4,3), (11,15), (11,16), (12,16)]: garden_grid[r][c] = 'flower'
for r, c in [(2,2), (2,17), (12,2), (4,15), (10,5)]: garden_grid[r][c] = 'tree'
for r, c in [(10,13), (10,14), (11,13), (11,14)]: garden_grid[r][c] = 'water'
for r, c in [(6,5), (6,14), (8,8), (5,10)]: garden_grid[r][c] = 'bench'
garden_grid[0][10] = 'door'
g_grnd, g_obj = build_layers(garden_grid, 'grass')
with open('assets/tilemaps/garden.json', 'w') as f:
    json.dump(make_tiled_json(W, H, g_grnd, g_obj), f)

# 2. Corridor
cor_grid = [['floor' for _ in range(W)] for _ in range(H)]
for c in range(W): cor_grid[0][c] = 'wall_top'; cor_grid[H-1][c] = 'wall'
for r in range(H): cor_grid[r][0] = 'wall'; cor_grid[r][W-1] = 'wall'
for c in range(1, W-1): cor_grid[1][c] = 'wall_top'; cor_grid[5][c] = 'wall'
for c in [5,6,14,15]: cor_grid[5][c] = 'floor'
for r in range(2, 5):
    for c in range(1, W-1):
        if c % 3 == 0: cor_grid[r][c] = 'floor2'
for r, c in [(8,2), (8,3), (8,4), (10,2), (10,3), (12,2), (12,3)]: cor_grid[r][c] = 'bookshelf'
cor_grid[1][10] = 'board'
cor_grid[H-1][10] = 'door'
cor_grid[0][5] = 'door'
cor_grid[0][15] = 'door'
cor_grid[H-1][3] = 'door'
c_grnd, c_obj = build_layers(cor_grid, 'floor')
with open('assets/tilemaps/corridor.json', 'w') as f:
    json.dump(make_tiled_json(W, H, c_grnd, c_obj), f)

# 3. Classroom
cls_grid = [['floor' for _ in range(W)] for _ in range(H)]
for c in range(W): cls_grid[0][c] = 'wall_top'; cls_grid[H-1][c] = 'wall'
for r in range(H): cls_grid[r][0] = 'wall'; cls_grid[r][W-1] = 'wall'
cls_grid[1][9] = 'board'; cls_grid[1][10] = 'board'; cls_grid[1][11] = 'board'
cls_grid[3][10] = 'desk'
for row in range(3):
    for col in range(4):
        cls_grid[6 + row*2][4 + col*3] = 'desk'
        cls_grid[7 + row*2][4 + col*3] = 'chair'
for r in range(2, H-1):
    for c in range(1, W-1):
        if cls_grid[r][c] == 'floor' and (r+c)%5 == 0: cls_grid[r][c] = 'floor2'
cls_grid[H-1][10] = 'door'
cl_grnd, cl_obj = build_layers(cls_grid, 'floor')
with open('assets/tilemaps/classroom.json', 'w') as f:
    json.dump(make_tiled_json(W, H, cl_grnd, cl_obj), f)

# 4. Auditorium
aud_grid = [['floor' for _ in range(W)] for _ in range(H)]
for c in range(W): aud_grid[0][c] = 'wall_top'; aud_grid[H-1][c] = 'wall'
for r in range(H): aud_grid[r][0] = 'wall'; aud_grid[r][W-1] = 'wall'
for c in range(3, 17): aud_grid[2][c] = 'stage'; aud_grid[3][c] = 'stage'
aud_grid[1][5] = 'board'; aud_grid[1][10] = 'board'; aud_grid[1][15] = 'board'
for row in range(4):
    for col in range(2, 18, 2): aud_grid[6 + row*2][col] = 'chair'
for r in range(4, H-1):
    for c in range(1, W-1):
        if aud_grid[r][c] == 'floor' and (r*c)%6 == 0: aud_grid[r][c] = 'floor2'
aud_grid[H-1][10] = 'door'
a_grnd, a_obj = build_layers(aud_grid, 'floor')
with open('assets/tilemaps/auditorium.json', 'w') as f:
    json.dump(make_tiled_json(W, H, a_grnd, a_obj), f)

# 5. Cafeteria
caf_grid = [['floor' for _ in range(W)] for _ in range(H)]
for c in range(W): caf_grid[0][c] = 'wall_top'; caf_grid[H-1][c] = 'wall'
for r in range(H): caf_grid[r][0] = 'wall'; caf_grid[r][W-1] = 'wall'
for tp in [(3,4), (3,11), (8,4), (8,11), (6,16), (11,8)]:
    r, c = tp
    caf_grid[r][c] = 'table'
    if r-1 >= 1: caf_grid[r-1][c] = 'chair'
    if r+1 < H-1: caf_grid[r+1][c] = 'chair'
    if c-1 >= 1 and caf_grid[r][c-1] == 'floor': caf_grid[r][c-1] = 'chair'
    if c+1 < W-1 and caf_grid[r][c+1] == 'floor': caf_grid[r][c+1] = 'chair'
for c in range(2, 8): caf_grid[1][c] = 'desk'
for r in range(2, H-1):
    for c in range(1, W-1):
        if caf_grid[r][c] == 'floor' and (r+c)%4 == 0: caf_grid[r][c] = 'floor2'
caf_grid[H-1][10] = 'door'
cf_grnd, cf_obj = build_layers(caf_grid, 'floor')
with open('assets/tilemaps/cafeteria.json', 'w') as f:
    json.dump(make_tiled_json(W, H, cf_grnd, cf_obj), f)

print('Generated tilemaps and spritesheet successfully.')
