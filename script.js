window.addEventListener('keypress',(e)=>{
	if(e.key === 'Enter'){
		drawOverlay.toggleSolid();
	}
	if(e.key === 'c'){
		drawOverlay.clear();
	}
	if(e.key === 'q'){
		drawOverlay.move(-1);
	}
	if(e.key === 'e'){
		drawOverlay.move(1);
	}
});



class DrawOverlay{
	constructor(){
		this.solid = false;
		this.points = [[]];
		this.colors = ['black','red','green','blue','white','yellow'];
		this.pointIndex = 0;
		this.initCanvas();
		this.x = 0;
		this.y = 0;
		this.canvas.addEventListener('click',(e)=>{
			this.addPoint(e.clientX, e.clientY);
		});
		this.canvas.addEventListener('mousemove',(e)=>{
			this.x = e.clientX;
			this.y = e.clientY;
		});
		this.interval = setInterval(()=>{
			this.render();
		});
	}
	initCanvas(){
		this.canvas = document.createElement('canvas');
		this.canvas.style.position = 'fixed'; 
		this.canvas.style.left = '0px';
		this.canvas.style.top = '0px';
		this.canvas.width = innerWidth;
		this.canvas.height = innerHeight;
		this.ctx = this.canvas.getContext('2d');
		this.canvas.style.pointerEvents = 'none';
		this.canvas.style.zIndex = '9999999';
		document.body.appendChild(this.canvas);
	}
	move(direction){
		this.pointIndex += direction;
		if(this.pointIndex < 0){
			this.pointIndex = this.colors.length - 1;
		}
		if(this.pointIndex >= this.colors.length){
			this.pointIndex = 0;
		}
		if(!this.points[this.pointIndex]){
			this.points[this.pointIndex] = [];
		}
	}
	clear(){
		this.points[this.pointIndex] = [];
	}
	addPoint(x,y){
		this.points[this.pointIndex].push(new Point(x,y));
	}
	render(){
		let ctx = this.ctx;
		let canvas = this.canvas;
		let points = this.points[this.pointIndex];
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for(let j = 0; j < this.colors.length; j++){
			let points = this.points[j];
			if(points && points.length > 0){
				ctx.strokeStyle = this.colors[j];
				ctx.beginPath();
				ctx.moveTo(points[0].x,points[0].y);
				for(let i = 1; i < points.length; i++){
					ctx.lineTo(points[i].x,points[i].y);
				}
				if(this.solid && j === this.pointIndex)
					ctx.lineTo(this.x,this.y);
				ctx.stroke();
			}
			ctx.fillStyle = this.colors[j];
			ctx.font = '20px Arial';
			if(j === this.pointIndex)
				ctx.font = '30px Arial';
			let value = this.totalDist(points).toFixed(2);
			let x = canvas.width/this.colors.length  * (j);
			ctx.fillText(value,x, canvas.height - 30);
		}
	}
	totalDist(points){
		if(!points) return 0;
		let total = 0;
		for(let i = 0; i < points.length-1; i++){
			total += this.dist(points[i].x,points[i].y,points[i+1].x,points[i+1].y);
		}
		return total;
	}
	toggleSolid(){
		if(this.solid){
			this.canvas.style.pointerEvents = 'none';
		} else {
			this.canvas.style.pointerEvents = 'auto';
		}
		this.solid = !this.solid;
	}
	dist(x1,y1,x2,y2){
		return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	}
}
class Point{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}

let drawOverlay = new DrawOverlay();


