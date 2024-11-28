export default class EventManager {
  constructor(scene) {
    this.scene = scene;
    this.events = [];
    this.imageGroup = this.scene.add.group(); // 画像管理用のグループ
  }
  loadEventsFromLayer(tilemap) {
    this.events = [];
    this.clearEventImages();
    
    const EventLayer = tilemap.getObjectLayer("EventLayer");

    if(EventLayer){
      this.events = EventLayer.objects.map(obj => {

        const tileSetName = obj.properties.find(prop => prop.name === "tileSet")?.value;
  
        const tileSet = tilemap.getTileset(tileSetName); // タイルセット名
  
        const gid = obj.gid;
        const tileIndex = gid - tileSet.firstgid;
  
        const image = tileSet.name; // タイルセットの名前を参照
        const frame = tileIndex;   // タイルのフレーム番号
  
        const event = {
          id: obj.id,
          x: obj.x,
          y: obj.y,
          width: obj.width,
          height: obj.height,
          type: obj.properties.find(prop => prop.name === "type")?.value,
          data: obj.properties.find(prop => prop.name === "text")?.value,
          active: true,
        };
  
        const adjustedX = obj.x + obj.width / 2;  // 中心補正
        const adjustedY = obj.y - obj.height / 2; // 中心補正
  
        // イメージをシーンに追加
        const addimage = this.scene.add.image(adjustedX, adjustedY, image, frame)
          .setOrigin(0.5, 0.5) // 必要に応じてオリジンを調整
          .setDepth(10)   // 深度を設定して他のオブジェクトとの重なりを調整
          .setDisplaySize(event.width, event.height);

        this.imageGroup.add(addimage); // グループに追加
  
        return event;
      });
    }
  }
    
  // 指定範囲内のイベントを検索（矩形の重なりを判定）
  findEventAt(area) {
    return this.events.find(event => {
      const eventRect = {
        x: event.x,
        y: event.y,
        width: event.width,
        height: event.height,
      };
      return this.isRectOverlap(area, eventRect);
    });
  }

  // 矩形同士が重なっているかを判定する関数
  isRectOverlap(rectA, rectB) {
    return !(
      rectA.x > rectB.x + rectB.width || // AがBの右側にある
      rectA.x + rectA.width < rectB.x || // AがBの左側にある
      rectA.y > rectB.y + rectB.height || // AがBの下側にある
      rectA.y + rectA.height < rectB.y    // AがBの上側にある
    );
  }
  triggerEvent(event, player) {
    switch (event.type) {
      case "dialog":
        this.startDialog(event.data);
        break;
      case "item":
        this.giveItemToPlayer(event.data, player);
        break;
      default:
        console.warn("未対応のイベントタイプ:", event.type);
    }
  }
  startDialog(data) {
    console.log("セリフイベント:", data);
    // 実際のダイアログUI表示処理
  }
  giveItemToPlayer(data, player) {
    console.log("アイテムを取得:", data.itemName);
    player.itemManager.addItem({ name: data.itemName });
  }

  clearEventImages() {
    this.imageGroup.clear(true, true); // グループ内の全てのオブジェクトを削除
  }
 }