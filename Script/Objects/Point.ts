namespace Snake.Objects
{
    export class Point
    {
        constructor(x: number, y: number, colour?: string){
            this.X = Math.round(x || 0);
            this.Y = Math.round(y || 0);
            this.Colour = colour || '#404040';
        }

        public X: number;
        public Y: number;
        public Colour: string;

        public IsCollision(point: Point){
            return this.X == point.X 
                && this.Y == point.Y;
        }

        public Move(direction: Direction){
            switch(direction){
                case Direction.Up:
                    return new Point(this.X, this.Y -1, this.Colour);
                case Direction.Down:
                    return new Point(this.X, this.Y +1, this.Colour);
                
                case Direction.Left:
                    return new Point(this.X -1, this.Y, this.Colour);
                case Direction.Right:
                    return new Point(this.X +1, this.Y, this.Colour);
            }
        }

        public MoveReverse(direction: Direction){
            switch(direction){
                case Direction.Up:
                    return this.Move(Direction.Down);
                case Direction.Down:
                    return this.Move(Direction.Up);
                
                case Direction.Left:
                    return this.Move(Direction.Right);
                case Direction.Right:
                    return this.Move(Direction.Left);
            }
        }

        public Constrain(maxX: number, maxY: number){

            if(this.X < 0){
                this.X = maxX + (this.X % maxX); 
            }
            if(this.X > maxX){
                this.X = this.X % maxX;
            }

            if(this.Y < 0){
                this.Y = maxY + (this.Y % maxY); 
            }            
            if(this.Y > maxY){
                this.Y = this.Y % maxY;
            }

            return this;
        }

        public static GetRandom(maxX: number, maxY: number){
            return new Point(
                Math.random() * maxX,
                Math.random() * maxY
            );
        }
    }
    
}