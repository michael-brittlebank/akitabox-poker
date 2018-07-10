import * as React from 'react';
import './App.css';
import logo from './logo.svg';
import { HandService } from './services/hand.service';
import { ICardInterface } from './interfaces/types/card.interface';

interface IState {
    currentHand: string;
    inputError: boolean;
    handRank: string;
}

class App extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentHand: 'Kh Kc 3s 3h 2d', // todo, remove after testing
            inputError: false,
            handRank: ''
        };
        this._onHandChange = this._onHandChange.bind(this);
        this._submitHandRank = this._submitHandRank.bind(this);
    }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">AkitaBox - Poker Hand Evaluation</h1>
                </header>
                <main className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-sm-12 col-md-8 col-lg-6">
                            <form className="p-3" onSubmit={this._submitHandRank}>
                                <div className="form-group">
                                    <label htmlFor="search-input">Poker Hand</label>
                                    <input
                                        type="text"
                                        id="search-input"
                                        className="form-control"
                                        placeholder="Poker hand..."
                                        value={this.state.currentHand}
                                        onChange={this._onHandChange}/>
                                </div>
                                <div className="alert alert-info" role="alert">
                                    Please follow the format of each card's rank followed by suite and separated by spaces
                                </div>
                                {
                                    // display submit button if search string is not empty
                                    this.state.currentHand.length > 0 ?
                                        <button
                                            type="submit"
                                            className="btn btn-primary">Submit</button>
                                        :
                                        null
                                }
                            </form>
                            {
                                this.state.inputError ?
                                    <div className="alert alert-danger" role="alert">
                                        One or more cards are invalid, please check your input
                                    </div>
                                    :
                                    null
                            }
                            {
                                this.state.handRank.length > 0 ?
                                    <div className="alert alert-success" role="alert">
                                        {this.state.handRank}
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    private _onHandChange(e: React.ChangeEvent<HTMLInputElement>): void {
        // todo, add input debouncing
        const handValue: string = e.target.value;
        // reset ui after user input
        this.setState({
            currentHand: handValue,
            inputError: false,
            handRank: ''
        });
    }

    private _submitHandRank(e: React.MouseEvent<HTMLFormElement>): void {
        e.preventDefault();
        // only call api if search string is not empty
        if (this.state.currentHand.length > 0) {
            const cards: ICardInterface[] = HandService.parseHandIntoCards(this.state.currentHand);
            if (cards.length === 5) {
                this.setState({
                    handRank: HandService.calculateHandRank(cards)
                });
            } else {
                this.setState({
                    inputError: true
                });
            }
        }
    }

}

export default App;
