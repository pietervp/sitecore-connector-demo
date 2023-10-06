export class ContentHubConnector {
    constructor(runtime) {
        this.runtime = runtime;
    }
    async query(options, context) {
        this.log("query", { options, context });
        // return dummy collection
        return Promise.resolve({
            data: [
                {
                    id: "./dummy.webp",
                    name: "test",
                    type: 0,
                    preview: {
                        url: "./dummy.webp",
                        width: 272,
                        height: 92
                    },
                    relativePath: "/test",
                    metaData: {
                        "api": this.runtime.options["SITECORE_API_BASE"] ?? "not set",
                        "test": "random value"
                    }
                }
            ],
            pageSize: 1,
            links: {
                nextPage: ""
            }
        });
    }
    async detail(id, context) {
        this.log("detail", id);
        return Promise.resolve({
            id: id,
            name: "test",
            type: 0,
            preview: {
                url: "./dummy.webp",
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
        });
    }
    async download(id, previewType, context) {
        this.log("download", { id, previewType, context });
        return (await this.runtime.fetch(id, {
            method: "GET"
        })).arrayBuffer;
    }
    upload(name, blob, context) {
        throw new Error("Method not implemented.");
    }
    remove(id, context) {
        throw new Error("Method not implemented.");
    }
    copy(id, newName, context) {
        throw new Error("Method not implemented.");
    }
    getConfigurationOptions() {
        this.log("getConfigurationOptions", {});
        return [
            //@ts-ignore
            { name: "test", type: 'text', displayName: "test" }
        ];
    }
    getCapabilities() {
        this.log("getCapabilities", {});
        return {
            copy: false,
            upload: false,
            remove: false,
            query: true,
            detail: true,
            filtering: true,
        };
    }
    // generic method log, taking a name, and a data object
    log(name, data) {
        // print a formatted string to the console, JSON.stringify converts the data object to a string
        this.runtime.logError(`[${name}] ${JSON.stringify(data)}`);
    }
}
