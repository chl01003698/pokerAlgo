"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _;
if (global['window'] != null) {
}
else {
    _ = require('lodash');
}
const diZhuAlgo_1 = require("./diZhuAlgo");
const pokerAlgo_1 = require("../pokerAlgo");
var DiZhuCardType;
(function (DiZhuCardType) {
    DiZhuCardType[DiZhuCardType["DAN_TIAO"] = 0] = "DAN_TIAO";
    DiZhuCardType[DiZhuCardType["DUI_ZI"] = 1] = "DUI_ZI";
    DiZhuCardType[DiZhuCardType["SAN_TIAO"] = 2] = "SAN_TIAO";
    DiZhuCardType[DiZhuCardType["SAN_DAI_YI"] = 3] = "SAN_DAI_YI";
    DiZhuCardType[DiZhuCardType["SAN_DAI_ER"] = 4] = "SAN_DAI_ER";
    DiZhuCardType[DiZhuCardType["DAN_SHUN_ZI"] = 5] = "DAN_SHUN_ZI";
    DiZhuCardType[DiZhuCardType["SHUANG_SHUN_ZI"] = 6] = "SHUANG_SHUN_ZI";
    DiZhuCardType[DiZhuCardType["SAN_SHUN_ZI"] = 7] = "SAN_SHUN_ZI";
    DiZhuCardType[DiZhuCardType["FEI_JI_DAI_CHI_BANG_YI"] = 8] = "FEI_JI_DAI_CHI_BANG_YI";
    DiZhuCardType[DiZhuCardType["FEI_JI_DAI_CHI_BANG_ER"] = 9] = "FEI_JI_DAI_CHI_BANG_ER";
    DiZhuCardType[DiZhuCardType["SI_DAI_ER_GE_YI"] = 10] = "SI_DAI_ER_GE_YI";
    DiZhuCardType[DiZhuCardType["SI_DAI_ER_GE_ER"] = 11] = "SI_DAI_ER_GE_ER";
    DiZhuCardType[DiZhuCardType["ZHA_DAN"] = 12] = "ZHA_DAN";
    DiZhuCardType[DiZhuCardType["WANG_ZHA"] = 13] = "WANG_ZHA";
})(DiZhuCardType || (DiZhuCardType = {}));
class SanRenDiZhuAlgo extends diZhuAlgo_1.DiZhuAlgo {
}
SanRenDiZhuAlgo.DiZhuCardType = DiZhuCardType;
SanRenDiZhuAlgo.RobotInputTypes = [
    DiZhuCardType.DAN_SHUN_ZI,
    DiZhuCardType.SHUANG_SHUN_ZI,
    DiZhuCardType.FEI_JI_DAI_CHI_BANG_YI,
    DiZhuCardType.FEI_JI_DAI_CHI_BANG_ER,
    DiZhuCardType.SAN_SHUN_ZI,
    DiZhuCardType.SAN_DAI_YI,
    DiZhuCardType.SAN_DAI_ER,
    DiZhuCardType.DAN_TIAO,
    DiZhuCardType.DUI_ZI,
    DiZhuCardType.SAN_TIAO,
    DiZhuCardType.SI_DAI_ER_GE_YI,
    DiZhuCardType.SI_DAI_ER_GE_ER,
    DiZhuCardType.ZHA_DAN,
    DiZhuCardType.WANG_ZHA,
];
SanRenDiZhuAlgo.cardTypeFuncs = [
    { type: DiZhuCardType.DAN_TIAO,
        func: _.curry(pokerAlgo_1.PokerAlgo.isSameCards)(_, 1),
        findFunc: _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 1),
        exactFindFunc: _.curry(pokerAlgo_1.PokerAlgo.findSameCardsExact)(_, 1),
        weight: 1, length: 1, strict: true },
    { type: DiZhuCardType.DUI_ZI,
        func: _.curry(pokerAlgo_1.PokerAlgo.isSameCards)(_, 2),
        findFunc: _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 2),
        exactFindFunc: _.curry(pokerAlgo_1.PokerAlgo.findSameCardsExact)(_, 2),
        weight: 1, length: 2, strict: true },
    { type: DiZhuCardType.SAN_TIAO,
        func: _.curry(pokerAlgo_1.PokerAlgo.isSameCards)(_, 3),
        findFunc: _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 3),
        exactFindFunc: _.curry(pokerAlgo_1.PokerAlgo.findSameCardsExact)(_, 3),
        weight: 1, length: 3, strict: true },
    { type: DiZhuCardType.SAN_DAI_YI,
        func: _.curry(pokerAlgo_1.PokerAlgo.isCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 3), _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 1)),
        findFunc: _.curry(pokerAlgo_1.PokerAlgo.findCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 3), _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 1)),
        exactFindFunc: _.curry(pokerAlgo_1.PokerAlgo.findCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCardsExact)(_, 3), _.curry(pokerAlgo_1.PokerAlgo.findSameCardsExact)(_, 1)),
        weight: 1, length: 4, strict: true },
    { type: DiZhuCardType.SAN_DAI_ER,
        func: _.curry(pokerAlgo_1.PokerAlgo.isCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 3), _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 2)),
        findFunc: _.curry(pokerAlgo_1.PokerAlgo.findCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 3), _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 2)),
        exactFindFunc: _.curry(pokerAlgo_1.PokerAlgo.findCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCardsExact)(_, 3), _.curry(pokerAlgo_1.PokerAlgo.findSameCardsExact)(_, 2)),
        weight: 1, length: 5, strict: true },
    { type: DiZhuCardType.DAN_SHUN_ZI,
        func: _.curryRight(pokerAlgo_1.PokerAlgo.isDanShun)(_.range(3, 15)),
        findFunc: _.curryRight(pokerAlgo_1.PokerAlgo.findDanShun)(_.range(3, 15)),
        exactFindFunc: _.curryRight(pokerAlgo_1.PokerAlgo.findDanShunNoLimit)(5, _.range(3, 15)),
        weight: 1, length: 5, strict: false },
    { type: DiZhuCardType.SHUANG_SHUN_ZI,
        func: _.curryRight(pokerAlgo_1.PokerAlgo.isDuoShun)(2, _.range(3, 15)),
        findFunc: _.curryRight(pokerAlgo_1.PokerAlgo.findDuoShun)(2, _.range(3, 15)),
        exactFindFunc: _.curryRight(pokerAlgo_1.PokerAlgo.findDuoShunNoLimit)(6, 2, _.range(3, 15)),
        weight: 1, length: 6, strict: false },
    { type: DiZhuCardType.SAN_SHUN_ZI,
        func: _.curryRight(pokerAlgo_1.PokerAlgo.isDuoShun)(3, _.range(3, 15)),
        findFunc: _.curryRight(pokerAlgo_1.PokerAlgo.findDuoShun)(3, _.range(3, 15)),
        exactFindFunc: _.curryRight(pokerAlgo_1.PokerAlgo.findDuoShunNoLimit)(6, 3, _.range(3, 15)),
        weight: 1, length: 6, strict: false },
    { type: DiZhuCardType.FEI_JI_DAI_CHI_BANG_YI,
        func: _.curryRight(diZhuAlgo_1.DiZhuAlgo.isDuoShunCombs)(3, 1, _.range(3, 15)),
        findFunc: _.curryRight(diZhuAlgo_1.DiZhuAlgo.findDuoShunCombs)(3, 1, _.range(3, 15)),
        exactFindFunc: _.curryRight(diZhuAlgo_1.DiZhuAlgo.findDuoShunCombsTemplate)(8, 3, 1, _.range(3, 15), pokerAlgo_1.PokerAlgo.findSameCardGroups),
        weight: 1, length: 8, strict: false },
    { type: DiZhuCardType.FEI_JI_DAI_CHI_BANG_ER,
        func: _.curryRight(diZhuAlgo_1.DiZhuAlgo.isDuoShunCombs)(3, 2, _.range(3, 15)),
        findFunc: _.curryRight(diZhuAlgo_1.DiZhuAlgo.findDuoShunCombs)(3, 2, _.range(3, 15)),
        exactFindFunc: _.curryRight(diZhuAlgo_1.DiZhuAlgo.findDuoShunCombsTemplate)(10, 3, 2, _.range(3, 15), pokerAlgo_1.PokerAlgo.findSameCardGroups),
        weight: 1, length: 10, strict: false },
    { type: DiZhuCardType.SI_DAI_ER_GE_YI,
        func: _.curry(pokerAlgo_1.PokerAlgo.isCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 4), _.curry(pokerAlgo_1.PokerAlgo.findCombination)(_, 1, 2)),
        findFunc: _.curry(pokerAlgo_1.PokerAlgo.findCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 4), _.curry(pokerAlgo_1.PokerAlgo.findCombination)(_, 1, 2)),
        exactFindFunc: _.curry(pokerAlgo_1.PokerAlgo.findCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCardsExact)(_, 4), _.curry(pokerAlgo_1.PokerAlgo.findCombinationTemplate)(_, 1, 2, pokerAlgo_1.PokerAlgo.findSameCardGroups)),
        weight: 1, length: 6, strict: true },
    { type: DiZhuCardType.SI_DAI_ER_GE_ER,
        func: _.curry(pokerAlgo_1.PokerAlgo.isCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 4), _.curry(pokerAlgo_1.PokerAlgo.findCombination)(_, 2, 2)),
        findFunc: _.curry(pokerAlgo_1.PokerAlgo.findCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 4), _.curry(pokerAlgo_1.PokerAlgo.findCombination)(_, 2, 2)),
        exactFindFunc: _.curry(pokerAlgo_1.PokerAlgo.findCombs)(_, _.curry(pokerAlgo_1.PokerAlgo.findSameCardsExact)(_, 4), _.curry(pokerAlgo_1.PokerAlgo.findCombinationTemplate)(_, 2, 2, pokerAlgo_1.PokerAlgo.findSameCardGroups)),
        weight: 1, length: 8, strict: true },
    { type: DiZhuCardType.ZHA_DAN,
        func: _.curry(pokerAlgo_1.PokerAlgo.isSameCards)(_, 4),
        findFunc: _.curry(pokerAlgo_1.PokerAlgo.findSameCards)(_, 4),
        exactFindFunc: _.curry(pokerAlgo_1.PokerAlgo.findSameCardsExact)(_, 4),
        weight: 2, length: 4, strict: true },
    { type: DiZhuCardType.WANG_ZHA,
        func: _.curry(pokerAlgo_1.PokerAlgo.isKingBomb)(_, 16, 1, 1),
        findFunc: _.curry(pokerAlgo_1.PokerAlgo.findKingBomb)(_, 16, 1, 1),
        exactFindFunc: _.curry(pokerAlgo_1.PokerAlgo.findKingBomb)(_, 16, 1, 1),
        weight: 3, length: 2, strict: true }
];
exports.SanRenDiZhuAlgo = SanRenDiZhuAlgo;
