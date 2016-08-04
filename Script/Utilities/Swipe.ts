namespace Snake.Utilities
{
    export function Swipe(gesuredZone: HTMLElement, eventHandler: (direction: Objects.Direction)=> void) {

        let touchstartX = 0;
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;

        gesuredZone.addEventListener('touchstart', function(event: TouchEvent) {
            
            touchstartX = event.touches.item(0).screenX;
            touchstartY = event.touches.item(0).screenY;
        }, false);

        // TODO change to touchmove
        // As soon as the difference is greater than the tollerance trigger a move and reset the start position
        gesuredZone.addEventListener('touchmove', function(event) {
            event.preventDefault();
            
            const tollerance = 10;

            touchendX = event.touches.item(0).screenX;
            touchendY = event.touches.item(0).screenY;
            
            let horizontal = touchendX - touchstartX;
            let verticle = touchendY - touchstartY;
            
            let horizontalAbs = Math.abs(horizontal);
            let verticleAbs = Math.abs(verticle);

            if(horizontalAbs < tollerance
            || verticleAbs < tollerance){
                return;
            }

            let direction = Objects.Direction.None;

            if(verticleAbs > horizontalAbs){
                // Verticle swipe
                direction = verticle < 0
                    ? Objects.Direction.Up
                    : Objects.Direction.Down;
            } else{
                // Horizontal swipe                
                direction = horizontal < 0
                    ? Objects.Direction.Left
                    : Objects.Direction.Right;
            }

            touchstartX = touchendX;
            touchstartY = touchendY;

            if(direction != Objects.Direction.None)
                eventHandler(direction);

        }, false);         
    }

    // #region TouchEvent interface
    interface Touch {
        identifier:number;
        target:EventTarget;
        screenX:number;
        screenY:number;
        clientX:number;
        clientY:number;
        pageX:number;
        pageY:number;
    };

    interface TouchList {
        length:number;
        item (index:number):Touch;
        identifiedTouch(identifier:number):Touch;
        };

    interface TouchEvent extends UIEvent {
        touches:TouchList;
        targetTouches:TouchList;
        changedTouches:TouchList;
        altKey:boolean;
        metaKey:boolean;
        ctrlKey:boolean;
        shiftKey:boolean;
    };

    declare var TouchEvent: {
        prototype: TouchEvent;
        new(): TouchEvent;
    }
    // #endregion
}