var TILE_IDS = {
      'grass': 1, 'grass2': 2, 'path': 3, 'path2': 4,
      'wall': 5, 'wall_top': 6, 'floor': 7, 'floor2': 8,
      'door': 9, 'bench': 10, 'desk': 11, 'board': 12,
      'chair': 13, 'table': 14, 'stage': 15, 'flower': 16,
      'tree': 17, 'water_tl': 18, 'bookshelf': 19,
      'path_1_3': 20, 'path_1_4': 21, 'path_2_2': 22, 'path_2_0': 23,
      'path_2_4': 24, 'path_2_3': 25, 'path_3_1': 26, 'path_1_1': 27,
      'path_3_2': 28, 'path_1_2': 29,
      'water_tr': 30, 'water_bl': 31, 'water_br': 32,
      'tree_0_0': 33, 'tree_0_1': 34, 'tree_0_2': 35,
      'tree_1_0': 36, 'tree_1_1': 37, 'tree_1_2': 38,
      'tree_2_0': 39, 'tree_2_1': 40, 'tree_2_2': 41,
      'grass_var1': 43, 'grass_var2': 44,
      'bench_0_0': 45, 'bench_0_1': 46, 'bench_0_2': 47,
      'bench_1_0': 50, 'bench_1_1': 51, 'bench_1_2': 52,
      'door_big_l': 53, 'door_big_r': 54,
      'school_wall_tl': 56, 'school_wall_t': 57, 'school_wall_tr': 58,
      'school_wall_l': 59, 'school_wall_c': 60, 'school_wall_r': 61,
      'school_wall_bl': 62, 'school_wall_b': 63, 'school_wall_br': 64,
      'school_wall_itl': 65, 'school_wall_itr': 66,
      'school_wall_ibl': 67, 'school_wall_ibr': 68,
      'school_floor': 69, 'school_floor2': 70
    };
function _autotileSchoolWalls(m) {
    const H = m.length;
    const W = m[0].length;
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        if (m[r][c].startsWith('school_wall')) {
          const topW = (r === 0 || m[r-1][c].startsWith('school_wall'));
          const botW = (r === H-1 || m[r+1][c].startsWith('school_wall'));
          const leftW = (c === 0 || m[r][c-1].startsWith('school_wall'));
          const rightW = (c === W-1 || m[r][c+1].startsWith('school_wall'));

          if (!topW && botW && !leftW && rightW) m[r][c] = 'school_wall_tl';
          else if (!topW && botW && leftW && rightW) m[r][c] = 'school_wall_t';
          else if (!topW && botW && leftW && !rightW) m[r][c] = 'school_wall_tr';
          else if (topW && botW && !leftW && rightW) m[r][c] = 'school_wall_l';
          else if (topW && botW && leftW && rightW) {
            const tlW = (r === 0 || c === 0 || m[r-1][c-1].startsWith('school_wall'));
            const trW = (r === 0 || c === W-1 || m[r-1][c+1].startsWith('school_wall'));
            const blW = (r === H-1 || c === 0 || m[r+1][c-1].startsWith('school_wall'));
            const brW = (r === H-1 || c === W-1 || m[r+1][c+1].startsWith('school_wall'));
            if (!tlW) m[r][c] = 'school_wall_itl';
            else if (!trW) m[r][c] = 'school_wall_itr';
            else if (!blW) m[r][c] = 'school_wall_ibl';
            else if (!brW) m[r][c] = 'school_wall_ibr';
            else m[r][c] = 'school_wall_c';
          }
          else if (topW && botW && leftW && !rightW) m[r][c] = 'school_wall_r';
          else if (topW && !botW && !leftW && rightW) m[r][c] = 'school_wall_bl';
          else if (topW && !botW && leftW && rightW) m[r][c] = 'school_wall_b';
          else if (topW && !botW && leftW && !rightW) m[r][c] = 'school_wall_br';
          else {
            if (!topW && !botW) m[r][c] = 'school_wall_b';
            else if (!leftW && !rightW) m[r][c] = 'school_wall_r';
            else m[r][c] = 'school_wall_c';
          }
        }
      }
    }
  }
function _getMapData(key) {
    const W = 20, H = 15;

    if (key === 'garden') {
      const m = Array.from({ length: H }, (_, r) =>
        Array.from({ length: W }, (_, c) => ((r + c) % 7 === 0 ? 'grass2' : 'grass'))
      );
      for (let c = 0; c < W; c++) { m[0][c] = 'wall'; m[H - 1][c] = 'wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'wall'; m[r][W - 1] = 'wall'; }
      for (let c = 2; c < 18; c++) { m[7][c] = 'path'; m[8][c] = 'path'; }
      for (let r = 1; r < 7; r++) { m[r][10] = 'path'; m[r][11] = 'path'; }
      m[7][2] = 'path_1_3';
      m[8][2] = 'path_1_4';
      for (let c = 3; c <= 9; c++) { m[7][c] = 'path_2_2'; }
      for (let c = 3; c <= 16; c++) { m[8][c] = 'path_2_0'; }
      
      m[8][17] = 'path_2_4';
      m[7][17] = 'path_2_3';
      for (let c = 12; c <= 16; c++) { m[7][c] = 'path_2_2'; }
      for (let r = 0; r <= 6; r++) { m[r][10] = 'path_3_1'; }
      for (let r = 0; r <= 6; r++) { m[r][11] = 'path_1_1'; }
      m[7][10] = 'path_3_2';
      m[7][11] = 'path_1_2';
      m[3][3] = 'grass_var1'; m[3][4] = 'grass_var2'; m[4][3] = 'grass_var1';
      m[11][15] = 'grass_var2'; m[11][16] = 'grass_var1'; m[12][16] = 'grass_var2';
      
      const putObj = (r, c, obj) => {
        if (Array.isArray(m[r][c])) {
          m[r][c].push(obj);
        } else {
          m[r][c] = [m[r][c], obj];
        }
      };
      
      const putBigTree = (r, c) => {
        putObj(r, c, 'tree_0_0'); putObj(r, c+1, 'tree_0_1'); putObj(r, c+2, 'tree_0_2');
        putObj(r+1, c, 'tree_1_0'); putObj(r+1, c+1, 'tree_1_1'); putObj(r+1, c+2, 'tree_1_2');
        putObj(r+2, c, 'tree_2_0'); putObj(r+2, c+1, 'tree_2_1'); putObj(r+2, c+2, 'tree_2_2');
      };
      putBigTree(2,2); putBigTree(2,17); putBigTree(10,1); putBigTree(4,15); putBigTree(10,5);
      putBigTree(6,5); putBigTree(6,14); putBigTree(9,8); putBigTree(4,8);
      putBigTree(9,15);

      putObj(10, 13, 'water_tl'); putObj(10, 14, 'water_tr');
      putObj(11, 13, 'water_bl'); putObj(11, 14, 'water_br');

      const putBigBench = (r, c) => {
        putObj(r-1, c, 'bench_0_0'); putObj(r-1, c+1, 'bench_0_1'); putObj(r-1, c+2, 'bench_0_2');
        putObj(r, c, 'bench_1_0'); putObj(r, c+1, 'bench_1_1'); putObj(r, c+2, 'bench_1_2');
      };

      putBigBench(6, 3);
      putBigBench(6, 12);
      putBigBench(1, 6);
      
      return m;
    }

    if (key === 'corridor') {
      const m = Array.from({ length: H }, () => Array(W).fill('school_floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'school_wall_top'; m[H - 1][c] = 'school_wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'school_wall'; m[r][W - 1] = 'school_wall'; }
      for (let c = 1; c < W - 1; c++) { m[1][c] = 'school_wall_top'; m[5][c] = 'school_wall'; }
      m[5][5] = 'school_floor'; m[5][6] = 'school_floor'; m[5][14] = 'school_floor'; m[5][15] = 'school_floor';
      for (let r = 2; r < 5; r++) {
        for (let c = 1; c < W - 1; c++) if (c % 3 === 0) m[r][c] = 'school_floor2';
      }
      m[8][2] = 'bookshelf'; m[8][3] = 'bookshelf'; m[8][4] = 'bookshelf';
      m[10][2] = 'bookshelf'; m[10][3] = 'bookshelf';
      m[12][2] = 'bookshelf'; m[12][3] = 'bookshelf';
      m[1][10] = 'board';
      m[H - 1][10] = 'door_big_l'; m[H - 1][11] = 'door_big_r'; 
      m[0][5]  = 'door_big_l'; m[0][6]  = 'door_big_r'; 
      m[0][15] = 'door_big_l'; m[0][16] = 'door_big_r'; 
      m[H - 1][3] = 'door_big_l'; m[H - 1][4] = 'door_big_r';
      _autotileSchoolWalls(m);
      return m;
    }

    if (key === 'classroom') {
      const m = Array.from({ length: H }, () => Array(W).fill('school_floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'school_wall_top'; m[H - 1][c] = 'school_wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'school_wall'; m[r][W - 1] = 'school_wall'; }
      m[1][9] = 'board'; m[1][10] = 'board'; m[1][11] = 'board';
      m[3][10] = 'desk';
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          m[6 + row * 2][4 + col * 3] = 'desk';
          m[7 + row * 2][4 + col * 3] = 'chair';
        }
      }
      for (let r = 2; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) if (m[r][c] === 'school_floor' && (r + c) % 5 === 0) m[r][c] = 'school_floor2';
      }
      m[H - 1][10] = 'door_big_l'; m[H - 1][11] = 'door_big_r';
      _autotileSchoolWalls(m);
      return m;
    }

    if (key === 'auditorium') {
      const m = Array.from({ length: H }, () => Array(W).fill('school_floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'school_wall_top'; m[H - 1][c] = 'school_wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'school_wall'; m[r][W - 1] = 'school_wall'; }
      for (let c = 3; c < 17; c++) { m[2][c] = 'stage'; m[3][c] = 'stage'; }
      m[1][5] = 'board'; m[1][10] = 'board'; m[1][15] = 'board';
      for (let row = 0; row < 4; row++) {
        for (let col = 2; col < 18; col += 2) m[6 + row * 2][col] = 'chair';
      }
      for (let r = 4; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) if (m[r][c] === 'school_floor' && (r * c) % 6 === 0) m[r][c] = 'school_floor2';
      }
      m[H - 1][10] = 'door_big_l'; m[H - 1][11] = 'door_big_r';
      _autotileSchoolWalls(m);
      return m;
    }

    if (key === 'cafeteria') {
      const m = Array.from({ length: H }, () => Array(W).fill('school_floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'school_wall_top'; m[H - 1][c] = 'school_wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'school_wall'; m[r][W - 1] = 'school_wall'; }
      const tablePositions = [
        { r: 3, c: 4 }, { r: 3, c: 11 }, { r: 8, c: 4 }, 
        { r: 8, c: 11 }, { r: 6, c: 16 }, { r: 11, c: 8 }
      ];
      tablePositions.forEach(({ r, c }) => {
        m[r][c] = 'table';
        if (r - 1 >= 1) m[r - 1][c] = 'chair';
        if (r + 1 < H - 1) m[r + 1][c] = 'chair';
        if (c - 1 >= 1 && m[r][c - 1] === 'school_floor') m[r][c - 1] = 'chair';
        if (c + 1 < W - 1 && m[r][c + 1] === 'school_floor') m[r][c + 1] = 'chair';
      });
      for (let c = 2; c < 8; c++) m[1][c] = 'desk';
      for (let r = 2; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) if (m[r][c] === 'school_floor' && (r + c) % 4 === 0) m[r][c] = 'school_floor2';
      }
      m[H - 1][10] = 'door_big_l'; m[H - 1][11] = 'door_big_r';
      _autotileSchoolWalls(m);
      return m;
    }

    return Array.from({ length: H }, () => Array(W).fill('grass'));
  }
module.exports = { _getMapData, TILE_IDS };