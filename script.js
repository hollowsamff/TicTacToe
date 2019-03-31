$("document").ready(function() {

  var gameType = "";//Two type - twoPlayers and computer 
  var userSign = "X";//Sign of current player
  var pickedUserSign = "";//Sign user picks at start of game
  var playerOneAnswer = [];
  var playerOneScore = 0; 
  var playerTwoAnswer = [];
  var playerTwoScore = 0;
  //Used to check if user got correct wining combination, used in findWinner and checkAnswer functions
  var playerOneAnswerMatch = 0;
  var playerTwoAnswerMatch = 0; 

  var turn = 0;
  //Used to declare draw when no one wins 
  var drawTest = [];
  var draws = 0;
  //Conditions to win game
  var winingAnswers = ["1|2|3","1|4|7","1|5|9","2|5|8","3|5|7","3|6|9","4|5|6","7|8|9"];
  
  //Used to start the findTime fuction - function is used to show timer between new games 
  var time;
  var seconds = 5;//Gap between games
  
 ///////////////////////////////////////////////////////////////////////Ai functions - picks ais moves
  
var ComputerWinAuto = "";//Used when computer wins in one turn
  
function pickMove(winingAnswers, storeBoardContentValue,player){
  
 var answer = "";//Player one last answer
 var possiblNextMove = "";//Next possible moves for the meet wining conditions
 var regexstrings = "";//Regex for the used to test if one of the  wining condtions from the winingAnswers array has been meet i.e  if the computer selected 1 from the 1|2|3
 var regexps = "";
  
 if(player =="playerOne"){//Code to find player one wining moves 
    
     for(var x = 0; x < winingAnswers.length; x++){//Loop though all the possible wining conditions

       regexstrings = winingAnswers[x];//Regex for the current condition on the loop i.e 1|2|3
       regexps = new RegExp(regexstrings,"gi");  

       //Every game square has a number between 1 and 9 and all the possible computer wining conditions are stored in the winingAnswersComputer array
       //Loop to see if the compter has meet any of computer wining conditions i.e. clicking the sqaure with the value 1 will match the 1 from the 1|2|3 wining condition
       while ((match = regexps.exec(playerOneAnswer.join(","))) != null) {
    
         answer += match;//Wining conditon meet
         //Find the next possible moves to win the game for the current wining condition i.e if the match is 1, 2 and 3 will be stored from the 1|2|3 wining condition
         for(var e = 0; e < winingAnswers[x].length; e++){   

             if(winingAnswers[x][e] !== "|" && storeBoardContentValue.includes(winingAnswers[x][e]) ){//If the move is inside the array the holds all the empty game squares 

               possiblNextMove += winingAnswers[x][e];            
             }//End if              
         }//End for   
         possiblNextMove += ","; 
         answer += ",";        
     }//End while      
   }//End for  
   //End code to find player one winning moves  
   
        //When a next move meets one of the game winning conditions 
        if(possiblNextMove !== ""){   

        possiblNextMove = possiblNextMove.replace(/,$\s*/, "");//Remove , at  end of string
        //alert("Answers"+possiblNextMove);    
        var possiblNextMoveString = possiblNextMove.replace(/,/g,"");//All possible answers in one string
                
       //alert(turn);         
      //The number of moves remaning until a win are stored in the possiblNextMove array, i.e if the computer has a pieace in square 1, 23  will be the first value in the array,
      //which means that the array elements with the smallest values are closer to a win i.e. if the size is 1 the computer is one move away from a win  
      var movesRemaining = possiblNextMove.split(",").reduce(function(a, b) {//Return the moves need to reach the wining condition the computer is closest to reaching
         if (typeof b != "undefined"){
          return a.length <= b.length ? a : b;
         }else{
          return a;
        }   
      });            
     }          
     //Return move when the computer is one move from wining
     if(movesRemaining.length == 1){;
        return movesRemaining[0];
     }   

    //When player starts on corner, go middle
    if(turn == 2){        
       if (answer[0] == 1 || answer[0] == 3|| answer[0] == 7|| answer[0] == 9){
         return "5";
       }       
    } 
    //When player starts on middle, go corner
    if(turn == 2){        
       if (answer[0] == 5){
        // return "1";
       }       
    }    
  //error if first square is 0, then winning combination is 4,2,0,8
   
   var goEdge = [];//Test if player one went on edge last
   var nextConditionss = possiblNextMoveString.split("").filter(function(current,index,array){

     if(current !== 1 || current !== 3|| current !== 7|| current !== 9){
       goEdge.push(current);
     }   
     if(current == 1 || current == 3|| current == 7|| current == 9){
       return current;     
     }         
   });      
   //When player picks edge, go corner next to picked edge
   if(answer[0] == 2|| answer[0] == 4|| answer[0] == 6|| answer[0] == 8){
     return nextConditionss[0];
   }else if(goEdge.length > 0){//Else after player has moved in a corner move in one of the edges
     return goEdge[goEdge.length-1];
   }
   
  //End player one find answer, start find computer one answer   
  }else{//When a player cannot win or has wining condition find compter best move
       for(var x = 0; x < winingAnswers.length; x++){//Find computer winning conditions
               regexstrings = winingAnswers[x];
               regexps = new RegExp(regexstrings,"gi");  
               while ((match = regexps.exec(playerTwoAnswer.join(","))) != null) {     
                   for(var e = 0; e < winingAnswers[x].length; e++){   
                     if(winingAnswers[x][e] !== "|" && storeBoardContentValue.includes(winingAnswers[x][e]) ){ 
                       possiblNextMove += winingAnswers[x][e];
                     }//End if       
                   }//End for
                  possiblNextMove += ","; 
               }//End while
       }//End for
  }//End else
   //alert(possiblNextMove);
  //When a next move meets one of the game winning conditions 
  if(possiblNextMove !== ""){   
    possiblNextMove = possiblNextMove.replace(/,$\s*/, "");//Remove , at  end of string
    //The number of moves remaning until a win are stored in the possiblNextMove array, i.e if the computer has a pieace in square 1, 23  will be the first value in the array,
    //which means that the array elements with the smallest values are closer to a win i.e. if the size is 1 the computer is one move away from a win  
    var movesRemaining = possiblNextMove.split(",").reduce(function(a, b) {//Return the moves need to reach the wining condition the computer is closest to reaching
      if (typeof b != "undefined"){
        return a.length <= b.length ? a : b;
      }else{
        return a;
      }   
    });  
  }   
 ComputerWinAuto = movesRemaining; 
 return movesRemaining;

}
//////////////////////////////////////////////////////////////////////////////////////////////////Ai functions - picks ais moves  

 function aiOne(){ 
   
     //Used to reset game timer between games
     clearInterval(time); 
     //Get all the values from all the squares on the board  
     var storeBoardContentValue = [];//Store the values of the square, squares have a value betwwen 1 and 9
     var allAnswers = [];//Store all the game squares
     $(".square").each(function(){
       allAnswers.push( $(this).attr("id"));     
       if($(this).text().length == 0){        
         storeBoardContentValue.push($(this).attr("value"));       
       }
    });  

   //When thier are unused squares with no pieces in them on the board, pick a move for the computer
   if(storeBoardContentValue.length > 1){

     //List all the game wining conditions for the computer(remove the conditions that are used by player one)    
     var winingAnswersComputer = winingAnswers.filter(function(current,index,array){
        //Answer string format["1|2|3"];        
        if(playerOneAnswer.indexOf(current[0]) == -1 && playerOneAnswer.indexOf(current[2]) == -1  && playerOneAnswer.indexOf(current[4]) == -1 ){
           return current;  
        }      
    });

     //List all the game wining conditions for the player(remove the conditions that are used by computer)    
     var winingAnswersPlayer = winingAnswers.filter(function(current,index,array){
        //Answer string format["1|2|3"];        
        if(playerTwoAnswer.indexOf(current[0]) == -1 && playerTwoAnswer.indexOf(current[2]) == -1  && playerTwoAnswer.indexOf(current[4]) == -1 ){
           return current;  
        }      
    });    

     var playerOneAnswerString = pickMove(winingAnswersPlayer,storeBoardContentValue,"playerOne");
     var computerOneAnswerString = pickMove(winingAnswersComputer,storeBoardContentValue,"computer");

     //if computer if one move from wining 
     if (typeof ComputerWinAuto !== "undefined" && ComputerWinAuto.length == 1){
       return (ComputerWinAuto+allAnswers[ComputerWinAuto - 1]);   

     //If the player has a meet one of the critera to win the game, select the next square in that wining condition, i.e if the player has a piece in square 1, a piece will be placed in square 2  
     }else if(typeof playerOneAnswerString !== "undefined"){ 

       return (playerOneAnswerString[0]+allAnswers[playerOneAnswerString[0] - 1 ]);

    //If the player has no wining condition, put pieace in the next square from one of the computer wining condition 
    }else if (typeof computerOneAnswerString !== "undefined"){

       return (computerOneAnswerString[0]+allAnswers[computerOneAnswerString[0] - 1]);
    }

  }else{//Stop computer moving when the player moved on the last turn of the game

    return "finalTurn";
  }  

}
  
/////////////////////////////////////////////////////////////////- Game function - used to update the text box which show the user whos turn it is - used inside the resetTurnMessage() function
  
  function showTurnMessage(textValueOne,textValueTwo){//textValueOne is text for player one and textValueTwo is text from playr two / computer - used to switch turns
       
         var div = $("#yourTurnMessage");
   
         if(turn == 0){//First turn is always player one
         
            $("#yourTurnMessage").css("background-color","green");
            $("#currentPlayer").html("<p>Player one - "+pickedUserSign+"</p>");//
            $("#yourTurnMessage").html(textValueOne);
           
          }else if($("#yourTurnMessage").html() == "Go Player 1!" || $("#yourTurnMessage").html() == "Your Turn!"){  
            
           div.css("background-color", "#c47f7f").fadeOut(0).fadeIn(500);
           $("#yourTurnMessage").html(textValueTwo);
                    
         }else if( $("#yourTurnMessage").html() == "Go Player 2!" || $("#yourTurnMessage").html() == "Computers Turn!"){
                   
           div.css("background-color", "green").fadeOut(0).fadeIn(500);
           $("#yourTurnMessage").html(textValueOne);    
        }
       turn++;       
  }
   
 //////////////////////////////////////////////////////////- Game function - show message to tell user whos turn it is - works using the showTurnMessage function

 function resetTurnMessage(){

      //Show differnt message depending on what game type it is
      if(gameType =="twoPlayers"){
      
          showTurnMessage("Go Player 1!", "Go Player 2!");
        
      }else if(gameType =="computer"){
        
          showTurnMessage("Your Turn!", "Computers Turn!");

          //Stop user clicking on board when it is computers turn
          if( $("#yourTurnMessage").html() == "Computers Turn!"){  
            $(".square").css("pointerEvents","none");     
          } 
          if( $("#yourTurnMessage").html() == "Your Turn!"){  
            $(".square").css("pointerEvents","auto"); 
          }               
     }
  } 

//////////////////////////////////////////////////////////////////////////////////////////////// 

  function findWinner(){//Function used to find winner of the game - is used inside the checkAnswer function  
  
   //Value used to check if user got any matches from the winingAnswers array 
   playerOneAnswerMatch = 0;
   playerTwoAnswerMatch = 0;    
   //Loop though array with winning answers
   for(var m = 0; m < winingAnswers.length; m++){
        //Create a regex based on the current answer in the loop i.e 1|2|3 will look for 1, 2 or 3
        var regexstring = winingAnswers[m];
        var regexp = new RegExp(regexstring, "gi");

        //loop to see if their are any matches in the  user answer arrays
        while ((match = regexp.exec(playerOneAnswer.join(","))) != null) {
          playerOneAnswerMatch++;
        }
        while ((match = regexp.exec(playerTwoAnswer.join(","))) != null) {
          playerTwoAnswerMatch++;
       }
     
       //Code is reused in all the the following bits of code 
       if(playerOneAnswerMatch == 3 || playerTwoAnswerMatch  == 3 || drawTest.length == 9){
         
         //Restart game in 5 secounds - show background that the message that will show who won will be placed on
         $("#game,#yourTurnMessage").css("display","none");
         $("#yourTurnMessage").css("background-color","white");
         $("#gameMenus,#currentPlayer").html("");
         $("#gameMenus").css({ "display":"block","background-color":"#1F3C2F","background":"-webkit-gradient(linear,left top,left bottom,from(black),to(#1F3C2F))"}); 
         $("#newGame").prop('disabled', true);//User cannot press reset button when timer is on        
       }       
        //When 3 matches are found that means the user has got one of the games winning combination and has won the game
        if(playerOneAnswerMatch == 3){

         findTime("Player one won!");  
         time = setInterval(function(){ findTime("Player one won!") }, 1000); 
         return "play1"; 
        }

       if(playerTwoAnswerMatch == 3){

          if(gameType == "computer"){//User cannot press reset button when timer is on

             findTime("Computer won!");  
             time = setInterval(function(){ findTime("Computer won!") }, 1000); 
             return "computer";

          }else{

             findTime("Player two won!");  
             time = setInterval(function(){ findTime("Player two won!") }, 1000); 
             return "player2";
          }          
       }
      //Reset values for next next in the answers array
      playerOneAnswerMatch = 0;
      playerTwoAnswerMatch = 0;      
     
   }///End for loop 
    
     //when no player got the winning conditions 
     if(drawTest.length == 9 &&  playerOneAnswerMatch !== 3 &&  playerTwoAnswerMatch !== 3 ){
           
           findTime("Draw");  
           time = setInterval(function(){ findTime("Draw") }, 1000); 
           return "draw";    
     }
 }

////////////////////////////////////////////////////////- Game function - used to asign the  the X and O onto the borad  - uses findWinner function to find game winner
  
  function checkAnswer(id,index){//Pressed square value and square id: i.e 1,squareOne

    //Input the Os and Xs on to the board  - the same square cannot be pressed twice, check if the current user sign is the same as the sign selected at the start of the game 
    if(userSign == pickedUserSign  && $("#"+id).html().length == 0){   

        playerOneAnswer.push(index);//Add answer to answers to answer array 
        //Input X or O into square
        $("#"+id).html(userSign);
        //Switch to sign that the user did not pick at the start of the game
        if(userSign == "O"){
           userSign = "X";     
        }else{
          userSign = "O";     
        }
        if(gameType == "computer"){
            $("#currentPlayer").html("<p>Computer - "+userSign+"</p>");
        }else{
            $("#currentPlayer").html("<p>Player two - "+userSign+"</p>");
        }    
        drawTest.push(id); 
      
    }else if(userSign !== pickedUserSign  &&  $("#"+id).html().length == 0){   

          playerTwoAnswer.push(index);//Add answer to users answers arrays
          $("#"+id).html(userSign);
          userSign = pickedUserSign;
          $("#currentPlayer").html("<p>Player one - "+userSign+"</p>");
          drawTest.push(id);           
    }

   findWinner();    
}

////////////////////////////////////////////////////////////Game function - used to show the timer between games  

 function findTime(message2){

   var message2 = message2;
   seconds = "0" + seconds;   
   seconds --; 
   
  if(seconds == 1){

   $("#gameMenus").html(message2+"<br><br>Game lenth: "+Number(turn-1)+" turns <br><br>New game will start in "+seconds+" secound");   
    
  }else if(seconds > 1){
    
      $("#gameMenus").html(message2+"<br><br>Game lenth: "+Number(turn-1)+" turns <br><br>New game will start in "+seconds+" secounds");      
     
  }else{

       clearInterval(time);
       //update score
       if(message2 == "Player one won!"){
         playerOneScore++;
       }else if (message2 == "Player two won!" || message2 == "Computer won!"){
         playerTwoScore++;     
       }else{
         draws++;
       }
    
       $("#gameMenus").fadeOut(0); 
       $("#game").fadeIn(0);
       //User cannot press button when timer is on
       $("#newGame").prop('disabled', false);
       //$("#yourTurnMessage").css("display","block");
       newGame();
    }
  
 };
  
 //////////////////////////////////////////////////- Board function - change color of bord squares when user hovers over them temporarily  
 
  $(document).on("mouseover", ".square", function() {  
    $(this).css('background', 'gray'); 
  }); 
  $(document).on("mouseleave", ".square", function() {   
    $(this).css({   
      "background-color":"#1F3C2F",
      'background':'-webkit-gradient(linear,left top,left bottom,from(black),to(#1F3C2F))'});             
  });

 //////////////////////////////////////////////////- Board function when user clicks on the borad 

 $(document).on("click", ".square", function() {

   var id = this.id;
   var index = $(this).attr("value"); 
   
   //If square is empty go to next players turn  
   if($("#"+id).html().length == 0){ 
     
     resetTurnMessage();    
   }  
    checkAnswer(id,index);//Test if answer wins game    
   
  if(gameType == "computer" && userSign !== pickedUserSign){

      //Used to pick the computers move
      var answerTwo = aiOne();//Return format - square value and square id: i.e 1squareOne   
      //Stop the computer moving when the player moves on the last turn of the game 
      if(answerTwo == "finalTurn"){

           checkAnswer(id,index); 
           return; 
        
      }else if(answerTwo.length > 1 && answerTwo !== "NaN" && answerTwo !== "finalTurn" ){//Run computers turn
        //The values of the picked game square are stored in index  - every square has a value betweeen 1 and 9        
        var index = answerTwo[0];//For example the 1 from 1squareOne   
        //The ids of the game square is stored in id ,i.e squareOne the from 1squareOne
        var id = answerTwo.slice(1, answerTwo.length);      
        //Show computer turn after one secound  
        setTimeout(function() { resetTurnMessage(), checkAnswer(id,index);}, 1000);   
      }    
  }
   
});   
         
///////////////////////////////////////////////////// - Start menu function - start a new game when the old one ends 
function newGame(){
  
  //Reset score messages  
  $("#playerOneScore").html("Player One: "+playerOneScore);
  $("#draws").html("Draws: "+draws);
  
  if(gameType =="twoPlayers"){

    $("h1").html("Tick Tac Toe - Player One V Player Two");   
    $("#playerTwoScore").html("Player Two: "+playerTwoScore);

  }else if(gameType =="computer"){

    $("h1").html("Tick Tac Toe - Player One V Computer");
    $("#playerTwoScore").html("Computer: "+playerTwoScore);
  }  
  
  seconds = 5;
  playerOneAnswer = [];
  playerTwoAnswer = [];
  drawTest = [];  
  $("#squareOne,#squareTwo,#squareThree,#squareFour,#squareFive,#squareSix,#squareSeven,#squareEight,#squareNine").html("");
  turn = 0;
  userSign = pickedUserSign;
  $("#yourTurnMessage").css("display","block");
  resetTurnMessage();
}    

/////////////////////////////////////////////Game start menu function - load menu and resets all game values back to default, used when user clicks new game button
 
  function gameOptions(){
     playerOneScore = 0; 
     playerTwoScore = 0; 
     draws = 0;
     $("h1").html("Tick Tac Toe - Start Menu");
     $("#yourTurnMessage,#currentPlayer").css("display","none");  
     $("#gameMenus").css({'background':'none',"display":"block"}); 
     $("#bordBorder").css({"background-color":"#1F3C2F",'background':'-webkit-gradient(linear,left top,left bottom,from(black),to(#1F3C2F))'});
     $("#game").fadeOut(0);
     $("#gameMenus").html("<div>How do you want to play?<br><br><span id='computer'>One Player&nbsp;</span><span id='twoPlayers' >Two Player</span></span></div>");
   }
 //Load menu when webpage loads
 gameOptions();
 
///////////////////////////////////// Game start menu functions, user interface

   //Add border when user hover over the O, X and game type options from the start menu
   $(document).on("mouseover","#computer,#twoPlayers,.signPickX,.signPickY",function(){//Change color of square user hovers on temporarily
     $(this).addClass("border");
    }); 
   $(document).on("mouseleave","#computer,#twoPlayers,.signPickX,.signPickY",function(){//Change color of square user hovers on temporarily
     $(this).removeClass("border");
    }); 
  
  //Pick O or X for player one
  $(document).on("click","#computer,#twoPlayers",function(){ 
     gameType = this.id; 
     $("#gameMenus").html("<div>Would you like to be X or O?<br><br><span id='X' class='signPickX'>X</span>&nbsp;&nbsp;&nbsp;<span id='O' class='signPickY'>O</span>");
  });
  
  //Start game
  $(document).on("click",".signPickX,.signPickY",function(){
        pickedUserSign = this.id;//Selected user sign
        newGame();      
        $("#gameMenus").fadeOut(0);
        $("#bordBorder").css({'background':'none', "background-color":"#F0B487"});  
        $("#game,#currentPlayer,#yourTurnMessage").fadeIn(1000);
   });
  
  //Used to Load start menu
  $(document).on("click","#newGame",function(){  
   gameOptions();        
  });
  
});//End document ready///////////////////////////////////////////////////////////////////////////////////////////////////////////////////