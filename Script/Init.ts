namespace Snake{

    document.addEventListener("DOMContentLoaded", function(){
        
        var canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
                
        var game = new Services.GameplayService(canvas);
    });
}
