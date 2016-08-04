/// <reference path="../Lib/typings/hammerjs/hammerjs-1.1.3.d.ts" />

namespace Snake.Services
{
    export class SnakeService
    {

        constructor(gameCanvas: GameCanvas){
            this.GameCanvas = gameCanvas;
            // Render the objects
            this.Snake = new Objects.Snake(this.GameCanvas);
            
            // Attache event handlers
            window.addEventListener('keydown', (e)=> this.KeyDown(e));
            
            Utilities.Swipe(this.GameCanvas.HtmlCanvas, (d)=> this.OnSwipe(d));
        }

        public Snake: Objects.Snake;
        public GameCanvas: GameCanvas;
        
        //public CollisionDetectors: ICollisionDetector[];

        // #region Event handlers
        private OnSwipe(direction: Objects.Direction){
            this.Snake.DirectionHistory.push(direction);
        }

        private KeyDown(event: KeyboardEvent){
            event.preventDefault();
            
            switch (event.keyCode) {
                case 37: // Left arrow
                case 65: // A
                    this.Snake.DirectionHistory.push(Objects.Direction.Left);
                    break;
                case 38: // Up arrow
                case 87: // W
                    this.Snake.DirectionHistory.push(Objects.Direction.Up);
                    break;
                case 39: // Right arrow
                case 68: // D
                    this.Snake.DirectionHistory.push(Objects.Direction.Right);
                    break;
                case 40: // Down arrow
                case 83: // S
                    this.Snake.DirectionHistory.push(Objects.Direction.Down);
                    break;
            }
        }
        // #endregion
    }
}