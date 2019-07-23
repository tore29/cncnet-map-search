import { Search } from "./Search";
import { MapApi } from "./MapApi";
import { MainUi } from "./ui/MainUi";
import { IMap } from "./IMap";

export class App
{
    private _search: Search;
    private _mainUi: MainUi;

    private apiReadyCb: Function;
    private apiErrorCb: Function;

    private _raMaps: Array<IMap> = [];
    private _tsMaps: Array<IMap> = [];
    private _yrMaps: Array<IMap> = [];

    private _activeGameSelected: string = "ra";

    private games: Array<string> = ["ra", "ts", "yr"];

    constructor()
    {
        this.apiReadyCb = this.onApiReady.bind(this);
        this.apiErrorCb = this.onApiError.bind(this);

        new MapApi(this.apiReadyCb, this.apiErrorCb);
    }

    /**
     * API Ready callback
     */
    private onApiReady(): void
    {
        console.log("App ** Map API Ready");

        try
        {
            this.parseCachedData();
        }
        catch
        {
            this.onApiError();
        }
    }

    private parseCachedData(): void
    {
        for (var i = 0; i < this.games.length; i++)
        {
            let game: string = this.games[i];
            let result = window.localStorage.getItem("results_" + game) as any;
            let maps: Array<IMap> = JSON.parse(result);

            switch (game)
            {
                case "ra":
                    this._raMaps = maps;
                    break;

                case "ts":
                    this._tsMaps = maps;
                    break;

                case "yr":
                    this._yrMaps = maps;
                    break;
            }
        }

        this._mainUi = new MainUi(this);
        this._search = new Search(this._raMaps);
        this._mainUi.render();
    }

    /**
     * API Error callback
     */
    private onApiError(): void
    {
        console.log("Api Error");
    }

    /**
     * Change maps data based on game
     * @param game 
     */
    public changeMapsByGame(game: string): void
    {
        console.log("App ** changeMapsByGame: ", game);

        this._activeGameSelected = game;

        switch (game)
        {
            case "ra":
                this._search = new Search(this._raMaps);
                break;

            case "ts":
                this._search = new Search(this._tsMaps);
                break;

            case "yr":
                this._search = new Search(this._yrMaps);
                break;
        }

        this._mainUi.render();
    }

    public get search(): Search 
    {
        return this._search;
    }

    public get raMaps(): Array<IMap> { return this._raMaps; }
    public get tsMaps(): Array<IMap> { return this._tsMaps; }
    public get yrMaps(): Array<IMap> { return this._yrMaps; }
    public get activeGameSelected(): string { return this._activeGameSelected; }
}

new App();