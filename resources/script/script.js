var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var me = true;

//设置划线的颜色
context.strokeStyle="#BFBFBF";

//记录当前步数的数组
var recourd = [];

//用来记录赢法的数组
var winCount = [];

//是否结束
var over = false;

//用来记录赢法的个数
var count = 0;

//赢法统计数组
var myWin = [];
var computerWin = [];

//初始化赢法统计数组
for (var i = 0; i < 572; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}

//初始化记录赢法的数组
for (var i = 0; i < 15; i++) {
	winCount[i] = [];
	for (var j = 0; j < 15; j++) {
		winCount[i][j] = [];
	}
}


//横向的赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			winCount[i][j+k][count] = true;
		}
		count++;
	}
}

//纵向的赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			winCount[j+k][i][count] = true;
		}
		count++;
	}
}

//斜向的赢法
for (var i = 0; i < 11; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			winCount[i+k][j+k][count] = true;
		}
		count++;
	}
}

//反斜向的赢法
for (var i = 4; i < 15; i++) {
	for (var j = 0; j <11; j++) {
		for (var k = 0; k < 5; k++) {
			winCount[i-k][j+k][count] = true;
		}
		count++;
	}
}

console.log(count);




//初始化记录棋子的数组
var initRecourd = function (){
	for (var i = 0; i < 15; i++) {
		recourd[i] = [];
		for (var j = 0; j < 15; j++) {
			recourd[i][j] = 0;
		};
	};
}

//设置背景图片
var background = new Image();
background.src = "resources/img/background.jpg";
background.onload = function(){
	context.drawImage(background,0,0,450,450);
	initRecourd();
	drawBackground();
}

function drawBackground(){
for (var i = 0; i < 15; i++) {
		context.moveTo(15 + 30*i, 15);
		context.lineTo(15 + 30*i, 435);
		context.stroke();

		context.moveTo(15,15+30*i);
		context.lineTo(435,15+30*i);
		context.stroke();
	};
}

//走一步
var oneStep = function (i,j,me){
	context.beginPath();
	context.arc(15+30*i,15+30*j,13,0,2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15+30*i,15+30*j,13,15+30*i,15+30*j,3);

	if(me){
		//白棋
		gradient.addColorStop(0,"#D1D1D1");
		gradient.addColorStop(1,"#F9F9F9");
	} else {
		//黑棋
		gradient.addColorStop(0,"#0A0A0A");
		gradient.addColorStop(1,"#636766");
		
	}
	context.fillStyle = gradient;
	context.fill();
}

//设置点击落子
chess.onclick = function (e){
	if(over){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if (recourd[i][j] == 0) {
		oneStep(i,j,me);

		recourd[i][j] = 1;
		for (var k = 0; k < count; k++) {
			if(winCount[i][j][k]){
				myWin[k]++;
				computerWin[k] = 6;
				if (myWin[k] == 5) {
					over = true;
					alert("你赢了。");
					return;
				};
			}
		};
		me=!me;
		computerAI();
		me=!me;
	}
}

var computerAI = function(){
	//记录人在某点的分数
	var myScore = [];
	//记录计算机在某点的分数
	var computerScore = [];

	var max = 0;
	var comX,comY;

	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		};
	};

	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			for (var k = 0; k < count; k++) {
				if(winCount[i][j][k] && recourd[i][j] == 0){
			//计算分数
			if (myWin[k] == 1) {
				myScore[i][j] += 200;
			}
			if (myWin[k] == 2) {
				myScore[i][j] += 400;
			}
			if (myWin[k] == 3) {
				myScore[i][j] += 1000;
			}
			if (myWin[k] == 4) {
				myScore[i][j] += 5000;
			}

			if (computerWin[k] == 1) {
				computerScore[i][j] += 210;
			}
			if (computerWin[k] == 2) {
				computerScore[i][j] += 410;
			}
			if (computerWin[k] == 3) {
				computerScore[i][j] += 1100;
			}
			if (computerWin[k] == 4) {
				computerScore[i][j] += 50000;
			}
			//判断落子
			if(myScore[i][j] > max){
				max = myScore[i][j];
				comX = i;
				comY = j;
			}

			if(computerScore[i][j] > max){
				max = computerScore[i][j];
				comX = i;
				comY = j;
			}
		}
		}
		}
	}
	
    oneStep(comX,comY,me);
    recourd[comX][comY] = 2;

	for (var k = 0; k < count; k++) {
		if (winCount[comX][comY][k]) {
			computerWin[k]++;
			if (computerWin[k] == 5) {
				alert("笨蛋，电脑赢了。");
			}
		}
	}
}