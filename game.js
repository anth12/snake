var Snake;
(function (Snake) {
    var GameCanvas = (function () {
        function GameCanvas(htmlCanvas, getGameObjects) {
            var _this = this;
            ///<summary>Number of pixels (in height) each cell takes</summary>
            this.CellWidth = 20;
            ///<summary>Number of pixels (in width) each cell takes</summary>
            this.CellHeight = 20;
            this.HtmlCanvas = htmlCanvas;
            this.Context = htmlCanvas.getContext("2d");
            // Begin the render loop
            var framerate = 30;
            setInterval(function () { return _this.Render(); }, 1000 / framerate);
            // Attache event handlers
            window.addEventListener('resize', function () { return Snake.Utilities.Debounce(_this.Resize, 250); });
            this.Resize();
            // Generic settings
            this.HtmlCanvas.style.background = '#161616';
            this.HtmlCanvas.style.height = '100%';
            this.HtmlCanvas.style.width = '100%';
        }
        //public CollisionDetectors: ICollisionDetector[];
        GameCanvas.prototype.Render = function () {
            var _this = this;
            // Clear the canvas
            this.Context.clearRect(0, 0, this.HtmlCanvas.clientWidth, this.HtmlCanvas.clientHeight);
            var renderObjects = this.GetGameObjects();
            renderObjects.selectMany(function (o) { return o.GetRenderPoints(); })
                .forEach(function (point) {
                _this.Context.fillStyle = point.Colour;
                var x = point.X * _this.CellWidth;
                var y = point.Y * _this.CellHeight;
                _this.Context.fillRect(x, y, _this.CellWidth, _this.CellHeight);
            }, this);
        };
        GameCanvas.prototype.Resize = function () {
            this.GridWidth = window.innerWidth / this.CellWidth;
            this.GridHeight = window.innerHeight / this.CellHeight;
            this.HtmlCanvas.width = window.innerWidth;
            this.HtmlCanvas.height = window.innerHeight;
        };
        return GameCanvas;
    }());
    Snake.GameCanvas = GameCanvas;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    document.addEventListener("DOMContentLoaded", function () {
        var canvas = document.getElementById("GameCanvas");
        var game = new Snake.Services.GameplayService(canvas);
    });
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Collision;
    (function (Collision) {
        var LifeCollisionDetector = (function () {
            function LifeCollisionDetector() {
            }
            LifeCollisionDetector.prototype.Run = function () {
            };
            return LifeCollisionDetector;
        }());
        Collision.LifeCollisionDetector = LifeCollisionDetector;
    })(Collision = Snake.Collision || (Snake.Collision = {}));
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Objects;
    (function (Objects) {
        (function (Direction) {
            Direction[Direction["None"] = 0] = "None";
            Direction[Direction["Up"] = 1] = "Up";
            Direction[Direction["Right"] = 2] = "Right";
            Direction[Direction["Down"] = 3] = "Down";
            Direction[Direction["Left"] = 4] = "Left";
        })(Objects.Direction || (Objects.Direction = {}));
        var Direction = Objects.Direction;
    })(Objects = Snake.Objects || (Snake.Objects = {}));
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Objects;
    (function (Objects) {
        var Point = (function () {
            function Point(x, y, colour) {
                this.X = Math.round(x || 0);
                this.Y = Math.round(y || 0);
                this.Colour = colour || '#404040';
            }
            Point.prototype.IsCollision = function (point) {
                return this.X == point.X
                    && this.Y == point.Y;
            };
            Point.prototype.Move = function (direction) {
                switch (direction) {
                    case Objects.Direction.Up:
                        return new Point(this.X, this.Y - 1, this.Colour);
                    case Objects.Direction.Down:
                        return new Point(this.X, this.Y + 1, this.Colour);
                    case Objects.Direction.Left:
                        return new Point(this.X - 1, this.Y, this.Colour);
                    case Objects.Direction.Right:
                        return new Point(this.X + 1, this.Y, this.Colour);
                }
            };
            Point.prototype.MoveReverse = function (direction) {
                switch (direction) {
                    case Objects.Direction.Up:
                        return this.Move(Objects.Direction.Down);
                    case Objects.Direction.Down:
                        return this.Move(Objects.Direction.Up);
                    case Objects.Direction.Left:
                        return this.Move(Objects.Direction.Right);
                    case Objects.Direction.Right:
                        return this.Move(Objects.Direction.Left);
                }
            };
            Point.prototype.Constrain = function (maxX, maxY) {
                if (this.X < 0) {
                    this.X = maxX + (this.X % maxX);
                }
                if (this.X > maxX) {
                    this.X = this.X % maxX;
                }
                if (this.Y < 0) {
                    this.Y = maxY + (this.Y % maxY);
                }
                if (this.Y > maxY) {
                    this.Y = this.Y % maxY;
                }
                return this;
            };
            Point.GetRandom = function (maxX, maxY) {
                return new Point(Math.random() * maxX, Math.random() * maxY);
            };
            return Point;
        }());
        Objects.Point = Point;
    })(Objects = Snake.Objects || (Snake.Objects = {}));
})(Snake || (Snake = {}));
var Snake;
(function (Snake_1) {
    var Objects;
    (function (Objects) {
        var Snake = (function () {
            function Snake(canvas) {
                var _this = this;
                this.DirectionHistory = new Array();
                this.GetRenderPoints = function () { return _this.Points; };
                this.Velocity = 6;
                this.Length = 5;
                this.GameCanvas = canvas;
                // Pre-populate the history
                this.HeadPoint = new Objects.Point(canvas.GridWidth / 2, canvas.GridHeight / 2);
                for (var index = 0; index <= this.Length; index++) {
                    this.DirectionHistory.push(Objects.Direction.Right);
                }
                // Begin movement
                this.Move();
            }
            Snake.prototype.Move = function (preventRecurse) {
                var _this = this;
                // Remove the oldest historical orientation
                this.DirectionHistory.splice(0, 1);
                // If a different direction has not been queued, duplicate the last direction
                if (this.DirectionHistory.length < this.Length) {
                    this.DirectionHistory.push(this.DirectionHistory.last());
                }
                // Restrict the direction queue to 3 moves
                this.DirectionHistory.splice(this.Length + 3, this.DirectionHistory.length - (this.Length + 3));
                // Move the tail
                this.HeadPoint = this.HeadPoint
                    .Move(this.DirectionHistory[this.Length - 1])
                    .Constrain(this.GameCanvas.GridWidth, this.GameCanvas.GridHeight);
                // Recreate the points
                this.Points = new Array(this.HeadPoint);
                // Create the tail
                var lastPoint = this.HeadPoint;
                for (var index = this.Length - 1; index >= 0; index--) {
                    lastPoint = lastPoint.MoveReverse(this.DirectionHistory[index])
                        .Constrain(this.GameCanvas.GridWidth, this.GameCanvas.GridHeight);
                    ;
                    this.Points.splice(0, 0, lastPoint);
                }
                if (!preventRecurse) {
                    // Trigger another movement
                    setTimeout(function () { return _this.Move(); }, 1000 / this.Velocity);
                }
                this.DetectCollision();
                if (this.OnMove)
                    this.OnMove(this);
            };
            Snake.prototype.DetectCollision = function () {
                var _this = this;
                // The head and first 3 body parts cannot possibly colide with the head so ignore them
                this.Points
                    .take(this.Points.length - 4)
                    .forEach(function (point) {
                    if (_this.HeadPoint.IsCollision(point)) {
                        // Collision detected
                        _this.OnDie(_this);
                        return false;
                    }
                });
            };
            return Snake;
        }());
        Objects.Snake = Snake;
    })(Objects = Snake_1.Objects || (Snake_1.Objects = {}));
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Services;
    (function (Services) {
        var GameplayService = (function () {
            function GameplayService(htmlCanvas) {
                var _this = this;
                this.GameCanvas = new Snake.GameCanvas(htmlCanvas, this.GetGameObjects);
                this.GameCanvas.GetGameObjects = function () { return _this.GetGameObjects(); };
                this.StartNewGame();
            }
            GameplayService.prototype.StartNewGame = function () {
                var _this = this;
                this.SnakeService = new Services.SnakeService(this.GameCanvas);
                this.PointService = new Services.PointService(this.GameCanvas, this.SnakeService);
                this.SnakeService.Snake.OnDie = function (snake) {
                    _this.StartNewGame();
                };
            };
            GameplayService.prototype.GetGameObjects = function () {
                var objects = new Array(this.SnakeService.Snake, this.PointService);
                //objects.push.apply(objects, );
                return objects;
            };
            return GameplayService;
        }());
        Services.GameplayService = GameplayService;
    })(Services = Snake.Services || (Snake.Services = {}));
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Services;
    (function (Services) {
        var PointService = (function () {
            function PointService(gameCanvas, snakeService) {
                var _this = this;
                this.Points = new Array();
                this.GetRenderPoints = function () { return _this.Points; };
                this.GameCanvas = gameCanvas;
                this.SnakeService = snakeService;
                this.SnakeService.Snake.OnMove = function (s) { return _this.SnakeMove(s); };
                for (var index = 0; index < 5; index++) {
                    this.CreateLife();
                }
            }
            PointService.prototype.SnakeMove = function (snake) {
                var _this = this;
                // Detect collision with snake head and point
                this.Points.forEach(function (point, index) {
                    if (snake.HeadPoint.IsCollision(point)) {
                        // TODO remove the point
                        snake.Length++;
                        // Add the tail in the same direction as the last body part
                        snake.DirectionHistory.splice(0, 0, snake.DirectionHistory[0]);
                        _this.CreateLife();
                        _this.Points.splice(index, 1);
                        return false; // Impossible to collide with multiple points at a time
                    }
                });
            };
            PointService.prototype.CreateLife = function () {
                // TODO add logic to keep away from others
                this.Points.push(new Snake.Objects.Point(Math.random() * this.GameCanvas.GridWidth, Math.random() * this.GameCanvas.GridHeight));
            };
            return PointService;
        }());
        Services.PointService = PointService;
    })(Services = Snake.Services || (Snake.Services = {}));
})(Snake || (Snake = {}));
/// <reference path="../Lib/typings/hammerjs/hammerjs-1.1.3.d.ts" />
var Snake;
(function (Snake) {
    var Services;
    (function (Services) {
        var SnakeService = (function () {
            function SnakeService(gameCanvas) {
                var _this = this;
                this.GameCanvas = gameCanvas;
                // Render the objects
                this.Snake = new Snake.Objects.Snake(this.GameCanvas);
                // Attache event handlers
                window.addEventListener('keydown', function (e) { return _this.KeyDown(e); });
                Snake.Utilities.Swipe(this.GameCanvas.HtmlCanvas, function (d) { return _this.OnSwipe(d); });
            }
            //public CollisionDetectors: ICollisionDetector[];
            // #region Event handlers
            SnakeService.prototype.OnSwipe = function (direction) {
                this.Snake.DirectionHistory.push(direction);
            };
            SnakeService.prototype.KeyDown = function (event) {
                event.preventDefault();
                switch (event.keyCode) {
                    case 37: // Left arrow
                    case 65:
                        this.Snake.DirectionHistory.push(Snake.Objects.Direction.Left);
                        break;
                    case 38: // Up arrow
                    case 87:
                        this.Snake.DirectionHistory.push(Snake.Objects.Direction.Up);
                        break;
                    case 39: // Right arrow
                    case 68:
                        this.Snake.DirectionHistory.push(Snake.Objects.Direction.Right);
                        break;
                    case 40: // Down arrow
                    case 83:
                        this.Snake.DirectionHistory.push(Snake.Objects.Direction.Down);
                        break;
                }
            };
            return SnakeService;
        }());
        Services.SnakeService = SnakeService;
    })(Services = Snake.Services || (Snake.Services = {}));
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Utilities;
    (function (Utilities) {
        function Debounce(func, wait, immediate) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate)
                        func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow)
                    func.apply(context, args);
            };
        }
        Utilities.Debounce = Debounce;
        ;
    })(Utilities = Snake.Utilities || (Snake.Utilities = {}));
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Utilities;
    (function (Utilities) {
        function Swipe(gesuredZone, eventHandler) {
            var touchstartX = 0;
            var touchstartY = 0;
            var touchendX = 0;
            var touchendY = 0;
            gesuredZone.addEventListener('touchstart', function (event) {
                touchstartX = event.touches.item(0).screenX;
                touchstartY = event.touches.item(0).screenY;
            }, false);
            // TODO change to touchmove
            // As soon as the difference is greater than the tollerance trigger a move and reset the start position
            gesuredZone.addEventListener('touchmove', function (event) {
                event.preventDefault();
                var tollerance = 10;
                touchendX = event.touches.item(0).screenX;
                touchendY = event.touches.item(0).screenY;
                var horizontal = touchendX - touchstartX;
                var verticle = touchendY - touchstartY;
                var horizontalAbs = Math.abs(horizontal);
                var verticleAbs = Math.abs(verticle);
                if (horizontalAbs < tollerance
                    || verticleAbs < tollerance) {
                    return;
                }
                var direction = Snake.Objects.Direction.None;
                if (verticleAbs > horizontalAbs) {
                    // Verticle swipe
                    direction = verticle < 0
                        ? Snake.Objects.Direction.Up
                        : Snake.Objects.Direction.Down;
                }
                else {
                    // Horizontal swipe                
                    direction = horizontal < 0
                        ? Snake.Objects.Direction.Left
                        : Snake.Objects.Direction.Right;
                }
                touchstartX = touchendX;
                touchstartY = touchendY;
                if (direction != Snake.Objects.Direction.None)
                    eventHandler(direction);
            }, false);
        }
        Utilities.Swipe = Swipe;
        ;
        ;
        ;
    })(Utilities = Snake.Utilities || (Snake.Utilities = {}));
})(Snake || (Snake = {}));
Array.prototype.contains = function (obj) {
    var i = this.length - 1;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
Array.prototype.first = function (predicate) {
    var i = 0;
    while (i < this.length) {
        if (predicate == null || predicate(this[i])) {
            return this[i];
        }
        i++;
    }
    return null;
};
Array.prototype.last = function (predicate) {
    var i = this.length - 1;
    while (i >= 0) {
        if (predicate == null || predicate(this[i])) {
            return this[i];
        }
        i++;
    }
    return null;
};
Array.prototype.selectMany = function (predicate) {
    var result = new Array();
    var i = 0;
    while (i < this.length) {
        result.push.apply(result, predicate(this[i]));
        i++;
    }
    return result;
};
Array.prototype.skip = function (number) {
    return this.slice(number, this.length);
};
Array.prototype.take = function (number) {
    return this.slice(0, number);
};
//# sourceMappingURL=game.js.map