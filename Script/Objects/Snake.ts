namespace Snake.Objects
{
    export class Snake implements ICanvasObject
    {
        constructor(canvas: GameCanvas){
            this.Velocity = 6;
            this.Length = 5;

            this.GameCanvas = canvas;

            // Pre-populate the history
            this.HeadPoint = new Point(canvas.GridWidth/2, canvas.GridHeight /2);
            for(var index = 0; index <= this.Length; index++){
                this.DirectionHistory.push(Direction.Right);
            }
            // Begin movement
            this.Move();
        }

        public Velocity: number;
        public Points: Point[];
        public HeadPoint: Point;
        public DirectionHistory: Direction[] = new Array<Direction>();
        public Length: number;

        // Events
        public OnMove: (snake: Snake) => void;
        public OnDie: (snake: Snake) => void;
        private GameCanvas: GameCanvas;

        public GetRenderPoints = ()=> this.Points;
        

        private Move(preventRecurse?: boolean){

            // Remove the oldest historical orientation
            this.DirectionHistory.splice(0, 1);

            // If a different direction has not been queued, duplicate the last direction
            if(this.DirectionHistory.length < this.Length){
                this.DirectionHistory.push(this.DirectionHistory.last());
            }

            // Restrict the direction queue to 3 moves
            this.DirectionHistory.splice(this.Length +3, this.DirectionHistory.length - (this.Length +3));

            // Move the tail
            this.HeadPoint = this.HeadPoint
                        .Move(this.DirectionHistory[this.Length -1])
                        .Constrain(this.GameCanvas.GridWidth, this.GameCanvas.GridHeight);
            
            // Recreate the points
            this.Points = new Array<Point>(this.HeadPoint);

            // Create the tail
            let lastPoint = this.HeadPoint;
            for(var index = this.Length -1; index >= 0; index--){

                lastPoint = lastPoint.MoveReverse(this.DirectionHistory[index])
                        .Constrain(this.GameCanvas.GridWidth, this.GameCanvas.GridHeight);;
                this.Points.splice(0, 0, lastPoint);
            }

            if(!preventRecurse){
                // Trigger another movement
                setTimeout(()=> this.Move(), 1000 / this.Velocity)
            }

            this.DetectCollision();
            if(this.OnMove)
                this.OnMove(this);
        }

        private DetectCollision(){

            // The head and first 3 body parts cannot possibly colide with the head so ignore them
            this.Points
                    .take(this.Points.length - 4)
                    .forEach(point=>{
                
                if(this.HeadPoint.IsCollision(point)){
                    
                    // Collision detected
                    this.OnDie(this);
                    return false;
                }
            });
        }
    }
    
}