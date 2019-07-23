import { IMap } from "./IMap";

export class MapApi
{
    private currentDbIndex: number = -1;

    private games: Array<string> = ["ra", "ts", "yr"];
    private readyGames: Array<string> = [];

    private _apiReadyCb: Function;
    private _apiErrorCb: Function;

    constructor(readyCb: Function, errorCb: Function)
    {
        this._apiReadyCb = readyCb;
        this._apiErrorCb = errorCb;

        this.loadNextMapDb();
    }

    private loadNextMapDb(): void
    {
        this.currentDbIndex++;

        if (this.currentDbIndex >= this.games.length)
        {
            console.log("Loaded all databases");

            this._apiReadyCb();

            return;
        }

        let game: string = this.games[this.currentDbIndex];
        this.checkCache(game);
    }

    private checkCache(game: string): void
    {
        let mapsByGame = window.localStorage.getItem("results_" + game);

        if (mapsByGame == null)
        {
            if (this.readyGames.indexOf(game) > -1)
            {
                // Exists
                this.loadNextMapDb();
                return;
            }

            // Fetch data it doesn't exist
            this.fetchData(game);
        }
        else
        {
            // It already exists so skip
            this.loadNextMapDb();
        }
    }

    private fetchData(game: string): void
    {
        fetch("https://mapdb.cncnet.org/search-json.php?game=" + game + "&age=12&json=true")
            .then((response: Response) => this.onResponse(response, game))
            .catch(function (err)
            {
                console.log('Fetch Error :-S', err);
            });
    }

    private onResponse(response: Response, game: string): void
    {
        if (response.status !== 200)
        {
            this._apiErrorCb(response.status);
            return;
        }

        response.json().then((data) => 
        {
            window.localStorage.setItem("results_" + game, JSON.stringify(data));

            if (this.readyGames.indexOf(game) == -1)
            {
                this.readyGames.push(game);
            }

            this.loadNextMapDb();
        });
    }
}