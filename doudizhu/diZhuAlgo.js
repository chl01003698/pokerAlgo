"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _, Combinatorics;
if (global['window'] != null) {
}
else {
    _ = require('lodash');
    Combinatorics = require('js-combinatorics');
}
const pokerAlgo_1 = require("../pokerAlgo");
class DiZhuAlgo extends pokerAlgo_1.PokerAlgo {
    static filterCardTypeFuncs(cardsLength) {
        return _.filter(this.cardTypeFuncs, (v) => {
            return this.isLengthLegal(cardsLength, v);
        });
    }
    static prompt(cards, nativeHandCards) {
        let handCards = _.clone(nativeHandCards);
        const handCardsLength = handCards.length;
        pokerAlgo_1.PokerAlgo.sortCardsByValueAndColor(handCards);
        let results = [];
        let cardGroup = undefined;
        if (_.isArray(cards)) {
            cardGroup = this.createCardGroup(cards);
        }
        else {
            cardGroup = cards;
        }
        if (cardGroup == undefined)
            return results;
        const cardGroupLength = cardGroup.typeObject.length;
        if (cardGroup != undefined) {
            if (handCardsLength >= cardGroupLength) {
                let sameLevelCards = cardGroup.typeObject.findFunc.bind(this)(handCards, cards.length);
                _.remove(sameLevelCards, (v) => {
                    return !this.beat(cardGroup, _.flattenDeep(v))[0];
                });
                results.push(sameLevelCards);
            }
            const weight = cardGroup.typeObject.weight;
            const filterTypeFuncs = _.filter(this.cardTypeFuncs, (typeObj) => {
                return typeObj.weight > weight && handCardsLength >= typeObj.length;
            });
            _.forEach(filterTypeFuncs, (v) => {
                const result = v.findFunc.bind(this)(handCards, cards.length);
                if (result.length > 0) {
                    results.push(result);
                }
            });
        }
        if (!_.isEmpty(results)) {
            results = _.map(_.flatten(results), function (v) { return _.flattenDeep(v); });
        }
        return results;
    }
    static firstBigger(cards, nativeHandCards) {
        let handCards = _.clone(nativeHandCards);
        const handCardsLength = handCards.length;
        pokerAlgo_1.PokerAlgo.sortCardsByValueAndColor(handCards);
        let results = [];
        let cardGroup = undefined;
        if (_.isArray(cards)) {
            cardGroup = this.createCardGroup(cards);
        }
        else {
            cardGroup = cards;
        }
        if (cardGroup == undefined)
            return results;
        const cardGroupLength = cardGroup.typeObject.length;
        if (cardGroup != undefined) {
            if (handCardsLength >= cardGroupLength) {
                let sameLevelCards = cardGroup.typeObject.findFunc.bind(this)(handCards, cards.length);
                _.remove(sameLevelCards, (v) => {
                    return !this.beat(cardGroup, _.flattenDeep(v))[0];
                });
                if (sameLevelCards.length > 0) {
                    results = _.flattenDeep(sameLevelCards[0]);
                    return results;
                }
            }
            const weight = cardGroup.typeObject.weight;
            const filterTypeFuncs = _.filter(this.cardTypeFuncs, (typeObj) => {
                return typeObj.weight > weight && handCardsLength >= typeObj.length;
            });
            _.forEach(filterTypeFuncs, (v) => {
                const result = v.findFunc.bind(this)(handCards, cards.length);
                if (result.length > 0) {
                    results = result[0];
                    return false;
                }
            });
        }
        return results;
    }
    static findRobotInput(cards) {
        let result = [];
        _.forEach(this.RobotInputTypes, (v) => {
            const cardTypeFunc = this.cardTypeFuncs[v];
            const results = cardTypeFunc.exactFindFunc.bind(this)(cards);
            if (results.length > 0) {
                result = _.flattenDeep(results[0]);
                return false;
            }
        });
        return result;
    }
    //发牌
    static dealCards(cards, assignCount = 17, take = 3) {
        const cloneCards = _.clone(cards);
        const random = [];
        while (take) {
            let index = _.random(cloneCards.length - 1);
            random.push(cloneCards[index]);
            cloneCards.splice(index, 1);
            take -= 1;
        }
        let results = _.chunk(cloneCards, assignCount);
        results.push(random);
        return results;
    }
    static defaultCards(num = 17) {
        const _cards = [];
        for (let i = 0; i < num; i++) {
            _cards.push("-1");
        }
    }
    static isLegal(cards) {
        let legal = false;
        const funcs = this.filterCardTypeFuncs(cards.length);
        _.forEachRight(funcs, (v) => {
            legal = v.func(cards, cards.length);
            if (legal == true) {
                return false;
            }
        });
        return legal;
    }
    static isLengthLegal(cardsLength, typeObj) {
        return (typeObj.length == cardsLength && typeObj.strict == true) || (cardsLength >= typeObj.length && typeObj.strict == false);
    }
    static getCardsType(cards) {
        let type = -1;
        const cardsLength = cards.length;
        _.forEachRight(this.cardTypeFuncs, (v, i) => {
            if (this.isLengthLegal(cardsLength, v)) {
                if (v.func(cards, cards.length)) {
                    type = i;
                    return false;
                }
            }
        });
        return type;
    }
    static beat(oldCards, beatCards) {
        let sourceGroup = undefined;
        let beatGroup = undefined;
        if (_.isEmpty(oldCards) && !_.isEmpty(beatCards)) {
            if (_.isArray(beatCards)) {
                beatGroup = this.createCardGroup(beatCards);
            }
            else {
                beatGroup = beatCards;
            }
            return [true, beatGroup];
        }
        else if (_.isEmpty(beatCards)) {
            return [false];
        }
        if (_.isArray(oldCards)) {
            sourceGroup = this.createCardGroup(oldCards);
        }
        else {
            sourceGroup = oldCards;
        }
        if (_.isArray(beatCards)) {
            beatGroup = this.createCardGroup(beatCards);
        }
        else {
            beatGroup = beatCards;
        }
        let result = [false, beatGroup];
        if (sourceGroup != undefined && beatGroup != undefined) {
            if (beatGroup.typeObject.weight > sourceGroup.typeObject.weight) {
                result[0] = true;
            }
            else if (beatGroup.typeObject.weight == sourceGroup.typeObject.weight && beatGroup.typeObject.type == sourceGroup.typeObject.type && sourceGroup.cards.length == beatGroup.cards.length) {
                result[0] = this.comparePoints(sourceGroup.beatCards, beatGroup.beatCards);
            }
        }
        return result;
    }
    static comparePoints(cards, beatCards) {
        const maxCard = _.maxBy(cards, 'v');
        const maxBeatCard = _.maxBy(beatCards, 'v');
        if (maxBeatCard.v > maxCard.v) {
            return true;
        }
        return false;
    }
    static createCardGroup(cards) {
        let cardGroup = undefined;
        const funcs = this.filterCardTypeFuncs(cards.length);
        _.forEachRight(funcs, (v) => {
            const result = v.findFunc.bind(this)(cards, cards.length);
            if (result.length == 1) {
                cardGroup = new pokerAlgo_1.PokerCardGroup(v, result[0]);
                return false;
            }
        });
        return cardGroup;
    }
    static findDanShunSmart(cards, length = 3) {
        let results = [];
        const uniqCards = _.uniqBy(cards, 'v');
        if (uniqCards.length < length) {
            return results;
        }
        const filterArray = _.concat(pokerAlgo_1.PokerAlgo.filterDanShunArray(pokerAlgo_1.PokerAlgo.filterCardsInRange(uniqCards, _.range(5, 15)), length), pokerAlgo_1.PokerAlgo.filterDanShunArray(pokerAlgo_1.PokerAlgo.filterCardsInRange(uniqCards, _.range(14, 18)), length));
        if (filterArray.length == 0) {
            return results;
        }
        return [_.maxBy(filterArray, 'length')];
    }
    static findShuangShunSmart(cards, length = 2) {
        let results = [];
        const group = pokerAlgo_1.PokerAlgo.groupByValue(cards);
        let filterCards = pokerAlgo_1.PokerAlgo.findSameCardGroupsEx(group, length);
        filterCards = _.flatten(filterCards);
        const uniqCards = _.uniqBy(filterCards, 'v');
        if (uniqCards.length < length) {
            return results;
        }
        const filterArray = _.concat(pokerAlgo_1.PokerAlgo.filterDanShunArray(pokerAlgo_1.PokerAlgo.filterCardsInRange(uniqCards, _.range(5, 15)), length), pokerAlgo_1.PokerAlgo.filterDanShunArray(pokerAlgo_1.PokerAlgo.filterCardsInRange(uniqCards, _.range(14, 18)), length));
        if (filterArray.length == 0) {
            return results;
        }
        let maxLength = _.maxBy(filterArray, 'length').length;
        return pokerAlgo_1.PokerAlgo.findDuoShun(filterCards, maxLength * length, length);
    }
    static smartPicker(cards) {
        if (cards.length <= 1) {
            return cards;
        }
        let filterCards = _.clone(cards);
        const funcs = DiZhuAlgo.pickFuncs;
        _.forEachRight(funcs, (v) => {
            let result = v(cards);
            if (result.length > 0) {
                filterCards = result[0];
                return false;
            }
        });
        return filterCards;
    }
    static getBombCount(cards) {
        const results = _.countBy(cards, 'v');
        let bomb = 0;
        _.forEach(results, (v, k) => {
            if (v >= 4) {
                ++bomb;
            }
        });
        if (this.findKingBomb(cards, 16, 1, 1).length > 0) {
            ++bomb;
        }
        return bomb;
    }
    static sortByBombNumber(cardsArray) {
        cardsArray.sort(function (a, b) {
            return DiZhuAlgo.getBombCount(b) - DiZhuAlgo.getBombCount(a);
        });
    }
}
DiZhuAlgo.cardTypeFuncs = [];
DiZhuAlgo.RobotInputTypes = [];
DiZhuAlgo.pickFuncs = [
    DiZhuAlgo.findShuangShunSmart,
    DiZhuAlgo.findDanShunSmart
];
exports.DiZhuAlgo = DiZhuAlgo;
