import { ICardInterface } from '../interfaces/types/card.interface';
import { map, filter, sortBy, reverse } from 'lodash';
import { ESuiteConstant } from '../constants/suite.constant';
import { ERankConstant } from '../constants/rank.constant';
import { UtilsService } from './utils.service';

export class HandService {

    public static parseHandIntoCards(hand: string): ICardInterface[] {
        // separate hand string into stringified card array
        const stringCards: string[] = hand.split(' ');
        return filter(
            // filter out malformed cardstrings
            map(stringCards, (stringCard: string) => {
                if (stringCard.length >=2 || stringCard.length <=3) {
                    const rawRank: string = stringCard.slice(0, stringCard.length - 1);
                    const rawSuite: string = stringCard.slice(-1); // get last character in case of 2 character ranks
                    // parse rank
                    let parsedRank: ERankConstant;
                    switch (rawRank.toLowerCase()) {
                        case '2':
                            parsedRank = ERankConstant.TWO;
                            break;
                        case '3':
                            parsedRank = ERankConstant.THREE;
                            break;
                        case '4':
                            parsedRank = ERankConstant.FOUR;
                            break;
                        case '5':
                            parsedRank = ERankConstant.FIVE;
                            break;
                        case '6':
                            parsedRank = ERankConstant.SIX;
                            break;
                        case '7':
                            parsedRank = ERankConstant.SEVEN;
                            break;
                        case '8':
                            parsedRank = ERankConstant.EIGHT;
                            break;
                        case '9':
                            parsedRank = ERankConstant.NINE;
                            break;
                        case '10':
                            parsedRank = ERankConstant.TEN;
                            break;
                        case 'j':
                            parsedRank = ERankConstant.JACK;
                            break;
                        case 'q':
                            parsedRank = ERankConstant.QUEEN;
                            break;
                        case 'k':
                            parsedRank = ERankConstant.KING;
                            break;
                        case 'a':
                            parsedRank = ERankConstant.ACE;
                            break;
                        default:
                            console.warn('could not identify ' + rawRank);
                            return undefined;
                    }
                    // parse suite
                    let parsedSuite: ESuiteConstant;
                    switch (rawSuite.toLowerCase()) {
                        case 'c':
                            parsedSuite = ESuiteConstant.CLUBS;
                            break;
                        case 'd':
                            parsedSuite = ESuiteConstant.DIAMONDS;
                            break;
                        case 'h':
                            parsedSuite = ESuiteConstant.HEARTS;
                            break;
                        case 's':
                            parsedSuite = ESuiteConstant.SPADES;
                            break;
                        default:
                            console.warn('could not identify ' + rawSuite);
                            return undefined;
                    }
                    return {
                        suite: parsedSuite,
                        rank: parsedRank
                    }
                } else {
                    // undefined values are removed by the filter wrapper
                    return undefined;
                }
            })
        );
    }

    public static calculateHandRank(cards: ICardInterface[]): string {
        if (cards.length === 5) {
            const sortedCards: ICardInterface[] = reverse(sortBy(cards, 'rank'));
            console.warn('sorted', sortedCards);
            let i: number;
            let isRoyal: boolean = true;
            let isFlush: boolean = true;
            let isStraight: boolean = true;
            const initialSuite: ESuiteConstant = sortedCards[0].suite; // set initial suite
            let previousValue: ERankConstant = sortedCards[0].rank;
            const royalRanks: ERankConstant[] = [ERankConstant.ACE, ERankConstant.KING, ERankConstant.QUEEN, ERankConstant.JACK, ERankConstant.TEN];
            // check if flush
            for (i = 1; i < sortedCards.length; i++) {
                // start at 1 since initial suite is from 0 element
                if (sortedCards[i].suite !== initialSuite) {
                    isFlush = false;
                    break;
                }
            }
            // check if straight
            for (i = 1; i < sortedCards.length; i++) {
                // start at 1 since initial rank is from 0 element
                if (sortedCards[i].rank !== (previousValue - 1)) {
                    isStraight = false;
                    break;
                } else {
                    previousValue = sortedCards[i].rank;
                }
            }
            if (isStraight && isFlush) {
                // check if royal
                for (i = 0; i < sortedCards.length; i++) {
                    if (royalRanks[i] !== sortedCards[i].rank) {
                        isRoyal = false;
                        break;
                    }
                }
                if (isRoyal) {
                    // royal flush
                    return ['Royal Flush (', UtilsService.capitalize(ESuiteConstant[sortedCards[0].suite]), ')'].join('');
                } else {
                    // straight flush
                    return ['Straight Flush (', UtilsService.capitalize(ESuiteConstant[sortedCards[0].suite]), ')'].join('');
                }
            } else if (isFlush) {
                // flush
                return ['Flush (', UtilsService.capitalize(ESuiteConstant[sortedCards[0].suite]), ')'].join('');
            } else if (isStraight) {
                // straight
                return 'Straight';
            } else {
                // four of a kind
                // three of a king
                // full house
                // two pair
                // pair
                // high card
                return ['High Card (', UtilsService.capitalize(ERankConstant[sortedCards[0].rank]), ')'].join('');
            }
        } else {
            return 'Invalid hand supplied';
        }
    }
}