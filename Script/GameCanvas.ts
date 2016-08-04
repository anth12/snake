
namespace Snake
{
    export class GameCanvas
    {

        constructor(htmlCanvas: HTMLCanvasElement, getGameObjects: ()=> Array<Objects.ICanvasObject>){
            this.HtmlCanvas = htmlCanvas;
            this.Context = htmlCanvas.getContext("2d");

            // Begin the render loop
            const framerate = 30;
            setInterval(()=> this.Render(), 1000 / framerate);
            
            // Attache event handlers
            window.addEventListener('resize', ()=> Utilities.Debounce(this.Resize, 250));
            this.Resize();

            // Generic settings
            this.HtmlCanvas.style.background = '#161616';
            this.HtmlCanvas.style.height = '100%';
            this.HtmlCanvas.style.width = '100%';
        }

        public HtmlCanvas: HTMLCanvasElement;
        public Context: CanvasRenderingContext2D;

        ///<summary>Total number of cells wide the game canvas takes</summary>
        public GridWidth: number;
        ///<summary>Total number of cells high the game canvas takes</summary>
        public GridHeight: number;
        ///<summary>Number of pixels (in height) each cell takes</summary>
        public CellWidth: number = 20;
        ///<summary>Number of pixels (in width) each cell takes</summary>
        public CellHeight: number = 20;

        public GetGameObjects: ()=> Array<Objects.ICanvasObject>;
        //public CollisionDetectors: ICollisionDetector[];

        public Render(){
            // Clear the canvas
            this.Context.clearRect(0, 0, this.HtmlCanvas.clientWidth, this.HtmlCanvas.clientHeight);

            let renderObjects = this.GetGameObjects();

            renderObjects.selectMany(o=> o.GetRenderPoints())
                .forEach(point=> 
            {
                this.Context.fillStyle = point.Colour;

                let x = point.X * this.CellWidth;
                let y = point.Y * this.CellHeight;
                this.Context.fillRect(x, y, this.CellWidth, this.CellHeight);
            }, this);
        }

        private Resize(){
            this.GridWidth = window.innerWidth / this.CellWidth;
            this.GridHeight = window.innerHeight / this.CellHeight;
            this.HtmlCanvas.width = window.innerWidth;
            this.HtmlCanvas.height = window.innerHeight;
        }

        // #endregion
    }
}