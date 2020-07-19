(function() {
    var player1 = $("#sidebarPlayer1").find(".playerImage");
    var player2 = $("#sidebarPlayer2").find(".playerImage");
    var currentPlayer = "player1";
    var column = $(".column");
    var slotArr = $("#gamearea").find(".slot");
    var actualSlot;
    var actualSlotPosition;
    var returnedActualSlotPosition = false;
    var playAgainButton = $("#playAgainButton");
    var winnerArr = [];

    //********
    // set default player
    //********

    $(window).on("load", function() {
        currentPlayer = "player1";
        player1.addClass("active");
        player2.removeClass("active");
    });

    //********
    // switch Players
    //********

    function switchPlayers() {
        if (currentPlayer == "player1") {
            currentPlayer = "player2";
            player1.removeClass("active");
            player2.addClass("active");
        } else {
            currentPlayer = "player1";
            player1.addClass("active");
            player2.removeClass("active");
        }
    }

    //********
    // winning animation
    //********

    function winningAnimation() {
        $("#gamearea")
            .find(".slot")
            .addClass("locked");
        for (var i = 0; i <= winnerArr.length; i++) {
            $("#" + winnerArr[i]).addClass("winnerSlot");
        }
        var winnerText = $("#winnerText");
        if (currentPlayer == "player1") {
            winnerText.html("<h1 class='red' >RED</h1><h4> wins </h4>");
        } else {
            winnerText.html("<h1 class='blue'>BLUE</h1><h4> wins </h4>");
        }
        $("#winnerBack")
            .delay(500)
            .fadeIn("4000");

        //********
        // restart game
        //********

        playAgainButton.on("click", function() {
            $(document)
                .find(".player1")
                .removeClass("player1");
            $(document)
                .find(".player2")
                .removeClass("player2");
            $(document)
                .find(".slot")
                .removeClass("winnerSlot");
            $("#gamearea")
                .find(".slot")
                .removeClass("locked");
            $("#winnerBack").fadeOut("4000");
        });
    }

    //********
    // check the victory for rows an columns
    //********

    function checkForVictory(slots) {
        var counter = 0;
        for (var i = 0; i < slots.length; i++) {
            if (slots.eq(i).hasClass(currentPlayer)) {
                counter++;
                winnerArr.push(slots.eq(i).attr("id"));
                if (counter == 4) {
                    return true;
                }
            } else {
                winnerArr = [];
                counter = 0;
            }
        }
    }

    //********
    // check diagonal
    //********

    function checkForVictoryDiagonal(slots, direction, actualSlotPosition) {
        returnedActualSlotPosition = false;
        var count = 0;
        for (var j = 0; j < 4; j++) {
            if (
                slots
                    .eq(actualSlotPosition)
                    .parent()
                    .attr("id") !=
                slots
                    .eq(actualSlotPosition + direction)
                    .parent()
                    .attr("id")
            ) {
                var oldSlot = slots.eq(actualSlotPosition);
                var newSlot = slots.eq(actualSlotPosition + direction);
                if (count == 0) {
                    count++;
                    winnerArr.push(slots.eq(actualSlotPosition).attr("id"));
                }
                if (
                    oldSlot.hasClass(currentPlayer) ==
                    newSlot.hasClass(currentPlayer)
                ) {
                    winnerArr.push(newSlot.attr("id"));
                    count++;
                    if (count == 4) {
                        return true;
                    } else {
                        actualSlotPosition = actualSlotPosition + direction;
                    }
                } else {
                    count = 0;
                    winnerArr = [];
                    returnedActualSlotPosition = actualSlotPosition;
                    break;
                }
            } else {
                returnedActualSlotPosition = actualSlotPosition;
                break;
            }
        }
        return;
    }

    column.on("click", function(e) {
        //********
        // add the stones
        //********

        if (
            $("#gamearea")
                .find(".slot")
                .hasClass("locked")
        ) {
            return;
        }

        var slotsInColumn = $(e.currentTarget).find(".slot");
        for (var i = 5; i >= 0; i--) {
            if (
                !slotsInColumn.eq(i).hasClass("player1") &&
                !slotsInColumn.eq(i).hasClass("player2")
            ) {
                slotsInColumn.eq(i).addClass(currentPlayer);
                actualSlot = slotsInColumn.eq(i).addClass(currentPlayer);
                break;
            }
        }
        for (var k = 0; k < slotArr.length; k++) {
            if (slotArr[k] == actualSlot[0]) {
                actualSlotPosition = k;
                break;
            }
        }

        if (i == -1) {
            return;
        }

        //********
        // call the checks and look who won
        //********

        if (checkForVictory(slotsInColumn)) {
            winningAnimation();
        } else if (checkForVictory($("." + (i + 1)))) {
            winningAnimation();

            //********
            // check diagonalfrom left to right
            //********
        } else if (checkForVictoryDiagonal(slotArr, -5, actualSlotPosition)) {
            winningAnimation();
        } else if (
            returnedActualSlotPosition !== false &&
            checkForVictoryDiagonal(slotArr, 5, returnedActualSlotPosition)
        ) {
            winningAnimation();

            //********
            // check diagonalfrom right to left
            //********
        } else if (checkForVictoryDiagonal(slotArr, 7, actualSlotPosition)) {
            winningAnimation();
        } else if (
            returnedActualSlotPosition !== false &&
            checkForVictoryDiagonal(slotArr, -7, returnedActualSlotPosition)
        ) {
            winningAnimation();
        }
        switchPlayers();
    });
})();
