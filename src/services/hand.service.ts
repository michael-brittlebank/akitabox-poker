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
        const sortedCards: ICardInterface[] = reverse(sortBy(cards, 'rank'));
        console.warn('sorted', sortedCards);
        return ['High Card (', UtilsService.capitalize(ERankConstant[sortedCards[0].rank]), ')'].join('');
    }
}