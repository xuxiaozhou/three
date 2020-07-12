// const loadImage = (src: string, callback: (image: HTMLImageElement | false) => void) => {
//   const image = new Image();
//   image.src = src;
//   image.onload = () => {
//     callback(image);
//   };
//   image.onerror = () => {
//     callback(false);
//   }
// };

class CashManager {
  private cashList: string[] = [];
  private canvas: HTMLCanvasElement;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public clear() {
    this.cashList = [];
  }

  public add() {
    this.cashList.push(this.canvas.toDataURL());
  }

  public undo(repaint: (image: CanvasImageSource) => void) {
  }

  public redo(repaint: (image: CanvasImageSource) => void) {
  }

  public record() {

  }
}

export default CashManager;
