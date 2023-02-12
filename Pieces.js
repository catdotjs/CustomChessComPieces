//Consts make it easier to deal with class names :>
const PieceCSSNames = {
    Black:{
        Rook:"br",
        Knight:"bn",
        Bishop:"bb",
        King:"bk",
        Queen:"bq",
        Pawn:"bp",
    },
    White:{
        Rook:"wr",
        Knight:"wn",
        Bishop:"wb",
        King:"wk",
        Queen:"wq",
        Pawn:"wp",
    }
}
const customStyleRules = document.styleSheets;
var Pieces = document.getElementsByClassName("piece");
var ListOfCustomPieces = [];

// Files need to be base64 due to moz-extension:// path won't run in css &| Security Error 
async function CustomPieceLoad(a,b){
    try{
    resp = await fetch(a); //if file doesn't exist
    blob = await resp.blob();

    //Thanks kae - vfl.gg
    reader = new FileReader();
    reader.onloadend = function() {
        customStyleRules[0].insertRule(`.c${b}{ background-image: url('${reader.result}')}`);
        ListOfCustomPieces.push(b)
    }
    reader.readAsDataURL(blob);
    }catch(err){
        return err;
    }
}

//Load each piece
async function LoadPiecesToCSS(){
    for(var Colour in PieceCSSNames){
        for(var Piece in PieceCSSNames[Colour]){
            CSSPiece = PieceCSSNames[Colour][Piece];
            pieceImg = browser.runtime.getURL(`/CustomPieces/${Colour}/${CSSPiece}.png`); //Gets only the position - doesn't care if it exists
            await CustomPieceLoad(pieceImg,CSSPiece);
        }
    }
}

LoadPiecesToCSS().then(()=>{
    //need just a bit of delay for last piece(wp)
    //needs to loop bcs of chess.com -.-
    //editing this could allow me to make this work w lichess.com
    setInterval(()=>{
    for(let element of Pieces){
        classes = element.classList;
        PieceClass = classes[1];
        if(ListOfCustomPieces.includes(PieceClass)){classes.replace(PieceClass,"c"+PieceClass);}
        element.classList = classes;
    }},1000)
});