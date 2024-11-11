
-- ユーザーTABLE
CREATE TABLE User (
    user_id INT AUTO_INCREMENT,                       -- ユーザーの一意な識別子
    loginId VARCHAR(255) NOT NULL UNIQUE,             -- ログインID、一意
    password_hash VARCHAR(255) NOT NULL,              -- ハッシュ化されたパスワード
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- アカウント作成日時
    PRIMARY KEY(user_id)
);

-- マップTABLE
CREATE TABLE Maps (
    map_id INT AUTO_INCREMENT,                       -- マップの一意な識別子
    map_name VARCHAR(255) NOT NULL,                  -- マップ名
    PRIMARY KEY(map_id)
);

-- ジョブTABLE
CREATE TABLE Job (
    job_id INT AUTO_INCREMENT,                      -- ジョブの一意な識別子
    job_name VARCHAR(20) NOT NULL,                  -- ジョブ名
    start_hp INT NOT NULL,                          -- HP初期値
    add_hp INT NOT NULL,                            -- HP増加値
    start_mp INT NOT NULL,                          -- MP初期値
    add_mp INT NOT NULL,                            -- MP増加値
    start_strength INT NOT NULL,                          -- ちから初期値
    add_strength INT NOT NULL,                      -- ちから増加値
    start_defense INT NOT NULL,                          -- まもり初期値
    add_defense INT NOT NULL,                       -- まもり増加値
    start_speed INT NOT NULL,                          -- スピード初期値
    add_speed INT NOT NULL,                         -- スピード増加値
    start_luck INT NOT NULL,                          -- 運初期値
    add_luck INT NOT NULL,                          -- 運増加値
    PRIMARY KEY(job_id)
);

-- 武器やアイテムの処理はPhaser側で行う

-- 武器TABLE
CREATE TABLE Gear (
    gear_id INT AUTO_INCREMENT,                      -- 武器の一意な識別子
    gear_name VARCHAR(20) NOT NULL,                  -- 武器名
    up_status VARCHAR(10) NOT NULL,                  -- 増加ステータス
    up_value INT NOT NULL,                          -- 増加値
    gear_value INT NOT NULl,                        -- 武器の値段
    PRIMARY KEY(gear_id)
);

-- アイテムTABLE
CREATE TABLE Item (
    item_id INT AUTO_INCREMENT,                      -- アイテムの一意な識別子
    item_name VARCHAR(20) NOT NULL,                  -- アイテム名
    item_manual VARCHAR(255) NOT NULL,                  -- アイテムの説明 
    item_value INT NOT NULl,                        -- アイテムの値段
    PRIMARY KEY(item_id)
);

-- 技TABLE
CREATE TABLE Waza (
    waza_id INT AUTO_INCREMENT,                      -- 技の一意な識別子
    waza_name VARCHAR(20) NOT NULL,                  -- 技名
    use_mp INT NOT NULL,                            -- 消費MP
    might INT NOT NULL,                              -- 威力
    hit_rate INT NOT NULL,                          -- 命中率
    waza_manual VARCHAR(255) NOT NULL,                  -- 技の説明 
    PRIMARY KEY(waza_id)
);

-- 耐性TABLE
CREATE TABLE Resistance (
    resistance_id INT AUTO_INCREMENT,  -- 耐性の一意な識別子
    fire_resistance DECIMAL(3, 2) DEFAULT 1.0,   -- 火属性の耐性
    water_resistance DECIMAL(3, 2) DEFAULT 1.0,  -- 水属性の耐性
    wind_resistance DECIMAL(3, 2) DEFAULT 1.0,   -- 風属性の耐性
    earth_resistance DECIMAL(3, 2) DEFAULT 1.0,   -- 地耐性
    grass_resistance DECIMAL(3, 2) DEFAULT 1.0,   -- 草耐性
    lightning_resistance DECIMAL(3, 2) DEFAULT 1.0,-- 雷耐性
    ice_resistance DECIMAL(3, 2) DEFAULT 1.0,    -- 氷属性の耐性
    physical_resistance DECIMAL(3, 2) DEFAULT 1.0,-- 物理耐性
    magic_resistance DECIMAL(3, 2) DEFAULT 1.0,  -- 魔法耐性
    death_resistance DECIMAL(3, 2) DEFAULT 1.0,  -- 即死耐性
    healing_resistance DECIMAL(3, 2) DEFAULT 1.0,-- 回復耐性
    poison_resistance DECIMAL(3, 2) DEFAULT 1.0, -- 毒耐性
    paralysis_resistance DECIMAL(3, 2) DEFAULT 1.0,-- 麻痺耐性
    curse_resistance DECIMAL(3, 2) DEFAULT 1.0,   -- 呪い耐性
    PRIMARY KEY(resistance_id)
);

-- モンスターごとの攻撃耐性と運は固定
-- 育成アイテムは使用回数に制限
-- ポイント振り分け(ランダム？)
-- レベルごとのポイントを別テーブルで分けてもいいかも(大器晩成、早熟とか)
-- 強いモンスターはその分レベルアップ回数を少なくして自由度を減らすとか？

-- モンスターデータTABLE
CREATE TABLE Monster (
    monster_id INT AUTO_INCREMENT,               -- モンスターの一意な識別子
    monster_name VARCHAR(20) NOT NULL,           -- モンスターの名前
    image VARCHAR(50) NOT NULL,                      -- モンスターの画像パス
    bunrui VARCHAR(10) NOT NULL,                      -- モンスターの分類
    resistance_id INT NOT NULL,             -- 攻撃耐性(技に対する耐性)
    level_start INT NOT NULL,               -- レベル初期値
    hp_start INT NOT NULL,                  -- HP初期値
    mp_start INT NOT NULL,                  -- MP初期値
    strength_start INT NOT NULL,                  -- ちから初期値
    defense_start INT NOT NULL,                  -- まもり初期値
    speed_start INT NOT NULL,                 -- スピード初期値
    lack INT NOT NULL,                        -- 運の良さ
    experience INT NOT NULL,                  -- ドロップ経験値
    drop_money INT NOT NULL,                  -- ドロップ金額
    PRIMARY KEY(monster_id),
    FOREIGN KEY (resistance_id) REFERENCES Resistance(resistance_id)
);

-- セーブデータTABLE
CREATE TABLE SaveData (
    save_id INT AUTO_INCREMENT,         -- セーブデータの一意な識別子
    user_id INT NOT NULL,                           -- ユーザーの識別子 (Usersテーブルの外部キー)
    name VARCHAR(255) NOT NULL DEFAULT "ななし",     -- キャラの名前
    game_progress INT NOT NULL DEFAULT 0,           -- ゲームの進行状況
    level INT NOT NULL DEFAULT 1,                   -- レベル
    experience INT NOT NULL DEFAULT 0,              -- 経験値累計
    max_hp INT NOT NULL DEFAULT 1,                            -- HP最大値
    current_hp INT NOT NULL DEFAULT 1,                        -- HP現在値
    max_mp INT NOT NULL DEFAULT 1,                            -- MP最大値
    current_mp INT NOT NULL DEFAULT 1,                        -- MP現在値
    job_id INT NOT NULL,                            -- 職業ID
    strength INT NOT NULL DEFAULT 1,                          -- ちから
    defense INT NOT NULL DEFAULT 1,                           -- まもり
    speed INT NOT NULL DEFAULT 1,                             -- スピード
    luck INT NOT NULL DEFAULT 1,                              -- 運
    money INT NOT NULL DEFAULT 0,                             -- 所持金
    map_id INT NOT NULL DEFAULT 1,                            -- マップID
    save_point_x FLOAT NOT NULL DEFAULT 720.0,                      -- セーブ地点X座標
    save_point_y FLOAT NOT NULL DEFAULT 175.0,                      -- セーブ地点Y座標
    last_saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,               -- 最終セーブ日時
    PRIMARY KEY(save_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),                  -- Usersテーブルへの外部キー制約
    FOREIGN KEY (job_id) REFERENCES Job(job_id),                 -- JobDataテーブルへの外部キー制約
    FOREIGN KEY (map_id) REFERENCES Maps(map_id)                     -- Mapsテーブルへの外部キー制約
);

-- 取得技TABLE
CREATE TABLE Monster_Waza (
    monster_id INT NOT NULL,            -- モンスターの一意な識別子
    waza_id INT NOT NULL,                 -- 技の一意な識別子
    level INT NOT NULL,                  -- 取得レベル 
    PRIMARY KEY(monster_id,waza_id),
    FOREIGN KEY (monster_id) REFERENCES Monster(monster_id),
    FOREIGN KEY (waza_id) REFERENCES Waza(waza_id)
);

-- セーブデータに紐づいた仲間一覧(牧場等で表示される)TABLE
CREATE TABLE Friends (
    friend_id INT NOT NULL AUTO_INCREMENT,  -- 仲間の一意な識別子
    save_id INT NOT NULL,                   -- セーブデータの一意な識別子
    monster_id INT NOT NULL,                -- モンスターの一意な識別子
    job_id INT NOT NULL,                    -- ジョブの一意な識別子
    level INT NOT NULL,                     -- レベル
    get_exprience INT NOT NULL,             -- 経験値
    hp INT NOT NULL,                        -- HP
    mp INT NOT NULL,                        -- MP
    strength INT NOT NULL,                  -- ちから
    defense INT NOT NULL,                   -- まもり
    speed INT NOT NULL,                     -- スピード
    lack INT NOT NULL,                      -- 運の良さ
    buff_time INT NOT NULL,
    waza_id1 INT NOT NULL,
    waza_id2 INT NOT NULL,
    waza_id3 INT NOT NULL,
    waza_id4 INT NOT NULL,
    PRIMARY KEY(friend_id),
    FOREIGN KEY (save_id) REFERENCES SaveData(save_id),
    FOREIGN KEY (monster_id) REFERENCES Monster(monster_id),
    FOREIGN KEY (job_id) REFERENCES Job(job_id),
    FOREIGN KEY (waza_id1) REFERENCES Waza(waza_id),
    FOREIGN KEY (waza_id2) REFERENCES Waza(waza_id),
    FOREIGN KEY (waza_id3) REFERENCES Waza(waza_id),
    FOREIGN KEY (waza_id4) REFERENCES Waza(waza_id)
);


-- セーブデータに紐づいたパーティーメンバー(連れている仲間)TABLE
CREATE TABLE Friends_party (
    save_id INT NOT NULL,
    party_id INT NOT NULL CHECK (party_id BETWEEN 1 AND 3),  -- パーティIDは1～3の間で制限
    friend_id INT NOT NULL,
    current_hp INT NOT NULL CHECK (current_hp >= 0),         -- HPの現在値は0以上
    current_mp INT NOT NULL CHECK (current_mp >= 0),         -- MPの現在値は0以上
    sleep_flag TINYINT NOT NULL DEFAULT 0,                   -- 戦闘不能フラグ
    PRIMARY KEY (save_id, party_id),
    FOREIGN KEY (save_id) REFERENCES SaveData(save_id),
    FOREIGN KEY (friend_id) REFERENCES Friends(friend_id)
);

-- セーブデータに紐づいたインベントリTABLE
CREATE TABLE Inventory (
    save_id INT NOT NULL,            -- セーブデータの一意な識別子
    item_id INT NOT NULL,                 -- アイテムの一意な識別子
    item_sum INT NOT NULL,                  -- 個数 
    PRIMARY KEY(save_id,item_id),
    FOREIGN KEY (save_id) REFERENCES SaveData(save_id),
    FOREIGN KEY (item_id) REFERENCES Item(item_id)
);

-- セーブデータに紐づいた武器TABLE
CREATE TABLE Inventory_Gear (
    save_id INT NOT NULL,            -- セーブデータの一意な識別子
    gear_id INT NOT NULL,                 -- 武器の一意な識別子
    gear_sum INT NOT NULL,                  -- 個数
    gear_used_sum INT NOT NULL,             -- 使用中の個数
    PRIMARY KEY(save_id,gear_id),
    FOREIGN KEY (save_id) REFERENCES SaveData(save_id),
    FOREIGN KEY (gear_id) REFERENCES Gear(gear_id)
);