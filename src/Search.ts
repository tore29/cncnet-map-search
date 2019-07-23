import { IMap } from "./IMap";

export class Search
{
    private _mapJsonFeed: Array<any> = [];

    /**
     * The json data to search with
     * @param jsonFeed 
     */
    constructor(jsonFeed: Array<IMap>)
    {
        this._mapJsonFeed = jsonFeed;
    }

    /**
     * Search by map name
     * @param name 
     */
    public searchByName(name: string): Array<any>
    {
        return this.resultsByName(name);
    }

    private resultsByName(searchTerm: string): Array<IMap>
    {
        var result: Array<IMap> = [];

        var data = this._mapJsonFeed.slice(0);

        result = data.filter((item) =>
        {
            if (item.name != null)
            {
                return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > - 1;
            }
        });

        // Latest results first
        return result.reverse();
    }
}
