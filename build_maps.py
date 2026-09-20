import json
import os
from PIL import Image, ImageDraw

TILE_SIZE = 64
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
    'water_tl': (14, 165, 233),
    'bookshelf': (0, 0, 0, 0),
    'bookshelf_t': (0, 0, 0, 0),
    'bookshelf_b': (0, 0, 0, 0),
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
    'water_tr': (0, 0, 0, 0),
    'water_bl': (0, 0, 0, 0),
    'water_br': (0, 0, 0, 0),
    'tree_0_0': (0,0,0,0), 'tree_0_1': (0,0,0,0), 'tree_0_2': (0,0,0,0),
    'tree_1_0': (0,0,0,0), 'tree_1_1': (0,0,0,0), 'tree_1_2': (0,0,0,0),
    'tree_2_0': (0,0,0,0), 'tree_2_1': (0,0,0,0), 'tree_2_2': (0,0,0,0),
    'dummy_42': (0,0,0,0),
    'grass_var1': (0,0,0,0),
    'grass_var2': (0,0,0,0),
    'bench_0_0': (0,0,0,0), 'bench_0_1': (0,0,0,0), 'bench_0_2': (0,0,0,0),
    'dummy_48': (0,0,0,0),
    'dummy_49': (0,0,0,0),
    'bench_1_0': (0,0,0,0), 'bench_1_1': (0,0,0,0), 'bench_1_2': (0,0,0,0),
    'door_big_l': (0,0,0,0), 'door_big_r': (0,0,0,0),
    'school_wall_tl': (0,0,0,0), 'school_wall_t': (0,0,0,0), 'school_wall_tr': (0,0,0,0),
    'school_wall_l': (0,0,0,0), 'school_wall_c': (0,0,0,0), 'school_wall_r': (0,0,0,0),
    'school_wall_bl': (0,0,0,0), 'school_wall_b': (0,0,0,0), 'school_wall_br': (0,0,0,0),
    'school_wall_itl': (0,0,0,0), 'school_wall_itr': (0,0,0,0),
    'school_wall_ibl': (0,0,0,0), 'school_wall_ibr': (0,0,0,0),
    'school_floor': (0,0,0,0), 'school_floor2': (0,0,0,0),
    'tc_0_0': (0,0,0,0), 'tc_0_1': (0,0,0,0), 'tc_0_2': (0,0,0,0),
    'tc_1_0': (0,0,0,0), 'tc_1_1': (0,0,0,0), 'tc_1_2': (0,0,0,0),
    'tc_2_0': (0,0,0,0), 'tc_2_1': (0,0,0,0), 'tc_2_2': (0,0,0,0),
    'caf_srv_0_0': (0,0,0,0), 'caf_srv_0_1': (0,0,0,0), 'caf_srv_0_2': (0,0,0,0),
    'caf_srv_0_3': (0,0,0,0), 'caf_srv_0_4': (0,0,0,0), 'caf_srv_0_5': (0,0,0,0),
    'caf_srv_1_0': (0,0,0,0), 'caf_srv_1_1': (0,0,0,0), 'caf_srv_1_2': (0,0,0,0),
    'caf_srv_1_3': (0,0,0,0), 'caf_srv_1_4': (0,0,0,0), 'caf_srv_1_5': (0,0,0,0),
}

tile_names = list(tiles.keys())
# Create spritesheet
cols = 5
rows = (len(tile_names) + cols - 1) // cols
img = Image.new('RGBA', (cols * TILE_SIZE, rows * TILE_SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

try:
    garden_sheet = Image.open('assets/sprites/school_garden_sprites.png')
    pond_sheet = Image.open('assets/sprites/school_garden_pond_sprites.png')
    big_tree_sheet = Image.open('assets/sprites/big_tree.png')
    grass_v1 = Image.open('assets/sprites/grass variant 1.png')
    grass_v2 = Image.open('assets/sprites/grass variant 2.png')
    bench_sheet = Image.open('assets/sprites/long_bench.png')
    big_door_sheet = Image.open('assets/sprites/big_door.png')
    bookshelf_sheet = Image.open('assets/sprites/bookshelf_sprites.png')
    wall_tile = Image.open('assets/sprites/tile_3_0.png')
    school_fw = Image.open('assets/sprites/school_floor_wall_sprites.png')
    tc_sheet = Image.open('assets/sprites/table_and_chair.png')
    caf_srv_sheet = Image.open('assets/sprites/cafeteria_service.png')
    custom_tiles = {
        'wall': wall_tile,
        'school_wall_tl': school_fw.crop((1*64, 0*64, 2*64, 1*64)),
        'school_wall_t': school_fw.crop((2*64, 0*64, 3*64, 1*64)),
        'school_wall_tr': school_fw.crop((3*64, 0*64, 4*64, 1*64)),
        'school_wall_l': school_fw.crop((1*64, 1*64, 2*64, 2*64)),
        'school_wall_c': school_fw.crop((2*64, 1*64, 3*64, 2*64)),
        'school_wall_r': school_fw.crop((3*64, 1*64, 4*64, 2*64)),
        'school_wall_bl': school_fw.crop((1*64, 2*64, 2*64, 3*64)),
        'school_wall_b': school_fw.crop((2*64, 2*64, 3*64, 3*64)),
        'school_wall_br': school_fw.crop((3*64, 2*64, 4*64, 3*64)),
        'school_wall_itl': school_fw.crop((1*64, 3*64, 2*64, 4*64)),
        'school_wall_itr': school_fw.crop((2*64, 3*64, 3*64, 4*64)),
        'school_wall_ibl': school_fw.crop((1*64, 4*64, 2*64, 5*64)),
        'school_wall_ibr': school_fw.crop((2*64, 4*64, 3*64, 5*64)),
        'school_floor': school_fw.crop((0, 0, 64, 64)),
        'school_floor2': school_fw.crop((0, 64, 64, 128)),
        'tc_0_0': tc_sheet.crop((0*64, 0*64, 1*64, 1*64)),
        'tc_0_1': tc_sheet.crop((1*64, 0*64, 2*64, 1*64)),
        'tc_0_2': tc_sheet.crop((2*64, 0*64, 3*64, 1*64)),
        'tc_1_0': tc_sheet.crop((0*64, 1*64, 1*64, 2*64)),
        'tc_1_1': tc_sheet.crop((1*64, 1*64, 2*64, 2*64)),
        'tc_1_2': tc_sheet.crop((2*64, 1*64, 3*64, 2*64)),
        'tc_2_0': tc_sheet.crop((0*64, 2*64, 1*64, 3*64)),
        'tc_2_1': tc_sheet.crop((1*64, 2*64, 2*64, 3*64)),
        'tc_2_2': tc_sheet.crop((2*64, 2*64, 3*64, 3*64)),
        'grass': garden_sheet.crop((0, 3*64, 64, 4*64)),
        'grass2': garden_sheet.crop((0, 4*64, 64, 5*64)),
        'path': garden_sheet.crop((0, 0, 64, 64)),
        'path2': garden_sheet.crop((0, 1*64, 64, 2*64)),
        'path_1_3': garden_sheet.crop((1*64, 3*64, 2*64, 4*64)),
        'path_1_4': garden_sheet.crop((1*64, 4*64, 2*64, 5*64)),
        'path_2_2': garden_sheet.crop((2*64, 2*64, 3*64, 3*64)),
        'path_2_0': garden_sheet.crop((2*64, 0*64, 3*64, 1*64)),
        'path_2_4': garden_sheet.crop((2*64, 4*64, 3*64, 5*64)),
        'path_2_3': garden_sheet.crop((2*64, 3*64, 3*64, 4*64)),
        'path_3_1': garden_sheet.crop((3*64, 1*64, 4*64, 2*64)),
        'path_1_1': garden_sheet.crop((1*64, 1*64, 2*64, 2*64)),
        'path_3_2': garden_sheet.crop((3*64, 2*64, 4*64, 3*64)),
        'path_1_2': garden_sheet.crop((1*64, 2*64, 2*64, 3*64)),
        'water_tl': pond_sheet.crop((0, 0, 64, 64)),
        'water_tr': pond_sheet.crop((64, 0, 128, 64)),
        'water_bl': pond_sheet.crop((0, 64, 64, 128)),
        'water_br': pond_sheet.crop((64, 64, 128, 128)),
        'tree_0_0': big_tree_sheet.crop((0*64, 0*64, 1*64, 1*64)),
        'tree_0_1': big_tree_sheet.crop((1*64, 0*64, 2*64, 1*64)),
        'tree_0_2': big_tree_sheet.crop((2*64, 0*64, 3*64, 1*64)),
        'tree_1_0': big_tree_sheet.crop((0*64, 1*64, 1*64, 2*64)),
        'tree_1_1': big_tree_sheet.crop((1*64, 1*64, 2*64, 2*64)),
        'tree_1_2': big_tree_sheet.crop((2*64, 1*64, 3*64, 2*64)),
        'tree_2_0': big_tree_sheet.crop((0*64, 2*64, 1*64, 3*64)),
        'tree_2_1': big_tree_sheet.crop((1*64, 2*64, 2*64, 3*64)),
        'tree_2_2': big_tree_sheet.crop((2*64, 2*64, 3*64, 3*64)),
        'grass_var1': grass_v1,
        'grass_var2': grass_v2,
        'bench_0_0': bench_sheet.crop((0*64, 0*64, 1*64, 1*64)),
        'bench_0_1': bench_sheet.crop((1*64, 0*64, 2*64, 1*64)),
        'bench_0_2': bench_sheet.crop((2*64, 0*64, 3*64, 1*64)),
        'bench_1_0': bench_sheet.crop((0*64, 1*64, 1*64, 2*64)),
        'bench_1_1': bench_sheet.crop((1*64, 1*64, 2*64, 2*64)),
        'bench_1_2': bench_sheet.crop((2*64, 1*64, 3*64, 2*64)),
        'door_big_l': big_door_sheet.crop((0, 0, 64, 64)),
        'door_big_r': big_door_sheet.crop((64, 0, 128, 64)),
        'bookshelf_t': bookshelf_sheet.crop((0, 0, 64, 64)),
        'bookshelf_b': bookshelf_sheet.crop((0, 64, 64, 128)),
        'caf_srv_0_0': caf_srv_sheet.crop((0*64, 0*64, 1*64, 1*64)),
        'caf_srv_0_1': caf_srv_sheet.crop((1*64, 0*64, 2*64, 1*64)),
        'caf_srv_0_2': caf_srv_sheet.crop((2*64, 0*64, 3*64, 1*64)),
        'caf_srv_0_3': caf_srv_sheet.crop((3*64, 0*64, 4*64, 1*64)),
        'caf_srv_0_4': caf_srv_sheet.crop((4*64, 0*64, 5*64, 1*64)),
        'caf_srv_0_5': caf_srv_sheet.crop((5*64, 0*64, 6*64, 1*64)),
        'caf_srv_1_0': caf_srv_sheet.crop((0*64, 1*64, 1*64, 2*64)),
        'caf_srv_1_1': caf_srv_sheet.crop((1*64, 1*64, 2*64, 2*64)),
        'caf_srv_1_2': caf_srv_sheet.crop((2*64, 1*64, 3*64, 2*64)),
        'caf_srv_1_3': caf_srv_sheet.crop((3*64, 1*64, 4*64, 2*64)),
        'caf_srv_1_4': caf_srv_sheet.crop((4*64, 1*64, 5*64, 2*64)),
        'caf_srv_1_5': caf_srv_sheet.crop((5*64, 1*64, 6*64, 2*64)),
    }
except Exception as e:
    import traceback
    traceback.print_exc()
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
        "tileheight": 64,
        "tilesets": [
            {
                "columns": cols,
                "firstgid": 1,
                "image": "../sprites/tileset.png",
                "imageheight": rows * 64,
                "imagewidth": cols * 64,
                "margin": 0,
                "name": "tileset",
                "spacing": 0,
                "tilecount": len(tile_names),
                "tileheight": 64,
                "tilewidth": 64
            }
        ],
        "tilewidth": 64,
        "type": "map",
        "version": "1.10",
        "width": width
    }

W, H = 20, 15

def is_solid(name):
    return name.startswith('caf_srv_') or name in ['wall', 'wall_top', 'school_wall_tl', 'school_wall_t', 'school_wall_tr', 'school_wall_l', 'school_wall_c', 'school_wall_r', 'school_wall_bl', 'school_wall_b', 'school_wall_br', 'school_wall_itl', 'school_wall_itr', 'school_wall_ibl', 'school_wall_ibr', 'bench', 'desk', 'board', 'table', 'chair', 'tree', 'tree_2_1', 'water', 'water_tl', 'water_tr', 'water_bl', 'water_br', 'bookshelf_b', 'bush_tl', 'bush_t', 'bush_tr', 'bush_l', 'bush_r', 'bush_bl', 'bush_b', 'bush_br', 'door_big_l', 'door_big_r', 'tc_0_0', 'tc_0_1', 'tc_0_2', 'tc_1_0', 'tc_1_1', 'tc_1_2', 'tc_2_0', 'tc_2_1', 'tc_2_2']

def build_layers(base_grid, fallback='grass'):
    ground = [['empty']*W for _ in range(H)]
    objs = [['empty']*W for _ in range(H)]
    for r in range(H):
        for c in range(W):
            tile = base_grid[r][c]
            if is_solid(tile) or tile == 'door' or tile == 'door_big_l' or tile == 'door_big_r':
                ground[r][c] = fallback
                objs[r][c] = tile
            else:
                ground[r][c] = tile
                objs[r][c] = 'empty'
    return ground, objs

# 1. Garden
W_garden, H_garden = 40, 15
offset = 10
garden_grid = [['grass' if (r+c)%7 != 0 else 'grass2' for c in range(W_garden)] for r in range(H_garden)]
for c in range(W_garden):
    garden_grid[0][c] = 'wall'
    garden_grid[H_garden-1][c] = 'wall'
for r in range(H_garden):
    garden_grid[r][0] = 'wall'
    garden_grid[r][W_garden-1] = 'wall'

for c in range(2, 18): garden_grid[7][c + offset] = 'path'
for r in range(0, 7): garden_grid[r][10 + offset] = 'path'

garden_grid[7][2 + offset] = 'path_1_3'
garden_grid[8][2 + offset] = 'path_1_4'
for c in range(3, 10): garden_grid[7][c + offset] = 'path_2_2'
for c in range(3, 17): garden_grid[8][c + offset] = 'path_2_0'

garden_grid[8][17 + offset] = 'path_2_4'
garden_grid[7][17 + offset] = 'path_2_3'
for c in range(12, 17): garden_grid[7][c + offset] = 'path_2_2'
for r in range(0, 7): garden_grid[r][10 + offset] = 'path_3_1'
for r in range(0, 7): garden_grid[r][11 + offset] = 'path_1_1'
garden_grid[7][10 + offset] = 'path_3_2'
garden_grid[7][11 + offset] = 'path_1_2'
garden_grid[3][3 + offset] = 'grass_var1'
garden_grid[3][4 + offset] = 'grass_var2'
garden_grid[4][3 + offset] = 'grass_var1'
garden_grid[11][15 + offset] = 'grass_var2'
garden_grid[11][16 + offset] = 'grass_var1'
garden_grid[12][16 + offset] = 'grass_var2'

for r, c in [(2,2+offset), (2,17+offset), (10,1+offset), (4,15+offset), (10,5+offset), (6,5+offset), (6,14+offset), (9,8+offset), (4,8+offset), (9,15+offset)]:
    garden_grid[r][c] = 'tree_0_0'; garden_grid[r][c+1] = 'tree_0_1'; garden_grid[r][c+2] = 'tree_0_2';
    garden_grid[r+1][c] = 'tree_1_0'; garden_grid[r+1][c+1] = 'tree_1_1'; garden_grid[r+1][c+2] = 'tree_1_2';
    garden_grid[r+2][c] = 'tree_2_0'; garden_grid[r+2][c+1] = 'tree_2_1'; garden_grid[r+2][c+2] = 'tree_2_2';

for r, c in [(2,2), (5,5), (9,1), (4,32), (9,35), (1,35)]:
    garden_grid[r][c] = 'tree_0_0'; garden_grid[r][c+1] = 'tree_0_1'; garden_grid[r][c+2] = 'tree_0_2';
    garden_grid[r+1][c] = 'tree_1_0'; garden_grid[r+1][c+1] = 'tree_1_1'; garden_grid[r+1][c+2] = 'tree_1_2';
    garden_grid[r+2][c] = 'tree_2_0'; garden_grid[r+2][c+1] = 'tree_2_1'; garden_grid[r+2][c+2] = 'tree_2_2';

garden_grid[10][13+offset] = 'water_tl'; garden_grid[10][14+offset] = 'water_tr';
garden_grid[11][13+offset] = 'water_bl'; garden_grid[11][14+offset] = 'water_br';

for r, c in [(6,3+offset), (6,12+offset), (1,6+offset)]:
    garden_grid[r-1][c] = 'bench_0_0'; garden_grid[r-1][c+1] = 'bench_0_1'; garden_grid[r-1][c+2] = 'bench_0_2';
    garden_grid[r][c] = 'bench_1_0'; garden_grid[r][c+1] = 'bench_1_1'; garden_grid[r][c+2] = 'bench_1_2';

def build_layers_local(base_grid, fallback='grass', loc_W=20, loc_H=15):
    ground = [['empty']*loc_W for _ in range(loc_H)]
    objs = [['empty']*loc_W for _ in range(loc_H)]
    for r in range(loc_H):
        for c in range(loc_W):
            tile = base_grid[r][c]
            if is_solid(tile) or tile == 'door' or tile == 'door_big_l' or tile == 'door_big_r':
                ground[r][c] = fallback
                objs[r][c] = tile
            else:
                ground[r][c] = tile
                objs[r][c] = 'empty'
    return ground, objs

g_grnd, g_obj = build_layers_local(garden_grid, 'grass', loc_W=W_garden, loc_H=H_garden)
with open('assets/tilemaps/garden.json', 'w') as f:
    json.dump(make_tiled_json(W_garden, H_garden, g_grnd, g_obj), f)

# 2. Corridor
cor_grid = [['school_floor' for _ in range(W)] for _ in range(H)]
for c in range(W): cor_grid[0][c] = 'school_wall_top'; cor_grid[H-1][c] = 'school_wall'
for r in range(H): cor_grid[r][0] = 'school_wall'; cor_grid[r][W-1] = 'school_wall'
for c in range(1, W-1): cor_grid[1][c] = 'school_wall_top'; cor_grid[5][c] = 'school_wall'
for c in [5,6,14,15]: cor_grid[5][c] = 'school_floor'
for r in range(2, 5):
    for c in range(1, W-1):
        if c % 3 == 0: cor_grid[r][c] = 'school_floor2'
for r, c in [(8,2), (8,3), (8,4), (10,2), (10,3), (12,2), (12,3)]: 
    cor_grid[r-1][c] = 'bookshelf_t'
    cor_grid[r][c] = 'bookshelf_b'
cor_grid[1][10] = 'board'
cor_grid[H-1][10] = 'door'
cor_grid[0][5] = 'door'
cor_grid[0][15] = 'door'
cor_grid[H-1][3] = 'door'
c_grnd, c_obj = build_layers(cor_grid, 'school_floor')
with open('assets/tilemaps/corridor.json', 'w') as f:
    json.dump(make_tiled_json(W, H, c_grnd, c_obj), f)

# 3. Classroom
cls_grid = [['school_floor' for _ in range(W)] for _ in range(H)]
for c in range(W): cls_grid[0][c] = 'school_wall_top'; cls_grid[H-1][c] = 'school_wall'
for r in range(H): cls_grid[r][0] = 'school_wall'; cls_grid[r][W-1] = 'school_wall'
cls_grid[1][9] = 'board'; cls_grid[1][10] = 'board'; cls_grid[1][11] = 'board'
cls_grid[3][10] = 'desk'
for row in range(3):
    for col in range(4):
        cls_grid[6 + row*2][4 + col*3] = 'desk'
        cls_grid[7 + row*2][4 + col*3] = 'chair'
# Add bookshelves to the left and right walls of the classroom
for r in [3, 5, 7, 9]:
    cls_grid[r-1][1] = 'bookshelf_t'
    cls_grid[r][1] = 'bookshelf_b'
    cls_grid[r-1][18] = 'bookshelf_t'
    cls_grid[r][18] = 'bookshelf_b'
for r in range(2, H-1):
    for c in range(1, W-1):
        if cls_grid[r][c] == 'school_floor' and (r+c)%5 == 0: cls_grid[r][c] = 'school_floor2'
cls_grid[H-1][10] = 'door'
cl_grnd, cl_obj = build_layers(cls_grid, 'school_floor')
with open('assets/tilemaps/classroom.json', 'w') as f:
    json.dump(make_tiled_json(W, H, cl_grnd, cl_obj), f)

# 4. Auditorium
aud_grid = [['school_floor' for _ in range(W)] for _ in range(H)]
for c in range(W): aud_grid[0][c] = 'school_wall_top'; aud_grid[H-1][c] = 'school_wall'
for r in range(H): aud_grid[r][0] = 'school_wall'; aud_grid[r][W-1] = 'school_wall'
for c in range(3, 17): aud_grid[2][c] = 'stage'; aud_grid[3][c] = 'stage'
aud_grid[1][5] = 'board'; aud_grid[1][10] = 'board'; aud_grid[1][15] = 'board'
for row in range(4):
    for col in range(2, 18, 2): aud_grid[6 + row*2][col] = 'chair'
for r in range(4, H-1):
    for c in range(1, W-1):
        if aud_grid[r][c] == 'school_floor' and (r*c)%6 == 0: aud_grid[r][c] = 'school_floor2'
aud_grid[H-1][10] = 'door'
a_grnd, a_obj = build_layers(aud_grid, 'school_floor')
with open('assets/tilemaps/auditorium.json', 'w') as f:
    json.dump(make_tiled_json(W, H, a_grnd, a_obj), f)

# 5. Cafeteria
caf_grid = [['school_floor' for _ in range(W)] for _ in range(H)]
for c in range(W): caf_grid[0][c] = 'school_wall_top'; caf_grid[H-1][c] = 'school_wall'
for r in range(H): caf_grid[r][0] = 'school_wall'; caf_grid[r][W-1] = 'school_wall'
for tp in [(3,4), (3,11), (8,4), (8,11), (6,16), (11,8)]:
    r, c = tp
    caf_grid[r][c] = 'table'
    if r-1 >= 1: caf_grid[r-1][c] = 'chair'
    if r+1 < H-1: caf_grid[r+1][c] = 'chair'
    if c-1 >= 1 and caf_grid[r][c-1] == 'school_floor': caf_grid[r][c-1] = 'chair'
    if c+1 < W-1 and caf_grid[r][c+1] == 'school_floor': caf_grid[r][c+1] = 'chair'

for c in range(2, 8):
    caf_grid[1][c] = f'caf_srv_0_{c-2}'
    caf_grid[2][c] = f'caf_srv_1_{c-2}'

for r in range(2, H-1):
    for c in range(1, W-1):
        if caf_grid[r][c] == 'school_floor' and (r+c)%4 == 0: caf_grid[r][c] = 'school_floor2'
caf_grid[H-1][10] = 'door'
cf_grnd, cf_obj = build_layers(caf_grid, 'school_floor')
with open('assets/tilemaps/cafeteria.json', 'w') as f:
    json.dump(make_tiled_json(W, H, cf_grnd, cf_obj), f)

print('Generated tilemaps and spritesheet successfully.')
