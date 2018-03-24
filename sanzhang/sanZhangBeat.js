"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sanzhangAlgo_1 = require("./sanzhangAlgo");
const pokerAlgo_1 = require("../pokerAlgo");
const _ = require("lodash");
class SanZhuangBeat {
    constructor(self) {
        this.consts = {
            "tonghua": { main: 17, info: "tonghua" },
            "shunzi": { main: 15, info: "shunzi" },
            "shunjin": { main: 18, info: "shunjin" },
            "baozi": { main: 20, info: "baozi" },
            "duizi": { main: 10, info: "duizi" },
            "dantao": { main: 4, info: "dantao" },
            "tianlong": { main: 16, info: "tianlong" },
            "dilong": { main: 14, info: "dilong" },
            "ersanwu": { main: 3, info: "ersanwu" }
        };
        this.lzPlayer1 = false;
        this.lzPlayer2 = false;
        this.self = self;
        this.victory = {}; //胜利对象
        this.failure = {}; //失败对象
        this.leopardPlayers = []; //豹子
        this.flowerPlayers = []; //同花
        this.shunzaPlayers = []; //顺子
        this.shunKingPlayers = []; // 顺金
        this.earthwormPlayers = []; //地龙
        this.dracoPlayers = []; //天龙
        this.erSanWuPlayers = []; //235
        this.otherPlayers = []; //单牌
        this.pairsPlayers = []; //对子
    }
    beat(gamePlayer1, gamePlayer2) {
        console.log("=======beat");
        console.log("=======gamePlayer1.cards", gamePlayer1.cards);
        console.log("=======gamePlayer2.cards", gamePlayer2.cards);
        this.gamePlayer1 = gamePlayer1;
        this.gamePlayer2 = gamePlayer2;
        if (this.self.roomConfig["lanzi"] != undefined && this.self.roomConfig["lanzi"][0] == 1) {
            let obj_1 = {};
            let obj_2 = {};
            if (gamePlayer1.showCards == true) {
                if (gamePlayer1["LzCards"].length > 0)
                    obj_1["LzCards"] = gamePlayer1["LzCards"];
            }
            else {
                obj_1 = this.LzShowCards(gamePlayer1, true);
            }
            if (gamePlayer2.showCards == true) {
                if (gamePlayer2["LzCards"].length > 0)
                    obj_2["LzCards"] = gamePlayer2["LzCards"];
            }
            else {
                obj_2 = this.LzShowCards(gamePlayer2, true);
            }
            console.log("==33333=beat==obj_1===", obj_1, "==eeeeee=beat==obj_2===", obj_2);
            this._cards_1 = obj_1 == undefined || obj_1["LzCards"] == undefined ? pokerAlgo_1.PokerAlgo.createCardsFromIds(gamePlayer1.cards) : pokerAlgo_1.PokerAlgo.createCardsFromIds(obj_1["LzCards"]);
            this._cards_2 = obj_2 == undefined || obj_2["LzCards"] == undefined ? pokerAlgo_1.PokerAlgo.createCardsFromIds(gamePlayer2.cards) : pokerAlgo_1.PokerAlgo.createCardsFromIds(obj_2["LzCards"]);
            this.lzPlayer1 = obj_1 == undefined || obj_1["LzCards"] == undefined ? false : true;
            this.lzPlayer2 = obj_2 == undefined || obj_2["LzCards"] == undefined ? false : true;
            let tmpGamePlayer1 = _.find(this.self.beatPlayers, { uid: this.gamePlayer1.uid });
            let tmpGamePlayer2 = _.find(this.self.beatPlayers, { uid: this.gamePlayer2.uid });
            if (obj_1 != undefined && obj_1["LzCards"] != undefined)
                tmpGamePlayer1.LzCards = obj_1["LzCards"];
            if (obj_2 != undefined && obj_2["LzCards"] != undefined)
                tmpGamePlayer2.LzCards = obj_2["LzCards"];
            this.gamePlayer1 = tmpGamePlayer1;
            this.gamePlayer2 = tmpGamePlayer2;
            console.log("==========this._cards_1", this._cards_1);
            console.log("this._cards_2", this._cards_2);
        }
        else {
            this._cards_1 = pokerAlgo_1.PokerAlgo.createCardsFromIds(gamePlayer1.cards);
            this._cards_2 = pokerAlgo_1.PokerAlgo.createCardsFromIds(gamePlayer2.cards);
        }
        let flag = this._beat();
        if (flag === 1)
            return flag;
        return { "victory": this.victory, "failure": this.failure };
    }
    qunbiBeat() {
        for (let i = 0; i < this.self.beatPlayers.length; i++) {
            let player = this.self.beatPlayers[i];
            let cards = "";
            if (this.self.roomConfig["lanzi"] != undefined && this.self.roomConfig["lanzi"][0] == 1) {
                let showCardsObj = {};
                if (player.showCards == true) {
                    if (player.LzCards.length > 0)
                        showCardsObj["LzCards"] = player.LzCards;
                }
                else {
                    showCardsObj = this.LzShowCards(player);
                }
                if (showCardsObj["LzCards"] != undefined) {
                    //player.cards = showCardsObj["cards"];
                    player.LzCards = showCardsObj["LzCards"];
                    cards = pokerAlgo_1.PokerAlgo.createCardsFromIds(player.LzCards);
                }
                else {
                    cards = pokerAlgo_1.PokerAlgo.createCardsFromIds(player.cards);
                }
            }
            else {
                cards = pokerAlgo_1.PokerAlgo.createCardsFromIds(player.cards);
            }
            let cardsInfo = this.getCheckCards(cards, player);
            player.cardsType = cardsInfo.info;
            if (cardsInfo.info == this.consts["baozi"].info)
                this.leopardPlayers.push(player); //豹子     
            if (cardsInfo.info == this.consts["shunjin"].info)
                this.shunKingPlayers.push(player); //顺金            
            if (cardsInfo.info == this.consts["tonghua"].info)
                this.flowerPlayers.push(player); //金华
            if (cardsInfo.info == this.consts["tianlong"].info)
                this.dracoPlayers.push(player); //天龙   
            if (cardsInfo.info == this.consts["shunzi"].info)
                this.shunzaPlayers.push(player); // 顺子
            if (cardsInfo.info == this.consts["dilong"].info)
                this.earthwormPlayers.push(player); //地龙    
            if (cardsInfo.info == this.consts["duizi"].info)
                this.pairsPlayers.push(player); //对子            
            if (cardsInfo.info == this.consts["ersanwu"].info)
                this.erSanWuPlayers.push(player); //235
            if (cardsInfo.info == this.consts["dantao"].info)
                this.otherPlayers.push(player); //单牌
        }
        if (this.leopardPlayers.length > 0) {
            console.log("===this.leopardPlayers.length===", this.leopardPlayers.length);
            if (this.self.roomConfig["zhahua"] != undefined && this.self.roomConfig["zhahua"][0] == 1 && this.erSanWuPlayers.length > 0) {
                // 235组用户胜利
                this.self.isErSanWuEatBaoZi = true;
                return this._qunbiBeat(this.erSanWuPlayers);
            }
            //豹子组内用户胜利
            return this._qunbiBeat(this.leopardPlayers);
        }
        if (this.shunKingPlayers.length > 0) {
            console.log("===this.shunKingPlayers.length===", this.shunKingPlayers.length);
            return this._qunbiBeat(this.shunKingPlayers);
        }
        if (this.shunzaPlayers.length > 0 || this.dracoPlayers.length > 0
            || this.flowerPlayers.length > 0 || this.earthwormPlayers.length > 0) {
            console.log("===this.shunzaPlayers.length===", this.shunzaPlayers.length, "===this.flowerPlayers.length===", this.flowerPlayers.length, "===this.earthwormPlayers.length===", this.earthwormPlayers.length, "===this.dracoPlayers.length===", this.dracoPlayers.length);
            console.log((this.self.roomConfig["shunzi"] != undefined && this.self.roomConfig["shunzi"][0] == 1) || this.flowerPlayers.length == 0);
            if ((this.self.roomConfig["shunzi"] != undefined && this.self.roomConfig["shunzi"][0] == 1) || this.flowerPlayers.length == 0) {
                if (this.dracoPlayers.length > 0) {
                    if (this.self.roomConfig["tianlong"] != undefined && this.self.roomConfig["tianlong"][0] == 1
                        || (this.self.roomConfig["dilongda"] != undefined && this.self.roomConfig["dilongda"][0] == 1)) {
                        if (this.earthwormPlayers.length > 0) {
                            //地龙大
                            return this._qunbiBeat(this.earthwormPlayers);
                        }
                    }
                    //天龙大
                    return this._qunbiBeat(this.dracoPlayers);
                }
                if (this.earthwormPlayers.length > 0) {
                    if (this.self.roomConfig["dilongda"] != undefined && this.self.roomConfig["dilongda"][0] == 1) {
                        //地龙大 
                        return this._qunbiBeat(this.earthwormPlayers);
                    }
                    //顺子大 
                    return this._qunbiBeat(this.shunzaPlayers);
                }
            }
            else {
                //金华大
                return this._qunbiBeat(this.flowerPlayers);
            }
        }
        if (this.pairsPlayers.length > 0) {
            console.log("===this.pairsPlayers.length===", this.pairsPlayers.length);
            return this._qunbiBeat(this.pairsPlayers);
        }
        if (this.otherPlayers.length > 0) {
            console.log("===this.otherPlayers.length===", this.otherPlayers.length);
            return this._qunbiBeat(this.otherPlayers);
        }
        if (this.erSanWuPlayers.length > 0) {
            console.log("===this.erSanWuPlayers.length===", this.otherPlayers.length);
            return this._qunbiBeat(this.erSanWuPlayers);
        }
    }
    _qunbiBeat(players) {
        console.log("_qunbiBeat ====players.length==", players.length);
        let _player1 = "";
        let _player2 = "";
        let victoryPlayers = "";
        let cards_1 = "";
        let cards_2 = "";
        if (players.length == 1) {
            return this._getQunBiBeatResult(players[0]);
        }
        for (let i = 0; i < players.length; i++) {
            _player1 = players[i];
            if (victoryPlayers == "") {
                victoryPlayers = _player1;
                continue;
            }
            if (victoryPlayers.uid == _player1.uid)
                continue;
            cards_1 = victoryPlayers.LzCards == undefined || victoryPlayers.LzCards.length == 0 ? victoryPlayers.cards : victoryPlayers.LzCards;
            cards_2 = _player1.LzCards == undefined || _player1.LzCards.length == 0 ? _player1.cards : _player1.LzCards;
            this._cards_1 = pokerAlgo_1.PokerAlgo.createCardsFromIds(cards_1);
            this._cards_2 = pokerAlgo_1.PokerAlgo.createCardsFromIds(cards_2);
            this.gamePlayer1 = victoryPlayers;
            this.gamePlayer2 = _player1;
            this._beat();
            if (this.victory.uid == _player1.uid)
                victoryPlayers = _player1;
        }
        this.self.victoryPlayer = victoryPlayers;
        return this._getQunBiBeatResult(victoryPlayers);
    }
    _getQunBiBeatResult(player) {
        console.log("===============_getQunBiBeatResult=====", player.cards, "======index===", player.index, "======uid====", player.uid);
        let results = [];
        for (let i = 0; i < this.self.beatPlayers.length; i++) {
            let _player = this.self.beatPlayers[i];
            let _cards = ["-1", "-1", "-1"];
            let _obj = { sid: _player.index, uid: _player.uid, cards: _cards };
            if (player.uid == _player.uid) {
                if (player.showCards == true)
                    _obj["cards"] = player.cards;
                results.push(_obj);
                continue;
            }
            // _player.giveup = true;
            _player.thanCards = true;
            results.push(_obj);
        }
        return { "results": results, };
    }
    getCheckCards(cards, gamePlayer) {
        //获取是否是豹子
        let tmpCards = gamePlayer.cards;
        let obj = this.getCardsSize(tmpCards);
        let arr = obj.arr;
        if (sanzhangAlgo_1.SanZhangAlgo.isSanTiao(cards))
            return this.consts.baozi;
        //获取是否是顺金
        if (sanzhangAlgo_1.SanZhangAlgo.isTongHuaShun(cards))
            return this.consts.shunjin;
        //获取是否是同花
        arr.sort(this.compareFunction);
        if (sanzhangAlgo_1.SanZhangAlgo.isTongHua(cards)) {
            if (arr[0] == "14" && arr[1] == "3" && arr[2] == "2")
                return this.consts.shunjin;
            return this.consts.tonghua;
        }
        ;
        //获取是否是顺子
        if (arr[0] == "14" && arr[1] == "3" && arr[2] == "2")
            return this.consts.dilong;
        if (arr[0] == "5" && arr[1] == "3" && arr[2] == "2")
            return this.consts.ersanwu;
        if (sanzhangAlgo_1.SanZhangAlgo.isDanShunZi(cards)) {
            if (arr[0] == "14" && arr[1] == "13" && arr[2] == "12")
                return this.consts.tianlong;
            return this.consts.shunzi;
        }
        //获取是否是对子
        if (sanzhangAlgo_1.SanZhangAlgo.isDuiZi(cards))
            return this.consts.duizi;
        //单挑
        return this.consts.dantao;
    }
    _beat() {
        console.log("========_beat===");
        let cardsInfo = this.getCheckCards(this._cards_1, this.gamePlayer1);
        let competeInfo = this.getCheckCards(this._cards_2, this.gamePlayer2);
        this.gamePlayer1.cardsType = cardsInfo.info;
        this.gamePlayer2.cardsType = competeInfo.info;
        console.log("===============cardsInfo====", cardsInfo);
        console.log("===============competeInfo====", competeInfo);
        this.self.isErSanWuEatBaoZi = false;
        if (cardsInfo.info == competeInfo.info) {
            if (cardsInfo.info == this.consts.baozi.info && this.lzPlayer2 == true && this.lzPlayer1 == false) {
                let obj = this.getPlayer1Victory(cardsInfo, competeInfo);
                this.victory = obj.victory, this.failure = obj.failure;
                return true;
            }
            if (competeInfo.info == this.consts.baozi.info && this.lzPlayer1 == true && this.lzPlayer2 == false) {
                let obj = this.getPlayer2Victory(cardsInfo, competeInfo);
                this.victory = obj.victory, this.failure = obj.failure;
                return true;
            }
            console.log("cardsInfo type eq competeInfo type");
            let _tmpCards1_ = this.gamePlayer1.LzCards.length > 0 ? this.gamePlayer1.LzCards : this.gamePlayer1.cards;
            let _tmpCards2_ = this.gamePlayer2.LzCards.length > 0 ? this.gamePlayer2.LzCards : this.gamePlayer2.cards;
            let objCards_1 = this.getCardsSize(_tmpCards1_);
            let objCards_2 = this.getCardsSize(_tmpCards2_);
            let tmpCards_1 = objCards_1.arr;
            let tmpCards_2 = objCards_2.arr;
            tmpCards_1.sort(this.compareFunction);
            tmpCards_2.sort(this.compareFunction);
            let group_1 = _.groupBy(tmpCards_1);
            let group_2 = _.groupBy(tmpCards_2);
            console.log("=============tmpCards_2==", tmpCards_2);
            console.log("==============tmpCards_1====", tmpCards_1);
            console.log("=============group_1==", tmpCards_2);
            console.log("==============group_2====", tmpCards_1);
            let shuang1 = undefined, shuang2 = undefined, dan1 = undefined, dan2 = undefined;
            for (let k in group_1) {
                if (group_1[k].length == 1)
                    dan1 = group_1[k][0];
                if (group_1[k].length == 2)
                    shuang1 = group_1[k][0];
            }
            for (let k in group_2) {
                if (group_2[k].length == 1)
                    dan2 = group_2[k][0];
                if (group_2[k].length == 2)
                    shuang2 = group_2[k][0];
            }
            console.log("=============group_1==", dan1);
            console.log("=============group_2==dan2", dan2);
            if (cardsInfo.info == this.consts.shunjin.info && competeInfo.info == this.consts.shunjin.info) {
                // if(tmpCards_1[0] == "14" && ){}
                let tianlong_1 = tmpCards_1[0] == "14" && tmpCards_1[1] == "13" && tmpCards_1[2] == "12" ? true : false;
                let tianlong_2 = tmpCards_2[0] == "14" && tmpCards_2[1] == "13" && tmpCards_2[2] == "12" ? true : false;
                let dilong_1 = tmpCards_1[0] == "14" && tmpCards_1[1] == "2" && tmpCards_1[2] == "3" ? true : false;
                let dilong_2 = tmpCards_2[0] == "14" && tmpCards_2[1] == "2" && tmpCards_2[2] == "3" ? true : false;
                if ((tianlong_1 == true && dilong_2 == true) || (dilong_1 == true && tianlong_2 == true)) {
                    this.getTianLong(cardsInfo, competeInfo, tianlong_1);
                    return true;
                }
                // if ((cardsInfo.info == this.consts["dilong"].info && competeInfo.info == this.consts["shunzi"].info)
                // || (cardsInfo.info == this.consts["dilong"].info && competeInfo.info == this.consts["shunzi"].info)) 
                if ((dilong_1 == true && tianlong_2 == false && dilong_2 == false) || (dilong_2 == true && tianlong_1 == false && dilong_1 == false)) {
                    this.getDilong(cardsInfo, competeInfo);
                    return true;
                }
            }
            if (tmpCards_1.toString() == tmpCards_2.toString()) {
                if (this.lzPlayer1 == true && this.lzPlayer2 == false) {
                    let obj = this.getPlayer2Victory(cardsInfo, competeInfo);
                    this.victory = obj.victory, this.failure = obj.failure;
                    return true;
                }
                if (this.lzPlayer2 == true && this.lzPlayer1 == false) {
                    let obj = this.getPlayer1Victory(cardsInfo, competeInfo);
                    this.victory = obj.victory, this.failure = obj.failure;
                    return true;
                }
                console.log("=====this.self.roomConfig.bipai2", this.self.roomConfig["bipai2"], "this.self.qiongbi", this.self.qiongbi);
                if (this.self.roomConfig["bipai2"] != undefined && this.self.roomConfig["bipai2"][0] == 1 && this.self.qiongbi == false) {
                    console.log("==================tongdakaipaizheshu======");
                    let obj = this.getPlayer2Victory(cardsInfo, competeInfo);
                    this.victory = obj.victory, this.failure = obj.failure;
                    return true;
                }
                if ((this.self.roomConfig["bipai2"] != undefined && this.self.roomConfig["bipai2"][0] == 2) || this.self.qiongbi == true) {
                    if (this.lzPlayer1 == true && this.lzPlayer2 == true) {
                        this.checkHuaSe(tmpCards_1[2], tmpCards_2[2], cardsInfo, competeInfo); //比单
                        return 0;
                    }
                    if (shuang1 != undefined) {
                        this.checkHuaSe(tmpCards_1[2], tmpCards_2[2], cardsInfo, competeInfo); //比单
                        return true;
                    }
                    this.checkHuaSe(tmpCards_1[0], tmpCards_2[0], cardsInfo, competeInfo); //比单
                    return true;
                }
            }
            if (cardsInfo.info == this.consts.duizi.info) {
                console.log("====shuang1===shuang2=", shuang1, shuang2);
                if (shuang1 > shuang2 || shuang2 > shuang1) {
                    let obj = shuang1 > shuang2 ? this.getPlayer1Victory(cardsInfo, competeInfo) : this.getPlayer2Victory(cardsInfo, competeInfo);
                    this.victory = obj.victory, this.failure = obj.failure;
                    return true;
                }
                if (dan1 > dan2 || dan1 < dan2) {
                    let obj = dan1 > dan2 ? this.getPlayer1Victory(cardsInfo, competeInfo) : this.getPlayer2Victory(cardsInfo, competeInfo);
                    this.victory = obj.victory, this.failure = obj.failure;
                    return true;
                }
            }
            console.log("=====tmpCards_2==", tmpCards_2);
            console.log("=======tmpCards_1====", tmpCards_1);
            for (let i = 0; i < tmpCards_1.length; i++) {
                console.log("======tmpCards_1[i]", tmpCards_1[i], "i==", i);
                console.log("======tmpCards_2[i]", tmpCards_2[i], "i==", i);
                if (tmpCards_1[i] == tmpCards_2[i])
                    continue;
                let obj = parseInt(tmpCards_1[i]) > parseInt(tmpCards_2[i]) ? this.getPlayer1Victory(cardsInfo, competeInfo) : this.getPlayer2Victory(cardsInfo, competeInfo);
                this.victory = obj.victory, this.failure = obj.failure;
                console.log("this.victory====", this.victory);
                return true;
            }
        }
        if ((cardsInfo.info == this.consts["tonghua"].info && competeInfo.info == this.consts["shunzi"].info)
            || (competeInfo.info == this.consts["tonghua"].info && cardsInfo.info == this.consts["shunzi"].info)) {
            //顺子比金华大
            if (this.self.roomConfig["sunzi"] != undefined && this.self.roomConfig["sunzi"][0] == 1) {
                let obj = cardsInfo.info == this.consts["tonghua"].info ? this.getPlayer2Victory(cardsInfo, competeInfo) : this.getPlayer1Victory(cardsInfo, competeInfo);
                this.victory = obj.victory;
                this.failure = obj.failure;
                return true;
            }
            let obj = cardsInfo.info == this.consts["tonghua"].info ? this.getPlayer1Victory(cardsInfo, competeInfo) : this.getPlayer2Victory(cardsInfo, competeInfo);
            this.victory = obj.victory;
            this.failure = obj.failure;
        }
        if ((cardsInfo.info == this.consts["tianlong"].info && competeInfo.info == this.consts["dilong"].info)
            || (cardsInfo.info == this.consts["dilong"].info && competeInfo.info == this.consts["tianlong"].info)) {
            this.getTianLong(cardsInfo, competeInfo);
            return true;
        }
        if ((cardsInfo.info == this.consts["dilong"].info && competeInfo.info == this.consts["shunzi"].info)
            || (competeInfo.info == this.consts["dilong"].info && cardsInfo.info == this.consts["shunzi"].info)) {
            this.getDilong(cardsInfo, competeInfo);
            return true;
        }
        if ((cardsInfo.info == this.consts["ersanwu"].info && competeInfo.info == this.consts["baozi"].info)
            || (cardsInfo.info == this.consts["baozi"].info && competeInfo.info == this.consts["ersanwu"].info)) {
            if (this.self.roomConfig["zhahua"] != undefined && this.self.roomConfig["zhahua"][0] == 1) {
                let obj = cardsInfo.info == this.consts["ersanwu"].info ? this.getPlayer1Victory(cardsInfo, competeInfo) : this.getPlayer2Victory(cardsInfo, competeInfo);
                this.self.isErSanWuEatBaoZi = true;
                this.victory = obj.victory;
                this.failure = obj.failure;
                return true;
            }
        }
        console.log("====cardsInfo.main====", cardsInfo.main, "======competeInfo.main", competeInfo.main);
        if (cardsInfo.main > competeInfo.main || cardsInfo.main < competeInfo.main) {
            console.log("=========cardsInfo.main===========", cardsInfo.main, "======competeInfo.main===", competeInfo.main);
            let obj = cardsInfo.main > competeInfo.main ? this.getPlayer1Victory(cardsInfo, competeInfo) : this.getPlayer2Victory(cardsInfo, competeInfo);
            this.victory = obj.victory, this.failure = obj.failure;
            return true;
        }
    }
    getDilong(cardsInfo, competeInfo) {
        if ((this.self.roomConfig["tianlongda"] != undefined && this.self.roomConfig["tianlongda"][0] == 1) ||
            (this.self.roomConfig["dilongda"] != undefined && this.self.roomConfig["dilongda"][0] == 1)) {
            let obj = cardsInfo.info == this.consts["dilong"].info ? this.getPlayer1Victory(cardsInfo, competeInfo) : this.getPlayer2Victory(cardsInfo, competeInfo);
            this.victory = obj.victory;
            this.failure = obj.failure;
            return true;
        }
        let obj = cardsInfo.info == this.consts["shunzi"].info ? this.getPlayer1Victory(cardsInfo, competeInfo) : this.getPlayer2Victory(cardsInfo, competeInfo);
        this.victory = obj.victory;
        this.failure = obj.failure;
        return true;
    }
    getTianLong(cardsInfo, competeInfo, tianlong = false) {
        console.log("=======this.self.roomConfig['tianlongda']", this.self.roomConfig["tianlongda"], "=======this.self.roomConfig['tianlong']", this.self.roomConfig["tianlong"], "=======this.self.roomConfig['dilong']", this.self.roomConfig["dilong"], "=======this.self.roomConfig['dilongda']", this.self.roomConfig["dilongda"]);
        if ((this.self.roomConfig["tianlongda"] != undefined && this.self.roomConfig["tianlongda"][0] == 1)
            || (this.self.roomConfig["dilong"] != undefined && this.self.roomConfig["dilong"][0] == 1)) {
            let obj = cardsInfo.info == this.consts["tianlong"].info || tianlong == true ? this.getPlayer1Victory(cardsInfo, competeInfo) : this.getPlayer2Victory(cardsInfo, competeInfo);
            this.victory = obj.victory;
            this.failure = obj.failure;
            return true;
        }
        if ((this.self.roomConfig["tianlong"] != undefined && this.self.roomConfig["tianlong"][0] == 1) ||
            (this.self.roomConfig["dilongda"] != undefined && this.self.roomConfig["dilongda"][0] == 1)) {
            let obj = cardsInfo.info == this.consts["tianlong"].info || tianlong == true ? this.getPlayer2Victory(cardsInfo, competeInfo) : this.getPlayer1Victory(cardsInfo, competeInfo);
            this.victory = obj.victory;
            this.failure = obj.failure;
            return true;
        }
        if ((this.self.roomConfig["tianlongda"] != undefined && this.self.roomConfig["tianlongda"][0] == 1)
            || (this.self.roomConfig["dilongda"] != undefined && this.self.roomConfig["dilongda"][0] == 1)) {
            let obj = cardsInfo.info == this.consts["dilong"].info || tianlong == true ? this.getPlayer1Victory(cardsInfo, competeInfo) : this.getPlayer2Victory(cardsInfo, competeInfo);
            this.victory = obj.victory;
            this.failure = obj.failure;
            return true;
        }
        if ((this.self.roomConfig["dilong"] != undefined && this.self.roomConfig["dilong"][0]) //地龙小于顺子
            || (this.self.roomConfig["tianlong"] != undefined && this.self.roomConfig["tianlong"][0])) {
            let obj = cardsInfo.info == this.consts["dilong"].info || tianlong == true ? this.getPlayer2Victory(cardsInfo, competeInfo) : this.getPlayer1Victory(cardsInfo, competeInfo);
            this.victory = obj.victory;
            this.failure = obj.failure;
            return true;
        }
    }
    compareFunction(a, b) {
        if (a < b) {
            return 1;
        }
        else if (a > b) {
            return -1;
        }
        else {
            return 0;
        }
    }
    getCardsSize(tmpCards) {
        let arr = [];
        let arr1 = [];
        for (let i = 0; i < tmpCards.length; i++) {
            let _tmp = tmpCards[i].split(".");
            let str = parseInt(_tmp[1]);
            let str1 = parseInt(_tmp[0]);
            arr.push(str);
        }
        return { arr: arr, arr1: arr1 };
        // return arr;
    }
    getPlayer1Victory(cardsInfo, competeInfo) {
        console.log("=====getPlayer1Victory===this.gamePlayer2.cards,uid,index", this.gamePlayer2.cards, this.gamePlayer2.uid, this.gamePlayer2.index);
        console.log("======getPlayer1Victory==this.gamePlayer1.cards,uid,index", this.gamePlayer1.cards, this.gamePlayer1.uid, this.gamePlayer1.index);
        let victory = {
            uid: this.gamePlayer1.uid,
            sid: this.gamePlayer1.index,
            type: cardsInfo.info,
            cards: ["-1", '-1', '-1']
        };
        let failure = {
            uid: this.gamePlayer2.uid,
            sid: this.gamePlayer2.index,
            type: competeInfo.info,
            cards: ["-1", '-1', '-1']
        };
        return { "victory": victory, "failure": failure };
    }
    getPlayer2Victory(cardsInfo, competeInfo) {
        console.log("==getPlayer2Victory======this.gamePlayer2.cards,uid,index", this.gamePlayer2.cards, this.gamePlayer2.uid, this.gamePlayer2.index);
        console.log("====getPlayer2Victory====this.gamePlayer1.cards,uid,index", this.gamePlayer1.cards, this.gamePlayer1.uid, this.gamePlayer1.index);
        let victory = {
            uid: this.gamePlayer2.uid,
            sid: this.gamePlayer2.index,
            type: competeInfo.info,
            cards: ["-1", '-1', '-1']
        };
        let failure = {
            uid: this.gamePlayer1.uid,
            sid: this.gamePlayer1.index,
            type: cardsInfo.info,
            cards: ["-1", '-1', '-1']
        };
        return { "victory": victory, "failure": failure };
    }
    checkHuaSe(card_1, card_2, cardsInfo, competeInfo) {
        let h1;
        let h2;
        let players = [this.gamePlayer1, this.gamePlayer2];
        console.log("checkHuaSe====card_1", card_1, "checkHuaSe====card_2", card_2);
        for (let j = 0; j < players.length; j++) {
            console.log("===checkHuaSe=cards=====", players[j].cards);
            let cards = players[j].LzCards.length > 0 ? players[j].LzCards : players[j].cards;
            if (cardsInfo.info == competeInfo.info && cardsInfo.info == this.consts.duizi.info) {
            }
            else {
                for (let i = 0; i < cards.length; i++) {
                    let card = cards[i];
                    console.log("card==", card);
                    if (j == 0) {
                        if (card.indexOf(card_1) != -1) {
                            h1 = card[0];
                            break;
                        }
                    }
                    if (j == 1) {
                        if (card.indexOf(card_2) != -1) {
                            h2 = card[0];
                            break;
                        }
                    }
                }
            }
        }
        console.log("=====h1===", h1, "=====h2====", h2);
        let obj = h1 > h2 ? this.getPlayer2Victory(cardsInfo, competeInfo) : this.getPlayer1Victory(cardsInfo, competeInfo);
        this.victory = obj.victory;
        this.failure = obj.failure;
        return;
    }
    //大喜
    checkFond(gamePlayer) {
        console.log("======gamePlayer.menpai====", gamePlayer.menpai);
        if (gamePlayer.menpai > 0) {
            let _cards = gamePlayer.LzCards.length == 0 ? gamePlayer.cards : gamePlayer.LzCards;
            let cards = pokerAlgo_1.PokerAlgo.createCardsFromIds(_cards);
            if (sanzhangAlgo_1.SanZhangAlgo.isSanTiao(cards)) {
                if (gamePlayer.LzCards.length == 0)
                    return this.self.gameConfig["multiple"]["baozi"];
                if (gamePlayer.LzCards.length > 0) {
                    for (let i = 0; i < gamePlayer.cards.length; i++) {
                        if (gamePlayer.cards[i].split(".").length < 4) {
                            return 0;
                        }
                    }
                    return this.self.gameConfig["multiple"]["baozi"];
                }
            }
            if (sanzhangAlgo_1.SanZhangAlgo.isTongHuaShun(cards) && gamePlayer.LzCards.length == 0)
                return this.self.gameConfig["multiple"]["sunjin"];
            if (this.self.isErSanWuEatBaoZi == true)
                return this.self.gameConfig["multiple"]["ersanwu"];
        }
        return 0;
    }
    checkLzCards(gamePlayer) {
        // let flag = false;
        if (gamePlayer.cards) {
            for (let i = 0; i < gamePlayer.cards.length; i++) {
                let card = gamePlayer.cards[i];
                if (card.split(".").length == 4) {
                    return true;
                }
            }
        }
        return false;
    }
    //获取懒子手牌
    LzShowCards(gamePlayer, isMenPai = false) {
        let cards = gamePlayer.cards.slice();
        let arr = []; //懒子牌
        let brandValue = [];
        let _cards = [];
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (card.split(".").length == 4) {
                arr.push(card);
                continue;
            }
            let tmpArr = card.split(".");
            brandValue.push(parseInt(tmpArr[1]));
            _cards.push(card);
        }
        brandValue.sort(this.compareFunction); //从大到小        
        let LzCards = []; //懒子变后的牌
        if (arr.length > 0) {
            if (arr.length == 1) {
                let obj = this.getLzCard(_cards, gamePlayer, brandValue, arr[0]);
                return obj;
            }
            if (arr.length == 2 || arr.length == 3) {
                let obj = this.getLzBaoZi(_cards, brandValue, arr);
                console.log("obj====", obj);
                return obj;
            }
        }
        return { cards: gamePlayer.cards };
    }
    getLzCard(cards, gamePlayer, brandValue, lzCard) {
        let _cards = pokerAlgo_1.PokerAlgo.createCardsFromIds(cards);
        let cardsInfo = this.getCheckCards(_cards, gamePlayer);
        let card = "";
        let LzCards = cards.slice();
        let color_1 = cards[0].split('.')[0];
        let color_2 = cards[1].split(".")[0];
        let value_1 = cards[0].split(".")[1];
        let value_2 = cards[1].split(".")[1];
        let obj_1 = {};
        let obj_2 = {};
        let typeObj_1 = {};
        let typeObj_2 = {};
        let isTongHua = false;
        console.log("cardsInfo.info=====", cardsInfo.info);
        if (cardsInfo.info == this.consts.tonghua.info)
            isTongHua = true;
        // console.log("cardsInfo.info=====",cardsInfo.info);
        if (cardsInfo.info == this.consts.duizi.info || cardsInfo.info == this.consts.baozi.info) {
            let obj = this.changeCards(lzCard, value_1, cards);
            console.log("======obj===", obj);
            cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
            return { cards: cards, LzCards: LzCards, type: this.consts.baozi.info };
        }
        if (cardsInfo.info == this.consts.shunzi.info || cardsInfo.info == this.consts.shunjin.info
            || cardsInfo.info == this.consts.tianlong.info || cardsInfo.info == this.consts.dilong.info) {
            // let lzCards: any = [];
            console.log("===cardsInfo.info==", cardsInfo.info);
            let type = cardsInfo.info != this.consts.shunjin.info ? this.consts.shunzi.info : this.consts.shunjin.info;
            if (brandValue[0] == "14" && brandValue[1] == "13") {
                let obj = cardsInfo.info != this.consts.shunjin.info ? this.changeCards(lzCard, '12') : this.changeCards(lzCard, '12', cards, true);
                cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
                type = cardsInfo.info != this.consts.shunjin.info ? this.consts.tianlong.info : this.consts.shunjin.info;
                return { cards: cards, LzCards: LzCards, type: type };
            }
            ;
            if (brandValue[0] == "3" && brandValue[1] == "2") {
                if ((this.self.roomConfig["dilong"] != undefined && this.self.roomConfig["dilong"][0] == 1) ||
                    (this.self.roomConfig["tianlong"] != undefined && this.self.roomConfig["tianlong"][0] == 1)) {
                    let obj = cardsInfo.info != this.consts.shunjin.info ? this.changeCards(lzCard, '4') : this.changeCards(lzCard, "4", cards, true);
                    cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
                    return { cards: cards, LzCards: LzCards, type: type };
                }
                else {
                    let obj = cardsInfo.info != this.consts.shunzi.info ? this.changeCards(lzCard, '14') : this.changeCards(lzCard, "14", cards, true);
                    cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
                    type = type == this.consts.shunjin.info ? this.consts.shunjin.info : this.consts.dilong.info;
                    return { cards: cards, LzCards: LzCards, type: type };
                }
            }
            let num = parseInt(brandValue[0]) + 1;
            let obj = cardsInfo.info != this.consts.shunjin.info ? this.changeCards(lzCard, num.toString()) : this.changeCards(lzCard, num.toString(), cards, true);
            cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
            console.log("======type====", type);
            if (num.toString() == "14")
                type = type != this.consts.shunjin.info ? this.consts.tianlong.info : this.consts.shunjin.info;
            return { cards: cards, LzCards: LzCards, type: type };
        }
        if ((parseInt(brandValue[0]) - parseInt(brandValue[1])) == 1 || (parseInt(brandValue[0]) - parseInt(brandValue[1])) == 2) {
            let num = (parseInt(brandValue[0]) - parseInt(brandValue[1])) == 1 ? (parseInt(brandValue[1]) + 1).toString() : (parseInt(brandValue[0]) - 1).toString();
            let obj = isTongHua == true ? this.changeCards(lzCard, num, cards, true) : this.changeCards(lzCard, num);
            let type = isTongHua == true ? this.consts.shunjin.info : this.consts.shunzi.info;
            cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
            return { cards: cards, LzCards: LzCards, type: type };
        }
        if (cardsInfo.info == this.consts.tonghua.info) {
            let obj = brandValue[0] == "14" ? this.changeCards(lzCard, "13", cards, true) : this.changeCards(lzCard, "14", cards, true);
            cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
            return { cards: cards, LzCards: LzCards, type: this.consts.tonghua.info };
        }
        if (cardsInfo.info = this.consts.dantao.info) {
            let obj = this.changeCards(lzCard, brandValue[0]);
            cards.push(obj["card"]), LzCards.push(obj["lzCard"]);
            return { cards, LzCards: LzCards, type: this.consts.duizi.info };
        }
    }
    //获取懒子豹子
    getLzBaoZi(cards, brandValue, LzCards) {
        console.log("======getLzBaoZi==cards=", cards, "====brandValue=", brandValue, "=====LzCards", LzCards);
        let card = brandValue.length == 0 ? LzCards[0].split(".")[2] : brandValue[0];
        let _cards = cards.slice();
        let _lzCards = cards.slice();
        for (let i = 0; i < LzCards.length; i++) {
            let LzCard = LzCards[i];
            let obj = this.changeCards(LzCard, card, cards);
            _cards.push(obj["card"]);
            _lzCards.push(obj["lzCard"]);
        }
        return { cards: _cards, LzCards: _lzCards, type: this.consts.baozi.info };
    }
    changeCards(lzCard, value_1, cards = [], isTongHua = false, isSpecial = 0) {
        console.log("lzCard===", lzCard, "====value_1==", value_1, "=====cards==", cards, "isTongHua====", isTongHua, "isSpecial====", isSpecial);
        let tempArrLz = lzCard.split("."); //["0"."2","0","2"]
        tempArrLz[3] = value_1;
        let card = "";
        if (isTongHua == false) {
            card = tempArrLz.join(".");
        }
        else {
            let color = cards[0][0];
            tempArrLz[2] = color;
            card = tempArrLz.join(".");
        }
        let str = "";
        if (isTongHua == false) {
            str = tempArrLz[0].toString() + "." + value_1.toString();
        }
        else {
            let _card = cards[0];
            if (isSpecial == 1) {
                str = _card.split(".")[0].toString() == "3" ? "0" + value_1 : (parseInt(_card.split(".")[0]) + 1).toString() + value_1;
            }
            else {
                str = _card.split(".")[0].toString() + "." + value_1;
            }
        }
        return { card: card, lzCard: str };
    }
    sortCardsPlayer(cards) {
        let obj = {};
        let LzCard = [];
        let duizi = false;
        let baozi = false;
        let keyArr = [];
        let _cards = [];
        let _arr = [];
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            let tmpArr = card.split(".");
            if (tmpArr.length == 4) {
                LzCard.push(card);
                continue;
            }
            let key = tmpArr[1];
            keyArr.push(parseInt(key));
            if (obj[key] == undefined) {
                obj[key] = [tmpArr[0]];
                continue;
            }
            obj[key].push(parseInt(tmpArr[0]));
            obj[key].sort((a, b) => { return a > b; });
            if (obj[key].length == 3) {
                duizi = false;
                baozi = key;
                continue;
            }
            if (obj[key].length == 2)
                duizi = key;
        }
        keyArr.sort((a, b) => { return a > b; });
        if (keyArr.length == 3) {
            if (keyArr[0] == "2" && keyArr[1] == "3" && keyArr[2] == "14") {
                let _keyArr = [keyArr[2], keyArr[0], keyArr[1]];
                _cards = this._getSortDanCards(_keyArr, obj);
                return _cards.concat(LzCard);
            }
        }
        if (duizi != false) {
            _arr = obj[duizi.toString()];
            _cards = this._getSortDuiBaoCards(_arr, duizi);
            for (let k in obj) {
                if (k != duizi) {
                    _cards.push(obj[k][0].toString() + "." + k.toString());
                }
            }
        }
        if (baozi != false) {
            _arr = obj[baozi.toString()];
            _cards = this._getSortDuiBaoCards(_arr, baozi);
        }
        if (duizi == false && baozi == false)
            _cards = this._getSortDanCards(keyArr, obj);
        return _cards.concat(LzCard);
    }
    _getSortDanCards(keyArr, obj) {
        let _cards = [];
        for (let i = 0; i < keyArr.length; i++) {
            let _key = keyArr[i].toString();
            _cards.push(obj[_key].toString() + "." + _key.toString());
        }
        return _cards;
    }
    _getSortDuiBaoCards(arr, duizi) {
        let _cards = [];
        for (let i = 0; i < arr.length; i++) {
            _cards.push(arr[i].toString() + "." + duizi.toString());
        }
        return _cards;
    }
}
exports.default = SanZhuangBeat;
