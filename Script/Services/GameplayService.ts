
namespace Snake.Services
{
    export class GameplayService
    {

        constructor(htmlCanvas: HTMLCanvasElement){
            this.GameCanvas = new GameCanvas(htmlCanvas, this.GetGameObjects);
            
            this.GameCanvas.GetGameObjects = ()=> this.GetGameObjects();
            this.StartNewGame();
        }

        public GameCanvas: GameCanvas;

        public SnakeService: SnakeService;
        public PointService: PointService;

        public StartNewGame(){
            this.SnakeService = new SnakeService(this.GameCanvas);
            this.PointService = new PointService(this.GameCanvas, this.SnakeService);

            this.SnakeService.Snake.OnDie = (snake) =>{
                this.StartNewGame();
            }
        }

        public GetGameObjects(){
            var objects = new Array<Objects.ICanvasObject>(
                this.SnakeService.Snake,
                this.PointService
            );

            //objects.push.apply(objects, );

            return objects;
        }
    }
}