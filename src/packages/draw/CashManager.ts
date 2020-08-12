type IRepaint = (image: CanvasImageSource) => void;

class CashManager {
  // private currentIndex: number;
  private cashList: string[] = [];
  private canvas: HTMLCanvasElement;
  private readonly repaint: IRepaint;
  private readonly ctx: CanvasRenderingContext2D;

  public constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, repaint: IRepaint) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.repaint = repaint;
  }

  public clear() {
    this.cashList = [];
  }

  public undo() {
    if (!this.cashList || this.cashList.length === 0) {
      return;
    }

    // const cash = this.cashList[this.cashList.length - 1];
    // console.log(this.repaint, cash);
  }

  public redo() {
    console.log(this.repaint, this.ctx);
  }

  public addRecord() {
    this.cashList.push(this.canvas.toDataURL());
    // this.currentIndex = this.cashList.length - 1;
  }
}

export default CashManager;
