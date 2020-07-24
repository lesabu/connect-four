var column = $(".column");
var player1 = "player1";
var player2 = "player2";
var glow1 = "glow1";
var glow2 = "glow2";
var slot = $(".slot-circle");
var targetColumn = $(".target-slots");
var chooseColumn = $(".target-circle");
var currentPlayer = player1;
var currentBgr = bgrplayer1;
var currentGlow = glow1;
var clickable = true;
var winner = $("#winner");
var bgrplayer1 = "bgrplayer1";
var bgrplayer2 = "bgrplayer2";
// var random = false;
var startCountdown = 9;

// $(".random-no").on("click", function(e) {
//     $(e.currentTarget)
//         .removeClass("random-no")
//         .addClass("random-yes");
//     random = true;
// });
//
// $(".random-yes").on("click", function(e) {
//     $(e.currentTarget)
//         .removeClass("random-yes")
//         .addClass("random-no");
//     random = false;
// });

$("#new-game").on("click", function() {
    $("#refresh-game").css({ left: "0" });
});

$(".no").on("click", function() {
    $("#refresh-game").css({ left: "200%" });
});

$(".yes").on("click", function() {
    slot.removeClass(player1);
    slot.removeClass(player2);
    $("#refresh-game").css({ left: "200%" });
    winner.css({ left: "200%" });
    winner.removeClass(bgrplayer1);
    winner.removeClass(bgrplayer2);
    $("h2").remove(".win");
    removeTarget();
    switchPlayers();
    clickable = true;
    startPlay();
    countdown(10);
});

chooseColumn.on("mouseover", function(e) {
    if (!clickable) {
        return;
    }
    var currentSlot = $(e.currentTarget);
    if (chooseColumn.hasClass(currentPlayer)) {
        chooseColumn.removeClass(currentPlayer);
        chooseColumn.removeClass(currentGlow);
    }
    currentSlot.addClass(currentPlayer);
    currentSlot.addClass(currentGlow);
});

targetColumn.on("click", function(e) {
    if (!slot.hasClass(player1)) {
        if (!slot.hasClass(player2)) {
            countdown(startCountdown);
        }
    }

    if (!clickable) {
        return;
    }
    var currentColumnIndex = $(e.currentTarget).index();
    var slotsInColumn = column.eq(currentColumnIndex).find(slot);

    for (var i = 5; i >= -1; i--) {
        // console.log(slotsInColumn.eq(i));
        if (!slotsInColumn.eq(i).hasClass("player1")) {
            if (!slotsInColumn.eq(i).hasClass("player2")) {
                break;
            }
        }
    }
    removeTarget();
    makeTargetColUnclickable();
    tokenSlide(0, i, slotsInColumn, currentColumnIndex);
});

function startPlay() {
    chooseColumn.eq(0).addClass(currentPlayer);
    chooseColumn.eq(0).addClass(currentGlow);
}

function removeTarget() {
    if (chooseColumn.hasClass(currentPlayer)) {
        chooseColumn.removeClass(currentPlayer);
        chooseColumn.removeClass(currentGlow);
    } else {
        return;
    }
}

function getRow(slot) {
    var slotsInRow = $("");
    for (var i = 0; i < column.length; i++) {
        slotsInRow = slotsInRow.add(
            column
                .eq(i)
                .children()
                .children()
                .eq(slot)
        );
    }
    return slotsInRow;
}

function tokenSlide(slotToBlink, i, slotsInCol, currentColumnIndex) {
    if (slotToBlink < i) {
        slotsInCol.eq(slotToBlink).addClass(currentPlayer);
        setTimeout(function() {
            slotsInCol.eq(slotToBlink).removeClass(currentPlayer);
            tokenSlide(slotToBlink + 1, i, slotsInCol, currentColumnIndex);
        }, 35);
    } else {
        slotsInCol.eq(i).addClass(currentPlayer);
        setTimeout(function() {
            detectVictory(slotsInCol);
            var slotsInRow = getRow(i);
            detectVictory(slotsInRow);
            var slotsDiagOne = loopDiagOne(i, currentColumnIndex);
            detectVictory(slotsDiagOne);
            var slotsDiagTwo = loopDiagTwo(i, currentColumnIndex);

            detectVictory(slotsDiagTwo);

            switchPlayers();
            makeTargetColUnclickable();
            startPlay();
        }, 200);
    }
}

function detectVictory(check) {
    var count = "";
    for (var i = 0; i < check.length; i++) {
        if (check.eq(i).hasClass(currentPlayer)) {
            count += "0";
        } else {
            count += "/";
        }
    }
    if (count.includes("0000")) {
        winnerAlert();
    }
}

function winnerAlert() {
    winner.css({ left: "0" });
    winner.addClass(currentBgr);
    if (currentPlayer == player1) {
        $("#winner-token").removeClass(player2);
        $("#winner-inner").prepend("<h2 class='win'>Blue wins!</h2>");
    } else {
        $("#winner-token").removeClass(player1);
        $("#winner-inner").prepend("<h2 class='win'>Red wins!</h2>");
    }
    $("#winner-token").addClass(currentPlayer);
}

function loopDiagOne(slot, col) {
    var slotsInDiag = $("");
    var indexRow = slot;
    var indexColumn = col;
    for (var i = 6; i >= -1; i--) {
        if (indexRow == 0 || indexColumn == 0) {
            break;
        } else {
            indexRow -= 1;
            indexColumn -= 1;
        }
    }
    for (var j = 0; j < 6; j++) {
        var diag1 = column
            .eq(indexColumn)
            .children()
            .children()
            .eq(indexRow);
        slotsInDiag = slotsInDiag.add(diag1);
        indexColumn += 1;
        indexRow += 1;
    }
    return slotsInDiag;
}

function loopDiagTwo(slot, col) {
    var slotsInDiag = $("");
    var indexRow = slot; // 3 > 2
    var indexColumn = col; // 1 > 0

    for (var i = 6; i >= -1; i--) {
        if (indexRow == 5 || indexColumn == 0) {
            break;
        } else {
            indexRow += 1;
            indexColumn -= 1;
        }
    }

    for (var j = 0; j < 6; j++) {
        var diag2 = column
            .eq(indexColumn)
            .children()
            .children()
            .eq(indexRow);
        slotsInDiag = slotsInDiag.add(diag2);
        indexColumn += 1;
        indexRow -= 1;
    }
    return slotsInDiag;
}

function switchPlayers() {
    if (currentPlayer == player1) {
        currentPlayer = player2;
        currentGlow = glow2;
        currentBgr = bgrplayer2;
    } else if (currentPlayer == player2) {
        currentPlayer = player1;
        currentGlow = glow1;
        currentBgr = bgrplayer1;
    }
}

function makeTargetColUnclickable() {
    if (clickable) {
        clickable = false;
    } else {
        clickable = true;
    }
}

function stored() {
    var storedMoves = $("");
    for (var i = 0; i < slot.length; i++) {
        storedMoves = storedMoves.add(slot.eq(i));
    }
    return storedMoves;
}

function checkRatio(oneOrTwo) {
    var hasClassOfPlayerBeforeRandom = 0;
    for (var i = 0; i < slot.length; i++) {
        if (slot.eq(i).hasClass("player" + oneOrTwo)) {
            hasClassOfPlayerBeforeRandom += 1;
        }
    }
    return hasClassOfPlayerBeforeRandom;
}

// function switchClass(oneOrTwo) {
//     var amoutOfTokenWithTheClass = 0;
//     for (var i = 0; i < slot.length; i++) {
//         var random = Math.floor(Math.random() * Math.floor(2) + 1);
//         var newClass = "player" + random;
//         if (slot.eq(i).hasClass("player" + oneOrTwo)) {
//             amoutOfTokenWithTheClass += 1;
//             slot.eq(i).removeClass("player" + oneOrTwo);
//             slot.eq(i).addClass(newClass);
//         }
//     }
//     return amoutOfTokenWithTheClass;
// }

function switchClass() {
    var newClasses = $("");
    for (var i = 0; i < slot.length; i++) {
        var random = Math.floor(Math.random() * Math.floor(2) + 1);
        var newClass = "player" + random;
        if (slot.eq(i).hasClass(player1)) {
            slot.eq(i).removeClass(player1);
            newClasses = newClasses.add(slot.eq(i).addClass(newClass));
        } else if (slot.eq(i).hasClass(player2)) {
            slot.eq(i).removeClass(player2);
            newClasses = newClasses.add(slot.eq(i).addClass(newClass));
        } else {
            newClasses = newClasses.add(slot.eq(i));
        }
    }
    return newClasses;
}
var originalPlay = $("");
function randomizeToken() {
    var ply1 = checkRatio(1);
    var ply2 = checkRatio(2);
    if (originalPlay.length === 0) {
        originalPlay = stored();

        var plyWithNewClasses = switchClass();
        console.log(plyWithNewClasses);

        var ply1New = checkRatio(1);
        var ply2New = checkRatio(2);

        if (ply1 === ply1New && ply2 === ply2New) {
            originalPlay = $("");
            console.log(ply1, ply2, ply1New, ply2New);

            return;
        } else {
            randomizeToken();
        }
    } else {
        plyWithNewClasses = originalPlay;
        console.log(plyWithNewClasses);
        plyWithNewClasses = switchClass();
        console.log(plyWithNewClasses);
        ply1New = checkRatio(1);
        ply2New = checkRatio(2);
        if (ply1 === ply1New && ply2 === ply2New) {
            originalPlay = $("");
            console.log(ply1, ply2, ply1New, ply2New);

            return;
        } else {
            randomizeToken();
        }
    }
}

// function assemble() {}

function countdown(num) {
    if (winner.hasClass(bgrplayer1) || winner.hasClass(bgrplayer2)) {
        return;
    }
    if (num === -1) {
        // return;
        randomizeToken();
        for (var i = 0; i < slot.length; i++) {
            if (slot.eq(i).hasClass(player1) || slot.eq(i).hasClass(player2)) {
                slot.eq(i).addClass("crazy-blink");
            }
        }
        setTimeout(function() {
            for (var i = 0; i < slot.length; i++) {
                if (slot.eq(i).hasClass("crazy-blink")) {
                    slot.eq(i).removeClass("crazy-blink");
                }
            }
            num = 10;
            countdown(num);
        }, 2000);
    } else {
        setTimeout(function() {
            $(".number").remove("h3");
            $("#countdown").append("<h3 class='number'>" + num + " sec</h3>");
            // slotsInCol.eq(slotToBlink).removeClass(currentPlayer);
            countdown(num - 1);
        }, 1000);
    }
}
