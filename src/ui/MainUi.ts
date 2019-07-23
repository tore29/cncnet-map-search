import { App } from "../App";
import { IMap } from "../IMap";

export class MainUi
{
    private app: App;

    constructor(_app: App)
    {
        this.app = _app;

        let sync = document.querySelector(".syncing");
        if (sync)
        {
            sync.classList.add("hidden");
        }

        let search = document.querySelector(".search > form > input");
        if (search)
        {
            search.addEventListener("keydown", this.search.bind(this));
        }

        let raMaps = document.querySelector(".ra-maps");
        if (raMaps)
        {
            raMaps.addEventListener("click", this.onMapTypeChanged.bind(this, "ra"));
        }

        let tsMaps = document.querySelector(".ts-maps");
        if (tsMaps)
        {
            tsMaps.addEventListener("click", this.onMapTypeChanged.bind(this, "ts"));
        }

        let yrMaps = document.querySelector(".yr-maps");
        if (yrMaps)
        {
            yrMaps.addEventListener("click", this.onMapTypeChanged.bind(this, "yr"));
        }

        this.setDefaultMenu("ra"); //for now
    }

    private onMapTypeChanged(game: string): void
    {
        this.app.changeMapsByGame(game);
        this.setDefaultMenu(game);
    }

    private setDefaultMenu(game: string): void
    {
        var menuLinks = document.querySelectorAll(".menu-links > a");
        for (let i = 0; i < menuLinks.length; i++)
        {
            menuLinks[i].classList.remove("active");
        }

        var activeEl = document.querySelector("." + game + "-maps");
        if (activeEl)
        {
            activeEl.classList.add("active");
        }
    }

    private search(): void
    {
        let searchTerm: string = "";
        let searchBox = document.querySelector(".search form > input");
        if (searchBox)
        {
            searchTerm = (searchBox as HTMLInputElement).value;
        }

        let results: Array<IMap> = this.app.search.searchByName(searchTerm);
        this.updateResults(results, 30);
    }

    private updateResults(results: Array<IMap>, limit: number): void
    {
        let resultDiv: HTMLDivElement = document.querySelector(".results") as HTMLDivElement;
        if (!resultDiv)
        {
            return;
        }

        resultDiv.innerHTML = "";

        for (let i: number = 0; i < results.length; i++)
        {
            let map: IMap = results[i];
            let resultItem = this.createResult(map);

            resultDiv.appendChild(resultItem);

            // Limit results rendered
            if (i > limit)
            {
                break;
            }
        }
    }

    private createResult(map: IMap): any
    {
        let resultItem = document.createElement("div");
        let resultLink = document.createElement("a");
        resultLink.href = "http://mapdb.cncnet.org/" + map.game + "/" + map.hash + ".zip";

        resultLink.innerHTML += map.name;
        resultItem.innerHTML += "<div class='date'><strong>Date:</strong> " + map.date + "</div>";
        resultItem.innerHTML += "<div class='hash'><strong>Hash:</strong>: " + map.hash + "</div>";
        resultItem.innerHTML += "<div class='game'><strong>Game:</strong>: " + map.game + "</div>";
        resultItem.appendChild(resultLink);

        return resultItem;
    }

    /**
     * Refresh results - e.g use when data has changed
     */
    public render(): void
    {
        this.search();
    }
}