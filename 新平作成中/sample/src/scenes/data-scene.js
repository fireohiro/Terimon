export default class DataScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DataScene' });
    }

    create() {
        // 各データをカテゴリごとに格納する、
        
        // セーブデータに紐づくデータ
        this.data.set('SaveData',{});
        this.data.set('Friends',{});
        this.data.set('Friends_party',{});
        this.data.set('Inventory',{});
        this.data.set('Inventory_Gear',{});

        // 共通データ
        this.data.set('Monster',{});
        this.data.set('Monster_Waza',{});
        this.data.set('Waza',{});
        this.data.set('Gear',{});
        this.data.set('Item',{});
        this.data.set('Job',{});
        this.data.set('Maps',{});
        this.data.set('Resistance',{});

        // PHPファイルからモンスター情報を取得してキャッシュ
        this.loadData('src/php/get_save_data.php','SaveData');
        this.loadData('src/php/get_friends.php','Friends');
        this.loadData('src/php/get_friends_party.php','Friends_party');
        this.loadData('src/php/get_inventory.php','Inventory');
        this.loadData('src/php/get_inventory_gear.php','Inventory_Gear');
        this.loadData('src/php/get_monster.php','Monster');
        this.loadData('src/php/get_monster_waza.php','Monster_Waza');
        this.loadData('src/php/get_waza.php','Waza');
        this.loadData('src/php/get_gear.php','Gear');
        this.loadData('src/php/get_item.php','Item');
        this.loadData('src/php/get_job.php','Job');
        this.loadData('src/php/get_maps.php','Maps');
        this.loadData('src/php/get_resistance.php','Resistance');

        this.scene.start('TitleScene'); // タイトルシーンへ遷移
    }

    //   ロード処理
    loadData(url, dataKey) {
        fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(`${dataKey}のロード中にエラーが発生しました:`, data.error);
            } else {
                this.data.set(dataKey, data);
                console.log(`${dataKey}がロードされました:`, data);
            }
        })
        .catch(error => {
            console.error(`${dataKey}のロードに失敗しました:`, error);
        });
    }

    // セーブ処理
    saveData() {
        const dataToSave = {
            saveData: this.data.get('SaveData'),
            friends: this.data.get('Friends'),
            friends_party: this.data.get('Friends_party'),
            inventory: this.data.get('Inventory'),
            inventory_gear: this.data.get('Inventory_Gear')
        };
    
        // 保存用エンドポイントをキーとしてマッピング
        const endpoints = {
            saveData: 'src/php/save_data.php',
            friends: 'src/php/save_friends.php',
            friends_party: 'src/php/save_friends_party.php',
            inventory: 'src/php/save_inventory.php',
            inventory_gear: 'src/php/save_inventory_gear.php'
        };
    
        // 各データを非同期で送信
        const requests = Object.keys(dataToSave).map(key => {
            return fetch(endpoints[key], {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave[key])
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(`${key}の保存中にエラーが発生しました:`, data.error);
                } else {
                    console.log(`${key}が正常に保存されました:`, data);
                }
            })
            .catch(error => {
                console.error(`${key}の保存に失敗しました:`, error);
            });
        });
    
        // 全ての保存処理を待つ
        Promise.all(requests).then(() => {
            console.log('全てのセーブデータが処理されました');
        });
    }

}