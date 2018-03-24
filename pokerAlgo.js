"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _, Combinatorics;
if (global['window'] != null) {
}
else {
    _ = require('lodash');
    Combinatorics = require('js-combinatorics');
}
/**
 * 卡牌类
 * @export
 * @class PokerCard
 */
class PokerCard {
    constructor(c, v, lc = -1, lv = -1) {
        this.id = [...arguments].join('.');
        this.c = c;
        this.v = v;
        this.lc = lc;
        this.lv = lv;
    }
    resetId() {
        this.id = [...arguments].join('.');
    }
}
exports.PokerCard = PokerCard;
class PokerCardGroup {
    constructor(typeObject, cards) {
        this.typeObject = typeObject;
        if (_.isArray(cards[0])) {
            this.beatCards = _.flattenDeep(cards[0]);
        }
        else {
            this.beatCards = cards;
        }
        this.cards = _.flattenDeep(cards);
    }
}
exports.PokerCardGroup = PokerCardGroup;
class PokerAlgo {
    //初始化牌
    static initCards(start, end, needKing, few = 1, typesCount = 4) {
        const results = [];
        const colors = _.range(typesCount);
        const values = _.range(start, end);
        const fews = _.range(few);
        _.forEach(fews, function (few) {
            _.forEach(colors, function (color) {
                _.forEach(values, function (value) {
                    results.push(new PokerCard(color, value));
                });
            });
            if (needKing) {
                results.push(new PokerCard(0, end));
                results.push(new PokerCard(0, end + 1));
            }
        });
        return results;
    }
    /**
     * 获取一组牌的对应ID
     * @static
     * @param {Array<PokerCard>} cards
     * @returns {Array<string>}
     * @memberof PokerAlgorithm
     */
    static pickCardIds(cards) {
        return _.map(cards, function (card) {
            return card.id;
        });
    }
    /**
     * 根据一组id来创建一副卡牌对象
     * @static
     * @param {Array<string>} ids
     * @returns {Array<PokerCard>}
     * @memberof PokerAlgorithm
     */
    static createCardsFromIds(ids) {
        return _.map(ids, function (id) {
            const result = _.split(id, '.');
            if (result.length == 2) {
                return new PokerCard(parseInt(result[0]), parseInt(result[1]));
            }
            else if (result.length == 3) {
                return new PokerCard(parseInt(result[0]), parseInt(result[1]), parseInt(result[2]));
            }
        });
    }
    /**
     * 获取一组牌除牌型以外的散牌数组
     * @static
     * @param {Array<PokerCard>} allCards
     * @param {Array<PokerCard>} cards
     * @returns
     * @memberof PokerAlgorithm
     */
    static getOtherCards(allCards, cards) {
        return _.differenceWith(allCards, _.flattenDeep(cards), _.isEqual);
    }
    static removeCards(allCards, cards) {
        return _.remove(allCards, function (v) {
            let index = _.findIndex(cards, function (card) { return _.isEqual(v, card); });
            return index != -1;
        });
    }
    /**
     * 对卡牌进行洗牌处理
     * @static
     * @param {Array<PokerCard>} cards
     * @returns {Array<PokerCard>}
     * @memberof PokerAlgorithm
     */
    static shuffleCards(cards) {
        return _.shuffle(cards);
    }
    /**
     * 根据一组牌的牌值进行排序
     * @static
     * @param {Array<PokerCard>} cards
     * @memberof PokerAlgorithm
     */
    static sortCardsByValue(cards) {
        cards.sort(function (a, b) {
            return a.v - b.v;
        });
    }
    static sortCardsByValueDescend(cards) {
        cards.sort(function (a, b) {
            return b.v - a.v;
        });
    }
    /**
     * 根据一组牌的花色进行排序
     * @static
     * @param {Array<PokerCard>} cards
     * @memberof PokerAlgorithm
     */
    static sortCardsByColor(cards) {
        cards.sort(function (a, b) {
            return a.c - b.c;
        });
    }
    static sortCardsByColorDescend(cards) {
        cards.sort(function (a, b) {
            return b.c - a.c;
        });
    }
    static sortCardsByValueAndColor(cards) {
        cards.sort(function (a, b) {
            if (a.v == b.v) {
                return a.c - b.c;
            }
            return a.v - b.v;
        });
    }
    static sortCardsByValueAndColorDescend(cards) {
        cards.sort(function (a, b) {
            if (a.v == b.v) {
                return b.c - a.c;
            }
            return b.v - a.v;
        });
    }
    /**
     * 切牌处理,把卡牌平均分给玩家
     * @static
     * @param {Array<PokerCard>} cards
     * @param {number} [assignCount=13]
     * @memberof PokerAlgorithm
     */
    static dealCards(cards, assignCount = 13, take = 0) {
        const results = _.chunk(cards, assignCount);
        const resultsLength = results.length;
        if (take > 0 && resultsLength > 0) {
            results[resultsLength - 1] = _.take(results[resultsLength - 1], take);
        }
        return results;
    }
    // static defaultCards(count:){
    // }
    static pollDealCards(cards, assignCount = 13, take = 0) {
        const playerCount = Math.round(cards.length / assignCount);
        const results = [];
        for (let f = 0; f < playerCount; ++f) {
            results.push(new Array());
        }
        let z = 0;
        for (let i = 0; i < assignCount; ++i) {
            for (let k = 0; k < playerCount; ++k) {
                if (cards[z] != undefined) {
                    results[k].push(cards[z]);
                    ++z;
                }
                else {
                    break;
                }
            }
        }
        const remainCards = _.slice(cards, z);
        results.push(remainCards);
        const resultsLength = results.length;
        if (take > 0 && resultsLength > 0) {
            results[resultsLength - 1] = _.take(results[resultsLength - 1], take);
        }
        return results;
    }
    /**
   * 获取卡牌索引, 传入手里整副牌以及要出的牌来获取出牌索引数组
   * @static
   * @param {Array<PokerCard>} allCards
   * @param {Array<PokerCard>} cards
   * @returns {Array<number>}
   * @memberof PokerAlgorithm
   */
    static findCardsIndex(allCards, cards) {
        const indexes = [];
        _.forEach(cards, function (card) {
            let index = _.findIndex(allCards, function (card1) { return _.isEqual(card1, card); });
            if (index != -1) {
                indexes.push(index);
            }
        });
        return indexes;
    }
    static findCard(cards, card) {
        return _.find(cards, function (v) {
            return v.v == card.v && v.c == card.c;
        });
    }
    static everyCardsExist(allCards, cards) {
        return _.every(cards, function (v) {
            let index = _.findIndex(allCards, function (v1) { return _.isEqual(v, v1); });
            return index != -1;
        });
    }
    static isCardsEqualByValue(cards, values) {
        const cardValues = _.map(cards, 'v');
        cardValues.sort(function (a, b) {
            return a - b;
        });
        values.sort(function (a, b) {
            return a - b;
        });
        return _.isEqual(cardValues, values);
    }
    /**
   * 获取一组牌花色分组数量
   * @static
   * @param {Array<PokerCard>} cards
   * @returns {object}
   * @memberof PokerAlgorithm
   */
    static countByColor(cards) {
        return _.countBy(cards, 'c');
    }
    /**
     * 获取一组牌牌值分组数量
     * @static
     * @param {Array<PokerCard>} cards
     * @returns {object}
     * @memberof PokerAlgorithm
     */
    static countByValue(cards) {
        return _.countBy(cards, 'v');
    }
    /**
     * 获取一组牌花色分组卡牌
     * @static
     * @param {Array<PokerCard>} cards
     * @returns {object}
     * @memberof PokerAlgorithm
     */
    static groupByColor(cards) {
        return _.groupBy(cards, 'c');
    }
    /**
     * 获取一组牌牌值分组卡牌
     * @static
     * @param {Array<PokerCard>} cards
     * @returns {object}
     * @memberof PokerAlgorithm
     */
    static groupByValue(cards) {
        return _.groupBy(cards, 'v');
    }
    /**
     * 获取指定数量的相同牌值卡组
     * @static
     * @param {object} group
     * @param {number} count
     * @returns
     * @memberof PokerAlgorithm
     */
    static findSameCardGroups(group, count) {
        const cardGroups = [];
        _.forEach(group, function (v, k) {
            if (v.length == count) {
                cardGroups.push(v);
            }
        });
        return cardGroups;
    }
    static findMaxSameCardGroup(group, count) {
        const cardGroups = [];
        _.forEach(group, function (v, k) {
            if (v.length == count) {
                cardGroups.push(v);
            }
        });
        return _.maxBy(cardGroups, (v) => {
            return v[0].v;
        });
    }
    static findSameCardGroupsEx(group, count) {
        const cardGroups = [];
        _.forEach(group, function (v, k) {
            if (v.length >= count) {
                let cards = v;
                if (v.length > count) {
                    cards = _.slice(v, 0, count);
                }
                cardGroups.push(cards);
            }
        });
        return cardGroups;
    }
    static findSameCardGroupsSmart(group, count) {
        const cardGroups = [];
        _.forEach(group, function (v, k) {
            if (v.length >= count) {
                cardGroups.push(v);
            }
        });
        cardGroups.sort(function (a, b) {
            return a.length - b.length;
        });
        return _.map(cardGroups, function (v) {
            return _.slice(v, 0, count);
        });
    }
    /**
     * 获取一组牌中的最大牌
     * @static
     * @param {Array<PokerCard>} cards
     * @memberof PokerAlgorithm
     */
    static maxCard(cards) {
        return _.maxBy(cards, 'v');
    }
    static sumCardsValue(cards) {
        return _.sumBy(cards, 'v');
    }
    static isSameCardsByIds(cards1, cards2) {
        return _.difference(cards1, cards2).length == 0;
    }
    static comparePointsAndColor(sourceCards, targetCards, compareColor = true) {
        this.sortCardsByValueAndColorDescend(sourceCards);
        this.sortCardsByValueAndColorDescend(targetCards);
        let result = 0;
        _.forEach(sourceCards, function (card, i) {
            if (card.v > targetCards[i].v) {
                result = 1;
                return false;
            }
            else if (card.v < targetCards[i].v) {
                result = -1;
                return false;
            }
        });
        if (result == 0 && compareColor) {
            const maxCard1 = this.maxCard(sourceCards);
            const maxCard2 = this.maxCard(targetCards);
            maxCard1.c > maxCard2.c ? result = 1 : result = -1;
        }
        return result;
    }
    static replaceCardsValue(cards, value, newValue) {
        _.forEach(cards, function (v) {
            if (v.v == value) {
                v.v = newValue;
            }
        });
    }
    static everyCardInRange(cards, range, property = 'v') {
        return _.every(cards, function (v) {
            return _.includes(range, v[property]);
        });
    }
    static filterCardsInRange(cards, range, property = 'v') {
        return _.filter(cards, function (v) {
            return _.includes(range, v[property]);
        });
    }
    /**
   * 判断一组牌是否为顺子
   * @static
   * @param {Array<PokerCard>} cards
   * @returns
   * @memberof PokerAlgorithm
   */
    static isContinuous(cards) {
        if (cards == null || cards.length == 0) {
            return false;
        }
        this.sortCardsByValue(cards);
        var len = cards.length;
        var i = 0;
        var s = 0;
        for (i = 0; i < len - 1; i++) {
            if (cards[i].v == 0) {
                s++;
                continue;
            }
            if (cards[i + 1].v == cards[i].v) {
                return false;
            }
            if (cards[i + 1].v - cards[i].v == 1) {
                continue;
            }
            if (cards[i + 1].v - cards[i].v - 1 <= s) {
                s--;
                continue;
            }
            if (cards[i + 1].v - cards[i].v - 1 > s) {
                return false;
            }
        }
        if (s < 0) {
            return false;
        }
        return true;
    }
    // 重构版优化算法
    static isSameCards(cards, count) {
        return cards.length == count && _.uniqBy(cards, 'v').length == 1;
    }
    static findSameCards(cards, count) {
        const group = this.groupByValue(cards);
        return this.findSameCardGroupsSmart(group, count);
    }
    static findSameCardsExact(cards, count) {
        const group = this.groupByValue(cards);
        return this.findSameCardGroups(group, count);
    }
    static isSameColorCards(cards, count = -1) {
        return (cards.length == length || length == -1) && _.uniqBy(cards, 'c').length == 1;
    }
    static findSameColorCards(cards, count) {
        if (cards.length < count)
            return [];
        const group = this.groupByColor(cards);
        const results = [];
        _.forEach(group, function (v) {
            if (v.length >= count) {
                results.push(Combinatorics.combination(v, count).toArray());
            }
        });
        return _.flatten(results);
    }
    static isDanShun(cards, length, range) {
        if (range != undefined && range.length > 0) {
            cards = this.filterCardsInRange(cards, range);
        }
        return (cards.length == length || length == -1) && this.isContinuous(cards);
    }
    static findDanShun(cards, length, range) {
        if (range != undefined && range.length > 0) {
            cards = this.filterCardsInRange(cards, range);
        }
        let results = [];
        const uniqCards = _.uniqBy(cards, 'v');
        if (uniqCards.length < length) {
            return results;
        }
        const filterArray = this.filterDanShunArray(uniqCards, length);
        if (filterArray.length == 0) {
            return results;
        }
        const shunzi = [];
        _.forEach(filterArray, function (v) {
            shunzi.push(Combinatorics.combination(v, length).filter(function (a) {
                return PokerAlgo.isContinuous(a);
            }));
        });
        if (shunzi.length != 0) {
            results = _.flatten(shunzi);
        }
        return results;
    }
    static findDanShunNoLimit(cards, length, range) {
        if (range != undefined && range.length > 0) {
            cards = this.filterCardsInRange(cards, range);
        }
        let results = [];
        const uniqCards = _.uniqBy(cards, 'v');
        if (uniqCards.length < length) {
            return results;
        }
        const filterArray = this.filterDanShunArray(uniqCards, length);
        return filterArray;
    }
    static findDuoShunNoLimit(cards, length, count, range) {
        if (range != undefined && range.length > 0) {
            cards = this.filterCardsInRange(cards, range);
        }
        if (cards.length < length) {
            return [];
        }
        const group = this.groupByValue(cards);
        const cardGroups = this.findSameCardGroupsEx(group, count);
        if (cardGroups.length < length / count) {
            return [];
        }
        const flattenCardGroup = _.flatten(cardGroups);
        const uniqCards = _.uniqBy(flattenCardGroup, 'v');
        let filterArray = this.filterDanShunArray(uniqCards, length / count);
        filterArray = _.map(filterArray, function (v, i) {
            return PokerAlgo.filterCardsInRange(flattenCardGroup, _.map(v, 'v'), 'v');
        });
        return filterArray;
    }
    static filterDanShunArray(cards, length) {
        if (cards == null || cards.length < 2) {
            return [];
        }
        this.sortCardsByValue(cards);
        let results = [], temp = [], difference;
        for (let i = 0; i < cards.length; i += 1) {
            if (difference !== (cards[i].v - i)) {
                if (difference !== undefined) {
                    results.push(temp);
                    temp = [];
                }
                difference = cards[i].v - i;
            }
            temp.push(cards[i]);
        }
        if (temp.length) {
            results.push(temp);
        }
        results = _.filter(results, (v) => { return v.length >= length; });
        return results;
    }
    static isTongHuaShun(cards, length = -1, range) {
        if (range != undefined && range.length > 0) {
            cards = this.filterCardsInRange(cards, range);
        }
        return this.isDanShun(cards, length) && _.uniqBy(cards, 'c').length == 1;
    }
    static findTongHuaShun(cards, length = -1, range) {
        if (range != undefined && range.length > 0) {
            cards = this.filterCardsInRange(cards, range);
        }
        let filterCons = Combinatorics.combination(cards, length).filter(function (a) {
            return PokerAlgo.isContinuous(a);
        });
        return filterCons.filter(function (shunzi) { return _.every(shunzi, function (v) { return v.c == shunzi[0].c; }); });
    }
    static isDuoShun(cards, length, count, range) {
        let result = false;
        if (range != undefined && range.length > 0) {
            cards = this.filterCardsInRange(cards, range);
        }
        if (cards.length >= length) {
            const group = this.groupByValue(cards);
            const groupArray = this.findSameCardGroups(group, count);
            if (groupArray.length == cards.length / count) {
                const uniqCards = _.uniqBy(cards, 'v');
                result = this.isContinuous(uniqCards);
            }
        }
        return result;
    }
    static findDuoShun(cards, length, count, range) {
        if (range != undefined && range.length > 0) {
            cards = this.filterCardsInRange(cards, range);
        }
        if (cards.length < length) {
            return [];
        }
        const group = this.groupByValue(cards);
        const cardGroups = this.findSameCardGroupsEx(group, count);
        if (cardGroups.length < length / count) {
            return [];
        }
        const combs = Combinatorics.combination(cardGroups, length / count).filter(function (a) {
            let cards = _.flatMap(a, function (v) {
                return v[0];
            });
            return PokerAlgo.isContinuous(cards);
        });
        return _.map(combs, function (v) {
            return _.flatten(v);
        });
    }
    static isKingBomb(cards, xiaowang, xiaowangCount, dawangCount) {
        let result = false;
        if (_.every(cards, (v) => { return v.v == xiaowang || v.v == xiaowang + 1; })) {
            const countObj = this.countByValue(cards);
            if ((xiaowangCount == 0 || countObj[xiaowang + ''] == xiaowangCount) && (dawangCount == 0 || countObj[xiaowang + 1 + ''] == dawangCount)) {
                result = true;
            }
        }
        return result;
    }
    static findKingBomb(cards, xiaowang, xiaowangCount, dawangCount) {
        const xiaowangCards = [];
        const dawangCards = [];
        _.forEach(cards, (v) => {
            if (v.v == xiaowang) {
                xiaowangCards.push(v);
            }
            else if (v.v == xiaowang + 1) {
                dawangCards.push(v);
            }
        });
        if (xiaowangCards.length >= xiaowangCount && dawangCards.length >= dawangCount) {
            return [_.concat(_.slice(xiaowangCards, 0, xiaowangCount), _.slice(dawangCards, 0, dawangCount))];
        }
        return [];
    }
    static isCombs(cards, combFunc1, combFunc2) {
        return PokerAlgo.findCombs(cards, combFunc1, combFunc2).length == 1;
    }
    static findCombs(cards, combFunc1, combFunc2) {
        const results = [];
        const cardGroups = combFunc1(cards);
        if (cardGroups.length == 0) {
            return results;
        }
        const subCardGroups = combFunc2(cards);
        if (subCardGroups.length == 0) {
            return results;
        }
        _.forEach(cardGroups, function (v) {
            _.forEach(subCardGroups, function (v1) {
                const flattenV = _.flattenDeep(v);
                const flattenV1 = _.flattenDeep(v1);
                if (_.intersection(flattenV, flattenV1).length == 0) {
                    results.push([v, v1]);
                }
            });
        });
        return results;
    }
    static isDuoShunCombs(cards, length, count, sameCount, range) {
        return this.findDuoShunCombs(cards, length, count, sameCount, range).length > 0;
    }
    static findDuoShunCombs(cards, length, count, sameCount, range) {
        return this.findDuoShunCombsTemplate(cards, length, count, sameCount, range, this.findSameCardGroupsSmart);
    }
    static findDuoShunCombsTemplate(cards, length, count, sameCount, range, func) {
        length = length / (count + sameCount);
        if (!_.isInteger(length))
            return [];
        const shunzi = this.findDuoShun(cards, length * count, count, range);
        if (shunzi.length == 0) {
            return [];
        }
        const remainCards = this.getOtherCards(cards, shunzi);
        let cardGroups = [];
        if (sameCount == 1) {
            cardGroups = _.map(remainCards, function (v) { return [v]; });
        }
        else {
            const group = this.groupByValue(remainCards);
            cardGroups = func(group, sameCount);
        }
        if (cardGroups.length < length) {
            return [];
        }
        const combs = length;
        let results = Combinatorics.cartesianProduct(shunzi, _.map(Combinatorics.combination(cardGroups, combs).toArray(), _.flatten)).toArray();
        return results;
    }
    static isCombination(cards, count, combs) {
        const group = this.groupByValue(cards);
        const groupArray = this.findSameCardGroupsEx(group, count);
        return groupArray.length >= combs;
    }
    static findCombination(cards, count, combs) {
        return this.findCombinationTemplate(cards, count, combs, this.findSameCardGroupsSmart);
    }
    static findCombinationTemplate(cards, count, combs, func) {
        if (cards.length < count * combs)
            return [];
        let groupArray = [];
        if (count == 1) {
            groupArray = _.map(cards, (v) => [v]);
        }
        else {
            const group = this.groupByValue(cards);
            groupArray = func(group, count);
        }
        if (groupArray.length < combs)
            return [];
        return Combinatorics.combination(groupArray, combs).toArray();
    }
    static sortCardGroups(cards, order = 1) {
        let orderFunc;
        if (order == 1) {
            orderFunc = function (a, b) {
                return a.v - b.v;
            };
        }
        else {
            orderFunc = function (a, b) {
                return b.v - a.v;
            };
        }
        cards.sort(function (a, b) {
            let a1 = a;
            let b1 = b;
            if (_.isArray(a1[0]) && _.isArray(b1[0])) {
                a1 = _.flattenDeep(a1[0]);
                b1 = _.flattenDeep(b1[0]);
            }
            return orderFunc(_.maxBy(a1, 'v'), _.maxBy(b1, 'v'));
        });
    }
}
exports.PokerAlgo = PokerAlgo;
