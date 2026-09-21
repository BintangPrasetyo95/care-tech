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

print('Generated spritesheet successfully.')
