import SanZhuangBeat from './sanZhangBeat';
import { SanZhangAlgo } from './sanZhangAlgo';
import { PokerAlgo } from '../pokerAlgo';
import { consts } from './consts';
import * as _ from 'lodash'

class SanZhangLz extends SanZhuangBeat {
    lzCards_1: Array<string> = [];
    lzCards_2: Array<string> = [];
    constructor(self) {
        super(self)
    }
    //获取懒子手牌
    LzShowCards(gamePlayer: any) {
        let cards = gamePlayer.cards.slice();
        let arr: Array<string> = []; //懒子牌
        let brandValue: Array<string> = [];
        let _cards: Array<string> = [];
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (card.split(".").length == 3) {
                arr.push(card);
                continue;
            }
            let tmpArr = card.split(".");
            brandValue.push(tmpArr[1]);
            _cards.push(card);
        }
        brandValue.sort(this.compareFunction); //从大到小        
        let LzCards: Array<string> = []; //懒子变后的牌
        if (arr.length > 0) {
            if (arr.length == 1) { //1张懒子
                let obj = this.getLzCard(_cards, gamePlayer, brandValue, arr[0]);
                return obj;
            }
            if (arr.length == 2 || arr.length == 3) { //2/3张懒子
                let obj = this.getLzBaoZi(_cards, brandValue, arr)
                return obj;
            }
        }
        return { cards: gamePlayer.cards }
    }
    getLzCard(cards: Array<string>, gamePlayer: any, brandValue: Array<string>, lzCard: any) {
        let _cards: any = PokerAlgo.createCardsFromIds(cards);
        let cardsInfo: any = this.getCheckCards(_cards, gamePlayer);
        let card: any = "";

        let LzCards: Array<string> = cards.slice();
        let color_1 = cards[0].split('.')[0];
        let color_2 = cards[1].split(".")[0];
        let value_1 = cards[0].split(".")[1];
        let value_2 = cards[1].split(".")[1];
        let obj_1 = {};
        let obj_2 = {};
        let typeObj_1 = {};
        let typeObj_2 = {};
        let isTongHua = false;
        if (cardsInfo.info == consts.tonghua) isTongHua = true;

        if (cardsInfo.info == consts.duizi.info) { //豹子的情况
            let obj = this.changeCards(lzCard, value_1);
            cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
            return { cards: cards, LzCards: LzCards, type: consts.baozi.info }
        }
        if ((value_1 == "3" && value_2 == "2") || (value_1 == "5" && value_2 == "2") || (value_1 == "5" && value_2 == "3")) {
            let tmpCards: any = [];
            let _tmpCards = cards.slice();
            let isTongHuaLt = false; //是否同花小
            if (this.self.roomConfig["sunzi"] != undefined && this.self.roomConfig["sunzi"][0] == 1) isTongHuaLt = true;
            if (this.self.roomConfig["zhahua"] != undefined && this.self.roomConfig["zhahua"][0] == 1) {
                if ((value_1 == "3" && value_2 == "2")) {
                    if (isTongHua == false) {
                        obj_1 = this.changeCards(lzCard, '5')
                        _tmpCards.push(obj_1["card"]);
                        tmpCards.push({ type: consts.ersanwu.info, cards: _tmpCards.slice() });
                    } else {
                        obj_1 = this.changeCards(lzCard, '5', cards, true, 1); //变为扎花235
                        obj_2 = this.changeCards(lzCard, '4', cards, true);
                        _tmpCards.push(obj_1["card"]);
                        tmpCards.push({ type: consts.ersanwu.info, cards: _tmpCards.slice() });
                        if (_tmpCards.length == 3) _tmpCards.pop();
                        _tmpCards.push(obj_2[card]);
                        tmpCards.push({ type: consts.shunjin.info, cards: _tmpCards.slice() });
                        return { cards: tmpCards, lzCards: [], isSelect: true }
                    }
                }
                if ((value_1 == "5" && value_2 == "2") || (value_1 == "5" && value_2 == "3")) {
                    let s = value_2 == "2" ? "3" : "2";
                    let s1 = value_2 == "2" ? isTongHua == false ? "5" : "14" : "4";
                    obj_1 = isTongHua == false ? this.changeCards(lzCard, s) : this.changeCards(lzCard, s, cards, true, 1); //变扎花 235
                    obj_2 = isTongHua == false ? this.changeCards(lzCard, s1) : this.changeCards(lzCard, s1, cards, true); //变金华或者顺子
                    let type: any = "";
                    if (isTongHua == false) type = value_2 == "2" ? consts.duizi.info : consts.shunzi.info;
                    if (isTongHua == true) type = value_2 == "2" ? consts.tonghua.info : consts.shunjin.info
                    _tmpCards.push(obj_1["card"]);
                    tmpCards.push({ type: consts.ersanwu.info, cards: _tmpCards.slice() });
                    if (_tmpCards.length == 3) _tmpCards.pop();
                    _tmpCards.push(obj_2["card"]);
                    tmpCards.push({ type: type, cards: _tmpCards.slice() });
                    return { cards: tmpCards, lzCards: [], isSelect: true }
                }
                if (value_1 == "3" && value_2 == "2") {
                    if (_tmpCards.length == 3) _tmpCards.pop();
                    let type = "";
                    if ((this.self.roomConfig["dilongda"] != undefined && this.self.roomConfig["dilongda"][0] == 1)
                        || (this.self.roomConfig["tianlongda"] != undefined && this.self.roomConfig["tianlongda"][0] == 1)) {
                        obj_1 = isTongHua == true ? this.changeCards(lzCard, "14", cards, true) : this.changeCards(lzCard, '14');
                        type = isTongHua == true ? consts.shunjin.info : consts.dilong.info;
                    } else {
                        obj_1 = isTongHua == true ? this.changeCards(lzCard, '4', cards, true) : this.changeCards(lzCard, "4");
                        type = isTongHua == true ? consts.shunjin.info : consts.shunzi.info; 11
                    }
                    _tmpCards.push(obj_1["card"]);
                    tmpCards.push(_tmpCards);
                    return { cards: tmpCards, lzCards: [], isSelect: true }
                }
            };
        }
        if (cardsInfo.info == consts.shunzi.info || cardsInfo.info == consts.shunjin.info) { //顺子的情况
            // let lzCards: any = [];
            let type = cardsInfo.info == consts.shunzi.info ? consts.shunzi.info : consts.shunjin.info
            if (brandValue[0] == "14" && brandValue[1] == "13") {
                let obj = cardsInfo.info == consts.shunzi.info ? this.changeCards(lzCard, '12') : this.changeCards(lzCard, '12', cards, true);
                cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
                return { cards: cards, LzCards: LzCards, type: type }
            };
            let num: any = parseInt(brandValue[0]) + 1;
            let obj = cardsInfo.info == consts.shunzi.info ? this.changeCards(lzCard, num.toString()) : this.changeCards(lzCard, num.toString(), cards, true);
            cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
            return { cards: cards, LzCards: LzCards, type: type };
        }
        if ((parseInt(brandValue[0]) - parseInt(brandValue[1])) == 1) {
            let num = (parseInt(brandValue[1]) + 1).toString();
            let obj = isTongHua == true ? this.changeCards(lzCard, num, cards, true) : this.changeCards(lzCard, num);
            let type = isTongHua == true ? consts.shunjin.info : consts.shunzi.info;
            cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
            return { cards: cards, LzCards: LzCards, type: type }
        }
        if (cardsInfo.info == consts.tonghua.info) {
            let obj = brandValue[0] == "14" ? this.changeCards(lzCard, "13", cards, true) : this.changeCards(lzCard, "14", cards, true);
            cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
            return { cards: cards, LzCards: LzCards, type: consts.tonghua.info }
        }
        if (cardsInfo.info = consts.dantao) {
            let obj = this.changeCards(lzCard, value_1);
            cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
            return { cards, LzCards: LzCards, type: consts.duizi.info }
        }
    }
    //获取懒子豹子
    getLzBaoZi(cards: Array<string>, brandValue: Array<string>, LzCards: Array<string>) {
        let card = brandValue.length == 0 ? LzCards[0].split(".")[2] : brandValue[0];
        let _cards: Array<string> = cards.slice();
        let _lzCards = cards.slice();
        for (let i = 0; i < LzCards.length; i++) {
            let LzCard = LzCards[i];
            let obj = this.changeCards(LzCard, card);
            _cards.push(obj["card"]);
            _lzCards.push(obj["lzCard"]);
        }
        return { cards: _cards, LzCards: _lzCards, type: consts.baozi.info }
    }
    changeCards(lzCard: any, value_1: string, cards: any = [], isTongHua: boolean = false, isSpecial: number = 0) {
        let tempArrLz = lzCard.split(".");
        tempArrLz[2] = value_1;
        let card = tempArrLz.join(".");
        let str = "";
        if (isTongHua == false) {
            str = tempArrLz[0].toString() + value_1.toString();
        } else {
            let _card = cards[0];
            if (isSpecial == 1) { //将同花235 变为扎花235
                str = _card.split(".")[0].toString() == "3" ? "0" + value_1 : (parseInt(_card.split(".")[0]) + 1).toString() + value_1
            } else {
                str = _card.split(".")[0].toString() + value_1;
            }
        }
        return { card: card, lzCard: str }
    }
    beat(gamePlayer1: any, gamePlayer2: any) {
        console.log("=======beat");
        console.log("=======gamePlayer1.cards", gamePlayer1.cards);
        console.log("=======gamePlayer2.cards", gamePlayer2.cards);
        this._cards_1 = PokerAlgo.createCardsFromIds(gamePlayer1.cards);
        this._cards_2 = PokerAlgo.createCardsFromIds(gamePlayer2.cards);
        this.gamePlayer1 = gamePlayer1;
        this.gamePlayer2 = gamePlayer2;
        if (this.self.roomConfig["lanzi"] != undefined && this.self.roomConfig["lanzi"][0] == 1) { //
            let obj_1: any = this.LzShowCards(gamePlayer1);
            let obj_2: any = this.LzShowCards(gamePlayer2);
            if (obj_1["LzCards"] != undefined || obj_2["LzCards"] != undefined) {
                this._cards_1 = obj_1["LzCards"] == undefined ? obj_1["cards"] : obj_1["LzCards"];
                this._cards_2 = obj_2["LzCards"] == undefined ? obj_2["cards"] : obj_2["LzCards"];
                this.lzPlayer1 = obj_1["LzCards"] == undefined ? false : true;
                this.lzPlayer2 = obj_2["LzCards"] == undefined ? false : true;
                let tmpGamePlayer1 = _.find(this.self.beatPlayers, { uid: this.gamePlayer1.uid });
                let tmpGamePlayer2 = _.find(this.self.beatPlayers, { uid: this.gamePlayer2.uid });
                if (obj_1["LzCards"] != undefined) {
                    tmpGamePlayer1.cards = obj_1["cards"];
                    tmpGamePlayer1.LzCards = obj_1["LzCards"];
                }
                if (obj_2["LzCards"] != undefined) {
                    tmpGamePlayer2.cards = obj_2["cards"];
                    tmpGamePlayer2.LzCards = obj_2["LzCards"];
                }
                return { "victory": this.victory, "failure": this.failure }
            }

        }
        this._beat();
        return { "victory": this.victory, "failure": this.failure }
    }
    qunbiBeat() {
        for (let i = 0; i < this.self.beatPlayers.length; i++) {
            let player = this.self.beatPlayers[i];
            console.log("======player.index====", player.index, "====cards", JSON.stringify(player.cards), "======uid==", player.uid);
            let showCardsObj = this.LzShowCards(player);
            
            let cards = PokerAlgo.createCardsFromIds(player.cards)
            let cardsInfo = this.getCheckCards(cards, player);
            console.log("==qunbiBeat====cardsInfo==", cardsInfo);
            player.cardsType = cardsInfo.info;
            if (cardsInfo.info == consts["baozi"].info) this.leopardPlayers.push(player); //豹子     
            if (cardsInfo.info == consts["shunjin"].info) this.shunKingPlayers.push(player); //顺金            
            if (cardsInfo.info == consts["tonghua"].info) this.flowerPlayers.push(player); //金华
            if (cardsInfo.info == consts["tianlong"].info) this.dracoPlayers.push(player); //天龙   
            if (cardsInfo.info == consts["shunzi"].info) this.shunzaPlayers.push(player);  // 顺子
            if (cardsInfo.info == consts["dilong"].info) this.earthwormPlayers.push(player); //地龙    
            if (cardsInfo.info == consts["duizi"].info) this.pairsPlayers.push(player); //对子            
            if (cardsInfo.info == consts["ersanwu"].info) this.erSanWuPlayers.push(player); //235
            if (cardsInfo.info == consts["dantao"].info) this.otherPlayers.push(player); //单牌
        }
        if (this.leopardPlayers.length > 0) { //群比人中有豹子
            console.log("===this.leopardPlayers.length===", this.leopardPlayers.length);
            if (this.self.roomConfig["zhahua"] != undefined && this.self.roomConfig["zhahua"][0] == 1 && this.erSanWuPlayers.length > 0) {
                // 235组用户胜利
                this.self.isErSanWuEatBaoZi = true;
                return this._qunbiBeat(this.erSanWuPlayers);
            }
            //豹子组内用户胜利
            return this._qunbiBeat(this.leopardPlayers);
        }
        if (this.shunKingPlayers.length > 0) { //群比中有顺金用户 
            console.log("===this.shunKingPlayers.length===", this.shunKingPlayers.length);
            return this._qunbiBeat(this.shunKingPlayers);
        }
        if (this.shunzaPlayers.length > 0 || this.dracoPlayers.length > 0
            || this.flowerPlayers.length > 0 || this.earthwormPlayers.length > 0) {
            console.log("===this.shunzaPlayers.length===", this.shunzaPlayers.length,
                "===this.flowerPlayers.length===", this.flowerPlayers.length,
                "===this.earthwormPlayers.length===", this.earthwormPlayers.length,
                "===this.dracoPlayers.length===", this.dracoPlayers.length
            );
            if (this.self.roomConfig["shunzi"] != undefined && this.self.roomConfig["shunzi"][0] == 1) { //顺子大于金华
                if (this.dracoPlayers.length > 0) { //有天龙  天龙最大
                    if (this.self.roomConfig["tianlong"] != undefined && this.self.roomConfig["tianlong"][0] == 1
                        || (this.self.roomConfig["dilongda"] != undefined && this.self.roomConfig["dilongda"][0] == 1)) {
                        if (this.earthwormPlayers.length > 0) {
                            //地龙大
                            return this._qunbiBeat(this.earthwormPlayers);
                        }
                    }
                    //天龙大
                    return this._qunbiBeat(this.dracoPlayers)
                }
                if (this.earthwormPlayers.length > 0) {
                    if (this.self.roomConfig["dilongda"] != undefined && this.self.roomConfig["dilongda"][0] == 1) { //地龙大
                        //地龙大 
                        return this._qunbiBeat(this.earthwormPlayers);
                    }
                    //顺子大 
                    return this._qunbiBeat(this.shunzaPlayers);
                }
            } else {
                //金华大
                return this._qunbiBeat(this.flowerPlayers);
            }
        }
        if (this.pairsPlayers.length > 0) { //对子大
            console.log("===this.pairsPlayers.length===", this.pairsPlayers.length);
            return this._qunbiBeat(this.pairsPlayers);
        }
        if (this.otherPlayers.length > 0) {
            console.log("===this.otherPlayers.length===", this.otherPlayers.length);
            return this._qunbiBeat(this.otherPlayers);
        }
    }
}