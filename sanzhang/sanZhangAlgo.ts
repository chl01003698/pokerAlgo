import { PokerAlgo, PokerCardGroup, PokerCard } from '../pokerAlgo';
let _, Combinatorics

if (global['window'] != null) {

} else {
  _ = require('lodash')
  Combinatorics = require('js-combinatorics')
}

export enum SanZhangCardType {
  DAN_TIAO = 0,
  DUI_ZI,
  SHUN_ZI,
  TONG_HUA,
  TONG_HUA_SHUN,
  SAN_TIAO
}

export enum SanZhangPaiCaiType {
  NONE = -1,
  AAA,
  SAN_TIAO,
  TONG_HUA_SHUN
}

export class SanZhangAlgo extends PokerAlgo {
  static paiCaiBonus = [20, 10, 5]
  static cardTypeFuncs = [
    { type: SanZhangCardType.DAN_TIAO, func: SanZhangAlgo.isDanTiao, weight: 1 },
    { type: SanZhangCardType.DUI_ZI, func: SanZhangAlgo.isDuiZi, weight: 2 },
    { type: SanZhangCardType.SHUN_ZI, func: SanZhangAlgo.isDanShunZi, weight: 3 },
    { type: SanZhangCardType.TONG_HUA, func: SanZhangAlgo.isTongHua, weight: 4 },
    { type: SanZhangCardType.TONG_HUA_SHUN, func: SanZhangAlgo.isTongHuaShun, weight: 5 },
    { type: SanZhangCardType.SAN_TIAO, func: SanZhangAlgo.isSanTiao, weight: 6 }
  ]

  static cardTypeFuncs1 = [
    { type: SanZhangCardType.DAN_TIAO, func: SanZhangAlgo.isDanTiao, weight: 1 },
    { type: SanZhangCardType.DUI_ZI, func: SanZhangAlgo.isDuiZi, weight: 2 },
    { type: SanZhangCardType.TONG_HUA, func: SanZhangAlgo.isTongHua, weight: 3 },
    { type: SanZhangCardType.SHUN_ZI, func: SanZhangAlgo.isDanShunZi, weight: 4 },
    { type: SanZhangCardType.TONG_HUA_SHUN, func: SanZhangAlgo.isTongHuaShun, weight: 5 },
    { type: SanZhangCardType.SAN_TIAO, func: SanZhangAlgo.isSanTiao, weight: 6 }
  ]

  static specialFuncs1 = [
    { type: "235", testFunc: SanZhangAlgo.testTwoThreeFiveFunc, func: SanZhangAlgo.twoThreeFiveFunc }
  ]

  static specialFuncs = []

  static testTwoThreeFiveFunc(sourceGroup: PokerCardGroup, beatGroup: PokerCardGroup): boolean {
    return PokerAlgo.isCardsEqualByValue(beatGroup.cards, [2, 3, 5]) && _.uniqBy(beatGroup.cards, 'c').length == beatGroup.cards.length && sourceGroup.typeObject['type'] == SanZhangCardType.SAN_TIAO
  }

  static twoThreeFiveFunc(sourceGroup: PokerCardGroup, beatGroup: PokerCardGroup): number {
    if (SanZhangAlgo.testTwoThreeFiveFunc(sourceGroup, beatGroup)) {
      return 1
    } else {
      return -1
    }
  }

  static testOneTwoThree(group1: PokerCardGroup, group2: PokerCardGroup): boolean {
    return PokerAlgo.isCardsEqualByValue(group1.cards, [2, 3, 14]) && PokerAlgo.isCardsEqualByValue(group2.cards, [2, 3, 4])
  }

  static getLzCards(cards: any) {
    let num = Math.ceil(Math.random() * (cards.length - 3));
    return [cards[num]];
  }
  static getPlayerCards(cards: any, LzCard: any) {
    let tmpCards: Array<any> = [];
    let str = LzCard.substr(2);
    let card = "";
    let tmpCard = "";
    let tmpColor = "";
    for (let i = 0; i < cards.length; i++) {
      card = cards[i];
      tmpCard = card.substr(2);
      tmpColor = card[0];
      if (tmpCard == str) {
        card = card + "." + tmpColor + "." + tmpCard //0.2.0.2
        tmpCards.push(card);
        continue;
      }
      tmpCards.push(card);
    }
    return tmpCards;
  }

  static oneTwoThreeFunc(sourceGroup: PokerCardGroup, beatGroup: PokerCardGroup, shunzida: boolean): number {
    PokerAlgo.replaceCardsValue(sourceGroup.cards, 14, 1)
    PokerAlgo.replaceCardsValue(beatGroup.cards, 14, 1)
    const result = SanZhangAlgo.beatTemplate(sourceGroup, beatGroup, shunzida)
    PokerAlgo.replaceCardsValue(sourceGroup.cards, 1, 14)
    PokerAlgo.replaceCardsValue(beatGroup.cards, 1, 14)
    return result
  }

  static beat(sourceCards: Array<PokerCard> | PokerCardGroup, targetCards: Array<PokerCard> | PokerCardGroup, shunzida: boolean, ersanwu: boolean): number {
    let sourceGroup: undefined | PokerCardGroup = undefined
    let targetGroup: undefined | PokerCardGroup = undefined
    if (_.isArray(sourceCards)) {
      if (PokerAlgo.isCardsEqualByValue(sourceCards as Array<PokerCard>, [2, 3, 14])) {
        PokerAlgo.replaceCardsValue(sourceCards as Array<PokerCard>, 14, 1)
      }
      sourceGroup = SanZhangAlgo.createCardGroup(sourceCards as Array<PokerCard>, shunzida)
    } else {
      sourceGroup = sourceCards as PokerCardGroup
    }

    if (_.isArray(targetCards)) {
      if (PokerAlgo.isCardsEqualByValue(targetCards as Array<PokerCard>, [2, 3, 14])) {
        PokerAlgo.replaceCardsValue(targetCards as Array<PokerCard>, 14, 1)
      }
      targetGroup = SanZhangAlgo.createCardGroup(targetCards as Array<PokerCard>, shunzida)
    } else {
      targetGroup = targetCards as PokerCardGroup
    }

    let result = 0
    let specialFuncs: any = undefined
    if (ersanwu) {
      specialFuncs = SanZhangAlgo.specialFuncs1
    } else {
      specialFuncs = SanZhangAlgo.specialFuncs
    }
    _.forEach(specialFuncs, function (v, i) {
      if (v.testFunc(sourceGroup, targetGroup) || v.testFunc(targetGroup, sourceGroup)) {
        result = v.func(sourceGroup, targetGroup, shunzida)
        return false
      }
    })
    if (result == 0) {
      result = SanZhangAlgo.beatTemplate(sourceGroup, targetGroup, shunzida)
    }

    if (_.isArray(sourceCards) && PokerAlgo.isCardsEqualByValue(sourceCards as Array<PokerCard>, [1, 2, 3])) {
      PokerAlgo.replaceCardsValue(sourceCards as Array<PokerCard>, 1, 14)
    }

    if (_.isArray(targetCards) && PokerAlgo.isCardsEqualByValue(targetCards as Array<PokerCard>, [1, 2, 3])) {
      PokerAlgo.replaceCardsValue(targetCards as Array<PokerCard>, 1, 14)
    }

    return result
  }

  static beatTemplate(sourceCards: Array<PokerCard> | PokerCardGroup, targetCards: Array<PokerCard> | PokerCardGroup, shunzida: boolean): number {
    let sourceGroup: any = undefined
    let targetGroup: any = undefined
    if (_.isArray(sourceCards)) {
      sourceGroup = SanZhangAlgo.createCardGroup(sourceCards as Array<PokerCard>, shunzida)
    } else {
      sourceGroup = sourceCards as PokerCardGroup
    }

    if (_.isArray(targetCards)) {
      targetGroup = SanZhangAlgo.createCardGroup(targetCards as Array<PokerCard>, shunzida)
    } else {
      targetGroup = targetCards as PokerCardGroup
    }
    let result = 0
    if (sourceGroup != undefined && targetGroup != undefined) {
      if (sourceGroup.typeObject.weight > targetGroup.typeObject.weight) {
        result = 1
      } else if (sourceGroup.typeObject.weight < targetGroup.typeObject.weight) {
        result = -1
      } else if (targetGroup.typeObject.weight == sourceGroup.typeObject.weight && targetGroup.typeObject.type == sourceGroup.typeObject.type) {
        if (sourceGroup.typeObject.type == SanZhangCardType.DUI_ZI) {
          const scardsGroup = SanZhangAlgo.getDuiZiAndSanPai(sourceGroup.cards)
          const tcardsGroup = SanZhangAlgo.getDuiZiAndSanPai(targetGroup.cards)

          result = SanZhangAlgo.comparePointsAndColor(scardsGroup[0], tcardsGroup[0], false)
          if (result == 0) {
            result = SanZhangAlgo.comparePointsAndColor(scardsGroup[1], tcardsGroup[1], false)
          }
        } else {
          result = SanZhangAlgo.comparePointsAndColor(sourceGroup.cards, targetGroup.cards, false)
        }
      }
    }
    return result
  }

  static getDuiZiAndSanPai(cards: Array<PokerCard>) {
    const group = PokerAlgo.groupByValue(cards)
    let duizi = []
    let sanpai = []
    _.forEach(group, function (v, k) {
      if (v.length == 2) {
        duizi = v
      } else if (v.length == 1) {
        sanpai = v
      }
    })
    return [duizi, sanpai]
  }

  static createCardGroup(cards: Array<PokerCard>, shunzida: boolean): PokerCardGroup {
    let cardGroup: any = undefined
    let cardTypeFuncs: any = undefined
    if (shunzida) {
      cardTypeFuncs = SanZhangAlgo.cardTypeFuncs1
    } else {
      cardTypeFuncs = SanZhangAlgo.cardTypeFuncs
    }
    _.forEachRight(cardTypeFuncs, (v) => {
      const result = v.func(cards)
      if (result == true) {
        cardGroup = new PokerCardGroup(v, cards)
        return false
      }
    })
    return cardGroup
  }

  static getCardsType(cards: Array<PokerCard>): SanZhangCardType {
    let type = -1
    _.forEachRight(SanZhangAlgo.cardTypeFuncs, (v, i) => {
      const result = v.func(cards)
      if (result == true) {
        type = i
        return false
      }
    })
    return type
  }

  static isDanTiao(cards: Array<PokerCard>): boolean {
    return true
  }

  static isDuiZi(cards: Array<PokerCard>): boolean {
    if (cards.length > 2) return _.uniqBy(cards, 'v').length == 2
    let arr: Array<PokerAlgo> = [];
    let c: any = 0;
    for (let i = 0; i < cards.length; i++) {
      if (c == cards[i].v) return true;
      c = cards[i].v;
    }
    return false;
  }

  static isDanShunZi(cards: Array<PokerCard>): boolean {
    return PokerAlgo.isContinuous(cards)
  }

  static isSanTiao(cards: Array<PokerCard>): boolean {
    return _.uniqBy(cards, 'v').length == 1
  }

  static isTongHua(cards: Array<PokerCard>): boolean {
    return _.uniqBy(cards, 'c').length == 1
  }

  static isTongHuaShun(cards: Array<PokerCard>): boolean {
    return PokerAlgo.isContinuous(cards) && _.uniqBy(cards, 'c').length == 1
  }

  static getPaiCaiResult(cards: Array<PokerCard>): [number, number] {
    let type = -1
    let multiple = 0
    let isSanTiao = SanZhangAlgo.isSanTiao(cards)
    if (isSanTiao && cards[0].v == 14) {
      type = SanZhangPaiCaiType.AAA
      multiple = 20
    } else if (isSanTiao) {
      type = SanZhangPaiCaiType.SAN_TIAO
      multiple = 10
    } else if (SanZhangAlgo.isTongHuaShun(cards)) {
      type = SanZhangPaiCaiType.TONG_HUA_SHUN
      multiple = 5
    }
    return [type, multiple]
  }
}
