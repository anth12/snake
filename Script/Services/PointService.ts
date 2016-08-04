
namespace Snake.Services
{
    export class PointService implements Objects.ICanvasObject
    {

        constructor(gameCanvas: GameCanvas, snakeService: SnakeService){
            this.GameCanvas = gameCanvas;
            this.SnakeService = snakeService;
            
            this.SnakeService.Snake.OnMove = (s)=> this.SnakeMove(s); 

            for(var index = 0; index < 5; index++){
                this.CreateLife();
            }
        }

        public GameCanvas: GameCanvas;
        public SnakeService: SnakeService;
        public Points: Array<Objects.Point> = new Array<Objects.Point>();

        public GetRenderPoints = ()=> this.Points;

        private SnakeMove(snake: Objects.Snake){

            // Detect collision with snake head and point
            this.Points.forEach((point, index) => {
                if(snake.HeadPoint.IsCollision(point)){
                    
                    // TODO remove the point
                    snake.Length++;
                    // Add the tail in the same direction as the last body part
                    snake.DirectionHistory.splice(0, 0, snake.DirectionHistory[0]);

                    this.CreateLife();

                    this.Points.splice(index, 1);
                    return false; // Impossible to collide with multiple points at a time
                }
            });
        }

        private CreateLife(){
            // TODO add logic to keep away from others
            this.Points.push(
                new Objects.Point(
                    Math.random() * this.GameCanvas.GridWidth,
                    Math.random() * this.GameCanvas.GridHeight
                )
            )
        }
    }
}