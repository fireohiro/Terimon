export default class EventManager {
  constructor(scene) {
    this.scene = scene;
    this.events = [];
  }
  loadEventsFromLayer(objectLayer) {
    this.events = objectLayer.objects.map(obj => ({
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height,
      type: obj.properties.find(prop => prop.name === "type")?.value,
      data: obj.properties.find(prop => prop.name === "text")?.value
    }));
  }
  // 指定範囲内のイベントを検索
  findEventAt(area) {
    return this.events.find(event =>
      area.x >= event.x && area.x <= event.x + event.width &&
      area.y >= event.y && area.y <= event.y + event.height
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
 }