import { QueryOptions, Dictionary, DownloadType, ArrayBufferPointer, ConnectorConfigOptions, ConnectorRuntimeContext } from "Connector.Shared";
import { Media, MediaConnector, MediaConnectorCapabilities, MediaDetail, MediaPage } from "MediaConnector";

export class ContentHubConnector implements MediaConnector {
    runtime: ConnectorRuntimeContext;

    constructor(runtime: ConnectorRuntimeContext) {
        this.runtime = runtime;
    }

    query(options: QueryOptions, context: Dictionary): Promise<MediaPage> {
        this.log("query", {options, context});
        
        // return dummy collection
        return Promise.resolve({
            data: [
                {
                    id: "https://dummyimage.com/600x400/000/fff",
                    name: "test",
                    type: 0,
                    preview: {
                        url: "https://dummyimage.com/600x400/000/fff",
                        width: 272,
                        height: 92
                    },
                    relativePath: "/test",
                    metaData: {
                        "api": this.runtime.options["SITECORE_API_BASE"] ?? "not set",
                        "test": "random value"
                    }
                } as Media
            ],
            pageSize: 1,
            links: {
                nextPage: ""
            }
        });
    }
    detail(id: string, context: Dictionary): Promise<MediaDetail> {
        this.log("detail", {id, context});
        return Promise.resolve({
            id: "https://dummyimage.com/600x400/000/fff",
            name: "test",
            type: 0,
            preview: {
                url: "https://dummyimage.com/600x400/000/fff",
                width: 272,
                height: 92
            },
            extension: "png",
            width: 272,
            height: 92,
            relativePath: "/test",
            metaData: {
                "api": this.runtime.options["SITECORE_API_BASE"] ?? "not set",
                "test": "random value"
            }
        } as Media);
    }
    async download(id: string, previewType: DownloadType, context: Dictionary): Promise<ArrayBufferPointer> {
        this.log("download", {id, previewType, context});
        return (await this.runtime.fetch(id, {
            method: "GET"
        })).arrayBuffer;
    }
    upload(name: string, blob: ArrayBufferPointer, context: Dictionary): Promise<Media> {
        throw new Error("Method not implemented.");
    }
    remove(id: string, context: Dictionary): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    copy(id: string, newName: string, context: Dictionary): Promise<Media> {
        throw new Error("Method not implemented.");
    }
    getConfigurationOptions(): ConnectorConfigOptions | null {
        this.log("getConfigurationOptions", {});
        return [
            
            //@ts-ignore
            { name: "test", type: 'text', displayName: "test"}
        ]
    }
    getCapabilities(): MediaConnectorCapabilities {
        this.log("getCapabilities", {});
        return {
            copy: false,
            upload: false,
            remove: false,
            query: true,
            detail: false,
            filtering: true,
        }
    }

    // generic method log, taking a name, and a data object
    log(name: string, data: any): void {
        // print a formatted string to the console, JSON.stringify converts the data object to a string
        this.runtime.logError(`[${name}] ${JSON.stringify(data)}`);
    }
}
