"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pokerAlgo_1 = require("../pokerAlgo");
let _, Combinatorics;
if (global['window'] != null) {
}
else {
    _ = require('lodash');
    Combinatorics = require('js-combinatorics');
}
var SanZhangCardType;
(function (SanZhangCardType) {
    SanZhangCardType[SanZhangCardType["DAN_TIAO"] = 0] = "DAN_TIAO";
    SanZhangCardType[SanZhangCardType["DUI_ZI"] = 1] = "DUI_ZI";
    SanZhangCardType[SanZhangCardType["SHUN_ZI"] = 2] = "SHUN_ZI";
    SanZhangCardType[SanZhangCardType["TONG_HUA"] = 3] = "TONG_HUA";
    SanZhangCardType[SanZhangCardType["TONG_HUA_SHUN"] = 4] = "TONG_HUA_SHUN";
    SanZhangCardType[SanZhangCardType["SAN_TIAO"] = 5] = "SAN_TIAO";
})(SanZhangCardType = exports.SanZhangCardType || (exports.SanZhangCardType = {}));
var SanZhangPaiCaiType;
(function (SanZhangPaiCaiType) {
    SanZhangPaiCaiType[SanZhangPaiCaiType["NONE"] = -1] = "NONE";
    SanZhangPaiCaiType[SanZhangPaiCaiType["AAA"] = 0] = "AAA";
    SanZhangPaiCaiType[SanZhangPaiCaiType["SAN_TIAO"] = 1] = "SAN_TIAO";
    SanZhangPaiCaiType[SanZhangPaiCaiType["TONG_HUA_SHUN"] = 2] = "TONG_HUA_SHUN";
})(SanZhangPaiCaiType = exports.SanZhangPaiCaiType || (exports.SanZhangPaiCaiType = {}));
class SanZhangAlgo extends pokerAlgo_1.PokerAlgo {
    static testTwoThreeFiveFunc(sourceGroup, beatGroup) {
        return pokerAlgo_1.PokerAlgo.isCardsEqualByValue(beatGroup.cards, [2, 3, 5]) && _.uniqBy(beatGroup.cards, 'c').length == beatGroup.cards.length && sourceGroup.typeObject['type'] == SanZhangCardType.SAN_TIAO;
    }
    static twoThreeFiveFunc(sourceGroup, beatGroup) {
        if (SanZhangAlgo.testTwoThreeFiveFunc(sourceGroup, beatGroup)) {
            return 1;
        }
        else {
            return -1;
        }
    }
    static testOneTwoThree(group1, group2) {
        return pokerAlgo_1.PokerAlgo.isCardsEqualByValue(group1.cards, [2, 3, 14]) && pokerAlgo_1.PokerAlgo.isCardsEqualByValue(group2.cards, [2, 3, 4]);
    }
    static getLzCards(cards) {
        let num = Math.ceil(Math.random() * (cards.length - 3));
        return [cards[num]];
    }
    static getPlayerCards(cards, LzCard) {
        let tmpCards = [];
        let str = LzCard.substr(2);
        let card = "";
        let tmpCard = "";
        let tmpColor = "";
        for (let i = 0; i < cards.length; i++) {
            card = cards[i];
            tmpCard = card.substr(2);
            tmpColor = card[0];
            if (tmpCard == str) {
                card = card + "." + tmpColor + "." + tmpCard; //0.2.0.2
                tmpCards.push(card);
                continue;
            }
            tmpCards.push(card);
        }
        return tmpCards;
    }
    static oneTwoThreeFunc(sourceGroup, beatGroup, shunzida) {
        pokerAlgo_1.PokerAlgo.replaceCardsValue(sourceGroup.cards, 14, 1);
        pokerAlgo_1.PokerAlgo.replaceCardsValue(beatGroup.cards, 14, 1);
        const result = SanZhangAlgo.beatTemplate(sourceGroup, beatGroup, shunzida);
        pokerAlgo_1.PokerAlgo.replaceCardsValue(sourceGroup.cards, 1, 14);
        pokerAlgo_1.PokerAlgo.replaceCardsValue(beatGroup.cards, 1, 14);
        return result;
    }
    static beat(sourceCards, targetCards, shunzida, ersanwu) {
        let sourceGroup = undefined;
        let targetGroup = undefined;
        if (_.isArray(sourceCards)) {
            if (pokerAlgo_1.PokerAlgo.isCardsEqualByValue(sourceCards, [2, 3, 14])) {
                pokerAlgo_1.PokerAlgo.replaceCardsValue(sourceCards, 14, 1);
            }
            sourceGroup = SanZhangAlgo.createCardGroup(sourceCards, shunzida);
        }
        else {
            sourceGroup = sourceCards;
        }
        if (_.isArray(targetCards)) {
            if (pokerAlgo_1.PokerAlgo.isCardsEqualByValue(targetCards, [2, 3, 14])) {
                pokerAlgo_1.PokerAlgo.replaceCardsValue(targetCards, 14, 1);
            }
            targetGroup = SanZhangAlgo.createCardGroup(targetCards, shunzida);
        }
        else {
            targetGroup = targetCards;
        }
        let result = 0;
        let specialFuncs = undefined;
        if (ersanwu) {
            specialFuncs = SanZhangAlgo.specialFuncs1;
        }
        else {
            specialFuncs = SanZhangAlgo.specialFuncs;
        }
        _.forEach(specialFuncs, function (v, i) {
            if (v.testFunc(sourceGroup, targetGroup) || v.testFunc(targetGroup, sourceGroup)) {
                result = v.func(sourceGroup, targetGroup, shunzida);
                return false;
            }
        });
        if (result == 0) {
            result = SanZhangAlgo.beatTemplate(sourceGroup, targetGroup, shunzida);
        }
        if (_.isArray(sourceCards) && pokerAlgo_1.PokerAlgo.isCardsEqualByValue(sourceCards, [1, 2, 3])) {
            pokerAlgo_1.PokerAlgo.replaceCardsValue(sourceCards, 1, 14);
        }
        if (_.isArray(targetCards) && pokerAlgo_1.PokerAlgo.isCardsEqualByValue(targetCards, [1, 2, 3])) {
            pokerAlgo_1.PokerAlgo.replaceCardsValue(targetCards, 1, 14);
        }
        return result;
    }
    static beatTemplate(sourceCards, targetCards, shunzida) {
        let sourceGroup = undefined;
        let targetGroup = undefined;
        if (_.isArray(sourceCards)) {
            sourceGroup = SanZhangAlgo.createCardGroup(sourceCards, shunzida);
        }
        else {
            sourceGroup = sourceCards;
        }
        if (_.isArray(targetCards)) {
            targetGroup = SanZhangAlgo.createCardGroup(targetCards, shunzida);
        }
        else {
            targetGroup = targetCards;
        }
        let result = 0;
        if (sourceGroup != undefined && targetGroup != undefined) {
            if (sourceGroup.typeObject.weight > targetGroup.typeObject.weight) {
                result = 1;
            }
            else if (sourceGroup.typeObject.weight < targetGroup.typeObject.weight) {
                result = -1;
            }
            else if (targetGroup.typeObject.weight == sourceGroup.typeObject.weight && targetGroup.typeObject.type == sourceGroup.typeObject.type) {
                if (sourceGroup.typeObject.type == SanZhangCardType.DUI_ZI) {
                    const scardsGroup = SanZhangAlgo.getDuiZiAndSanPai(sourceGroup.cards);
                    const tcardsGroup = SanZhangAlgo.getDuiZiAndSanPai(targetGroup.cards);
                    result = SanZhangAlgo.comparePointsAndColor(scardsGroup[0], tcardsGroup[0], false);
                    if (result == 0) {
                        result = SanZhangAlgo.comparePointsAndColor(scardsGroup[1], tcardsGroup[1], false);
                    }
                }
                else {
                    result = SanZhangAlgo.comparePointsAndColor(sourceGroup.cards, targetGroup.cards, false);
                }
            }
        }
        return result;
    }
    static getDuiZiAndSanPai(cards) {
        const group = pokerAlgo_1.PokerAlgo.groupByValue(cards);
        let duizi = [];
        let sanpai = [];
        _.forEach(group, function (v, k) {
            if (v.length == 2) {
                duizi = v;
            }
            else if (v.length == 1) {
                sanpai = v;
            }
        });
        return [duizi, sanpai];
    }
    static createCardGroup(cards, shunzida) {
        let cardGroup = undefined;
        let cardTypeFuncs = undefined;
        if (shunzida) {
            cardTypeFuncs = SanZhangAlgo.cardTypeFuncs1;
        }
        else {
            cardTypeFuncs = SanZhangAlgo.cardTypeFuncs;
        }
        _.forEachRight(cardTypeFuncs, (v) => {
            const result = v.func(cards);
            if (result == true) {
                cardGroup = new pokerAlgo_1.PokerCardGroup(v, cards);
                return false;
            }
        });
        return cardGroup;
    }
    static getCardsType(cards) {
        let type = -1;
        _.forEachRight(SanZhangAlgo.cardTypeFuncs, (v, i) => {
            const result = v.func(cards);
            if (result == true) {
                type = i;
                return false;
            }
        });
        return type;
    }
    static isDanTiao(cards) {
        return true;
    }
    static isDuiZi(cards) {
        if (cards.length > 2)
            return _.uniqBy(cards, 'v').length == 2;
        let arr = [];
        let c = 0;
        for (let i = 0; i < cards.length; i++) {
            if (c == cards[i].v)
                return true;
            c = cards[i].v;
        }
        return false;
    }
    static isDanShunZi(cards) {
        return pokerAlgo_1.PokerAlgo.isContinuous(cards);
    }
    static isSanTiao(cards) {
        return _.uniqBy(cards, 'v').length == 1;
    }
    static isTongHua(cards) {
        return _.uniqBy(cards, 'c').length == 1;
    }
    static isTongHuaShun(cards) {
        return pokerAlgo_1.PokerAlgo.isContinuous(cards) && _.uniqBy(cards, 'c').length == 1;
    }
    static getPaiCaiResult(cards) {
        let type = -1;
        let multiple = 0;
        let isSanTiao = SanZhangAlgo.isSanTiao(cards);
        if (isSanTiao && cards[0].v == 14) {
            type = SanZhangPaiCaiType.AAA;
            multiple = 20;
        }
        else if (isSanTiao) {
            type = SanZhangPaiCaiType.SAN_TIAO;
            multiple = 10;
        }
        else if (SanZhangAlgo.isTongHuaShun(cards)) {
            type = SanZhangPaiCaiType.TONG_HUA_SHUN;
            multiple = 5;
        }
        return [type, multiple];
    }
}
SanZhangAlgo.paiCaiBonus = [20, 10, 5];
SanZhangAlgo.cardTypeFuncs = [
    { type: SanZhangCardType.DAN_TIAO, func: SanZhangAlgo.isDanTiao, weight: 1 },
    { type: SanZhangCardType.DUI_ZI, func: SanZhangAlgo.isDuiZi, weight: 2 },
    { type: SanZhangCardType.SHUN_ZI, func: SanZhangAlgo.isDanShunZi, weight: 3 },
    { type: SanZhangCardType.TONG_HUA, func: SanZhangAlgo.isTongHua, weight: 4 },
    { type: SanZhangCardType.TONG_HUA_SHUN, func: SanZhangAlgo.isTongHuaShun, weight: 5 },
    { type: SanZhangCardType.SAN_TIAO, func: SanZhangAlgo.isSanTiao, weight: 6 }
];
SanZhangAlgo.cardTypeFuncs1 = [
    { type: SanZhangCardType.DAN_TIAO, func: SanZhangAlgo.isDanTiao, weight: 1 },
    { type: SanZhangCardType.DUI_ZI, func: SanZhangAlgo.isDuiZi, weight: 2 },
    { type: SanZhangCardType.TONG_HUA, func: SanZhangAlgo.isTongHua, weight: 3 },
    { type: SanZhangCardType.SHUN_ZI, func: SanZhangAlgo.isDanShunZi, weight: 4 },
    { type: SanZhangCardType.TONG_HUA_SHUN, func: SanZhangAlgo.isTongHuaShun, weight: 5 },
    { type: SanZhangCardType.SAN_TIAO, func: SanZhangAlgo.isSanTiao, weight: 6 }
];
SanZhangAlgo.specialFuncs1 = [
    { type: "235", testFunc: SanZhangAlgo.testTwoThreeFiveFunc, func: SanZhangAlgo.twoThreeFiveFunc }
];
SanZhangAlgo.specialFuncs = [];
exports.SanZhangAlgo = SanZhangAlgo;
